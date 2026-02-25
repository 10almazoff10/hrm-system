# Используем образ, где Maven уже установлен
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Копируем только pom.xml и качаем зависимости
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Копируем исходники и собираем
COPY src ./src
RUN mvn clean package -DskipTests

# Финальный образ (тот же JRE)
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]