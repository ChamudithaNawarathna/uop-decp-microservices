package com.decp.post.config;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE = "post.exchange";

    @Bean
    public TopicExchange postExchange() {
        return new TopicExchange(EXCHANGE);
    }
}
