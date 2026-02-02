package kz.balapan.balapan_language.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.mail.app-name}")
    private String appName;

    public void sendVerificationCode(String toEmail, String code) {
        String subject = appName + " - Код растау / Код подтверждения";
        String content = "Сәлеметсіз бе!\n\n" +
                "Тіркелуді аяқтау үшін растау коды: " + code + "\n\n" +
                "Здравствуйте!\n\n" +
                "Ваш код подтверждения для завершения регистрации: " + code + "\n\n" +
                "Құрметпен, " + appName;

        sendEmail(toEmail, subject, content);
    }

    public void sendResetPasswordCode(String toEmail, String code) {
        String subject = appName + " - Құпия сөзді қайта орнату / Сброс пароля";
        String content = "Сәлеметсіз бе!\n\n" +
                "Құпия сөзді қайта орнату коды: " + code + "\n\n" +
                "Здравствуйте!\n\n" +
                "Код для сброса вашего пароля: " + code + "\n\n" +
                "Құрметпен, " + appName;

        sendEmail(toEmail, subject, content);
    }

    private void sendEmail(String toEmail, String subject, String content) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(content);
        mailSender.send(message);
    }
}
