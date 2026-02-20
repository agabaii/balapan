package kz.balapan.balapan_language.service;

import kz.balapan.balapan_language.model.User;
import kz.balapan.balapan_language.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MailService mailService;

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    public User createUser(String username, String email, String password, String nativeLanguage) {
        // Валидация username
        if (username == null || username.trim().length() < 3) {
            throw new RuntimeException("Username должен быть минимум 3 символа");
        }
        if (username.length() > 50) {
            throw new RuntimeException("Username слишком длинный (максимум 50 символов)");
        }

        // Валидация email
        if (email == null || !EMAIL_PATTERN.matcher(email).matches()) {
            throw new RuntimeException("Неверный формат email");
        }

        // Валидация пароля
        if (password == null || password.length() < 6) {
            throw new RuntimeException("Пароль должен быть минимум 6 символов");
        }
        if (password.length() > 100) {
            throw new RuntimeException("Пароль слишком длинный");
        }

        // Проверка на существование
        if (userRepository.existsByUsername(username.trim())) {
            throw new RuntimeException("Пользователь с таким username уже существует");
        }
        if (userRepository.existsByEmail(email.toLowerCase().trim())) {
            throw new RuntimeException("Пользователь с таким email уже существует");
        }

        User user = new User();
        user.setUsername(username.trim());
        user.setEmail(email.toLowerCase().trim());
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setNativeLanguage(nativeLanguage != null ? nativeLanguage : "ru");
        user.setCurrentStreak(0);
        user.setLongestStreak(0);
        user.setTotalXp(0);
        user.setIsVerified(false);

        // Generate verification code
        String code = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setVerificationCode(code);

        User savedUser = userRepository.save(user);

        // Send verification email
        try {
            mailService.sendVerificationCode(savedUser.getEmail(), code);
        } catch (Exception e) {
            System.err.println("Failed to send verification email: " + e.getMessage());
            // We still save the user, but they might need a way to resend the code
        }

        return savedUser;
    }

    public void verifyUser(String email, String code) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("Пользователь с таким email не найден"));

        if (Boolean.TRUE.equals(user.getIsVerified())) {
            throw new RuntimeException("Пользователь уже подтвержден");
        }

        if (user.getVerificationCode() == null || !user.getVerificationCode().equals(code)) {
            throw new RuntimeException("Неверный код подтверждения");
        }

        user.setIsVerified(true);
        user.setVerificationCode(null);
        userRepository.save(user);
    }

    public User login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Неверный username или пароль"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Неверный username или пароль");
        }

        if (!Boolean.TRUE.equals(user.getIsVerified())) {
            throw new RuntimeException("Пожалуйста, подтвердите ваш email перед входом");
        }

        updateLastLogin(user.getId());
        return user;
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findById(Long id) {
        @SuppressWarnings("null")
        Optional<User> user = userRepository.findById(id);
        return user;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateStreak(Long userId, int streak) {
        @SuppressWarnings("null")
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setCurrentStreak(streak);
        if (streak > user.getLongestStreak()) {
            user.setLongestStreak(streak);
        }

        return userRepository.save(user);
    }

    public User addXp(Long userId, int xp) {
        @SuppressWarnings("null")
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setTotalXp(user.getTotalXp() + xp);

        return userRepository.save(user);
    }

    public void updateLastLogin(Long userId) {
        @SuppressWarnings("null")
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
    }

    public void initiatePasswordReset(String email) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("Пользователь с таким email не найден"));

        // Generate 6 digit code
        String code = String.format("%06d", new java.util.Random().nextInt(999999));

        user.setResetToken(code);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        // Send email
        mailService.sendResetPasswordCode(email, code);

        System.out.println("============== PASSWORD RESET ==============");
        System.out.println("Email: " + email);
        System.out.println("Code: " + code);
        System.out.println("============================================");
    }

    public void resetPassword(String email, String code, String newPassword) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("Пользователь с таким email не найден"));

        if (user.getResetToken() == null || !user.getResetToken().equals(code)) {
            throw new RuntimeException("Неверный код восстановления");
        }

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Срок действия кода истек");
        }

        if (newPassword == null || newPassword.length() < 6) {
            throw new RuntimeException("Пароль должен быть минимум 6 символов");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }
}