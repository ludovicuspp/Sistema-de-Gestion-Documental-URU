package com.cid.sidae.migration;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(
        scanBasePackages = "com.cid.sidae.migration",
        exclude = DataSourceAutoConfiguration.class)
public class MigrationRunnerApplication {

    public static void main(String[] args) {
        System.exit(SpringApplication.exit(SpringApplication.run(MigrationRunnerApplication.class, args)));
    }
}
