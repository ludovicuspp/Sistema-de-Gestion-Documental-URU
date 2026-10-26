package com.cid.sidae.tasks;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.cid.sidae")
public class TasksApplication {

    public static void main(String[] args) {
        SpringApplication.run(TasksApplication.class, args);
    }
}
