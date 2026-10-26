package com.cid.sidae.students;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.cid.sidae")
public class StudentsApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudentsApplication.class, args);
    }
}
