package kz.balapan.balapan_language;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BalapanApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(BalapanApplication.class, args);
        System.out.println("🚀 Balapan Language Learning Platform Started!");
        System.out.println("📚 Ready to learn Kazakh language!");
    }
}