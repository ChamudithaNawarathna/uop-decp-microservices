package com.decp.user.config;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE = "user.exchange";

    @Bean
    public TopicExchange userExchange() {
        return new TopicExchange(EXCHANGE);
    }
}