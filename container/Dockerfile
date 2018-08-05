################################################################################
# The multiple stages are here to help to speed up re-builds.
# If we simply copy in the whole app directory structure, a change to, e.g.,
#  a PNG file, could invalidate the cache for unrelated slow operations like
#  java or npm dependency downloads. With stages whose caches only invalidate
#  when *related* files change, caches are leveraged more efficiently.
################################################################################

FROM openjdk:8-jdk as java_dependency_warmup

RUN mkdir /tmp/gradle
WORKDIR /tmp/gradle
COPY ./gradlew ./
COPY ./gradle ./gradle
COPY ./build.gradle ./
COPY ./settings.gradle ./
RUN pwd \
  && ls -al \
  && chmod a+x gradlew \
  && ./gradlew downloadDependencies -Dorg.gradle.daemon=false

# java deps are now in /root/.gradle/caches

################################################################################
FROM openjdk:8-jdk as npm_warmup

RUN apt-get update
RUN apt-get install -y --no-install-recommends gcc make libpng-dev

COPY --from=java_dependency_warmup /tmp/gradle /tmp/gradle
COPY --from=java_dependency_warmup /root/.gradle /root/.gradle

WORKDIR /tmp/gradle
# todo: copy in package-lock.json, too (once committed)
COPY ./package.json ./
RUN ./gradlew npmInstall -Dorg.gradle.daemon=false

# node is now in /root/.nodejs/10.4.0/bin
# npm packages are now in /tmp/gradle/node_modules

################################################################################
FROM openjdk:8-jdk as build_stage

RUN apt-get update
RUN apt-get install -y --no-install-recommends gcc make libpng-dev

COPY ./ /app/

# node is now in /root/.nodejs/10.4.0/bin
# npm packages are now in /tmp/gradle/node_modules
COPY --from=java_dependency_warmup /root/.gradle /root/.gradle
COPY --from=npm_warmup /root/.nodejs /root/.nodejs

WORKDIR /app
COPY --from=npm_warmup /tmp/gradle/node_modules /app/node_modules
RUN ./gradlew npmInstall build -Dorg.gradle.daemon=false
RUN ./gradlew build -Dorg.gradle.daemon=false
RUN ./gradlew bootJar -Dorg.gradle.daemon=false
# todo: add, when ready
# RUN ./gradlew sonarqube -Dorg.gradle.daemon=false

# JAR is now at /app/build/libs/app.jar

LABEL test=true

################################################################################
FROM openjdk:8-jdk-alpine

VOLUME /tmp

EXPOSE 8080

COPY --from=build_stage /app/build/libs/app.jar /app.jar

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
