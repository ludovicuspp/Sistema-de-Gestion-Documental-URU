package com.cid.sidae.migration;

import java.util.LinkedHashMap;
import java.util.Map;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

@Configuration
public class MigrationDataSources {

    @Bean
    public JdbcTemplate legacyJdbcTemplate(
            @Value("${legacy.jdbc-url}") String url,
            @Value("${legacy.username}") String username,
            @Value("${legacy.password}") String password) {
        return new JdbcTemplate(dataSource(url, username, password));
    }

    @Bean
    public TargetDatabases targetDatabases(
            @Value("${target.base-url:jdbc:postgresql://db:5432}") String baseUrl,
            @Value("${target.username:sidae}") String username,
            @Value("${target.password:sidae}") String password) {
        Map<String, JdbcTemplate> targets = new LinkedHashMap<>();
        targets.put("auth", template(baseUrl + "/sidae_auth", username, password));
        targets.put("catalog", template(baseUrl + "/sidae_catalog", username, password));
        targets.put("students", template(baseUrl + "/sidae_students", username, password));
        targets.put("records", template(baseUrl + "/sidae_records", username, password));
        targets.put("requests", template(baseUrl + "/sidae_requests", username, password));
        targets.put("tasks", template(baseUrl + "/sidae_tasks", username, password));
        return new TargetDatabases(targets);
    }

    private JdbcTemplate template(String url, String username, String password) {
        return new JdbcTemplate(dataSource(url, username, password));
    }

    private DataSource dataSource(String url, String username, String password) {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        return dataSource;
    }

    public record TargetDatabases(Map<String, JdbcTemplate> byService) {

        public JdbcTemplate get(String service) {
            JdbcTemplate template = byService.get(service);
            if (template == null) {
                throw new IllegalArgumentException("Sin datasource para: " + service);
            }
            return template;
        }
    }
}
