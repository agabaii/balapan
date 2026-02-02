package kz.balapan.balapan_language.controller;

import kz.balapan.balapan_language.model.User;
import kz.balapan.balapan_language.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String email = request.get("email");
            String password = request.get("password");
            String nativeLanguage = request.getOrDefault("nativeLanguage", "ru");

            User user = userService.createUser(username, email, password, nativeLanguage);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message",
                    "Тіркелу сәтті өтті! Растау коды поштаңызға жіберілді. Регистрация успешна! Код подтверждения отправлен на почту.");
            response.put("userId", user.getId());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String code = request.get("code");

            userService.verifyUser(email, code);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Пошта сәтті расталды! Почта успешно подтверждена!");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String password = request.get("password");

            User user = userService.login(username, password);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Кіру сәтті! Вход выполнен!");
            response.put("user", user);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/{id}/xp")
    public ResponseEntity<User> addXp(@PathVariable Long id, @RequestBody Map<String, Integer> request) {
        int xp = request.get("xp");
        User user = userService.addXp(id, xp);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/{id}/streak")
    public ResponseEntity<User> updateStreak(@PathVariable Long id, @RequestBody Map<String, Integer> request) {
        int streak = request.get("streak");
        User user = userService.updateStreak(id, streak);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            userService.initiatePasswordReset(email);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message",
                    "Қалпына келтіру коды поштаңызға жіберілді. Код восстановления отправлен на почту.");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String code = request.get("code");
            String newPassword = request.get("newPassword");

            userService.resetPassword(email, code, newPassword);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Пароль успешно изменен! Теперь вы можете войти.");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}