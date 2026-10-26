package com.cid.sidae.requests;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.cid.sidae")
public class RequestsApplication {

    public static void main(String[] args) {
        SpringApplication.run(RequestsApplication.class, args);
    }
}
