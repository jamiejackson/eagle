FROM openjdk:8-jdk as build_stage


RUN apt-get update
RUN apt-get install -y nodejs
RUN apt-get install -y --no-install-recommends gcc make libpng-dev

WORKDIR /tmp
COPY ./gradlew /tmp/gradle/
COPY ./gradle /tmp/gradle/gradle
RUN chmod a+x ./gradle/gradlew && ./gradle/gradlew

COPY ./ /app/

WORKDIR /app

RUN ./gradlew npmInstall -Dorg.gradle.daemon=false
RUN ./gradlew build -Dorg.gradle.daemon=false

FROM openjdk:8-jdk-alpine

VOLUME /tmp

EXPOSE 8080

COPY --from=build_stage /app/build/libs/app.jar /app.jar

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
