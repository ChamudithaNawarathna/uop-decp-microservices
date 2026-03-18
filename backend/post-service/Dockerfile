FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY api-gateway/pom.xml api-gateway/pom.xml
COPY auth-service/pom.xml auth-service/pom.xml
COPY user-service/pom.xml user-service/pom.xml
COPY post-service/pom.xml post-service/pom.xml
COPY job-service/pom.xml job-service/pom.xml
COPY event-service/pom.xml event-service/pom.xml
COPY research-service/pom.xml research-service/pom.xml
COPY messaging-service/pom.xml messaging-service/pom.xml
COPY notification-service/pom.xml notification-service/pom.xml
COPY analytics-service/pom.xml analytics-service/pom.xml
COPY mentorship-service/pom.xml mentorship-service/pom.xml
RUN mvn -pl post-service -am dependency:go-offline -B
COPY post-service/src post-service/src
RUN mvn -pl post-service -am clean package -DskipTests -B

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/post-service/target/*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]
