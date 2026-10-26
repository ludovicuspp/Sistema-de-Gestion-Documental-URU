# Build generico para cualquier microservicio del parent Maven.
# Uso: docker build --build-arg SERVICE=auth-service .
FROM maven:3.9-eclipse-temurin-21 AS build
ARG SERVICE
WORKDIR /app

COPY pom.xml .
COPY commons/pom.xml commons/pom.xml
COPY auth-service/pom.xml auth-service/pom.xml
COPY catalog-service/pom.xml catalog-service/pom.xml
COPY students-service/pom.xml students-service/pom.xml
COPY records-service/pom.xml records-service/pom.xml
COPY requests-service/pom.xml requests-service/pom.xml
COPY tasks-service/pom.xml tasks-service/pom.xml
COPY reports-service/pom.xml reports-service/pom.xml

RUN --mount=type=cache,target=/root/.m2,sharing=locked mvn -B -pl "${SERVICE}" -am -DskipTests dependency:go-offline || true

COPY . .
RUN --mount=type=cache,target=/root/.m2,sharing=locked mvn -B -pl "${SERVICE}" -am -DskipTests package \
    && cp "${SERVICE}"/target/*.jar /app/application.jar

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S sidae && adduser -S sidae -G sidae \
    && mkdir -p /data/documents && chown -R sidae:sidae /data
COPY --from=build /app/application.jar application.jar
USER sidae

ENV JAVA_OPTS="-XX:MaxRAMPercentage=75 -XX:+UseG1GC"
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/application.jar"]
