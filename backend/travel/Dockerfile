# ✅ 1. ビルドステージ：Maven で jar ファイルを作成
FROM maven:3.9.0-eclipse-temurin-17 AS build

WORKDIR /app

# 依存関係だけ先にインストールしてキャッシュ効かせる（オプション）
COPY pom.xml ./
RUN mvn dependency:go-offline

# ソースコードをコピーしてビルド
COPY . .
RUN mvn clean package -DskipTests

# ✅ 2. 実行ステージ：軽量な JDK で jar を起動
FROM openjdk:17-jdk-slim

WORKDIR /app

# jar ファイルだけをコピー
COPY --from=build /app/target/*.jar app.jar

# サーバーポート開放
EXPOSE 8080

# アプリケーション起動コマンド
ENTRYPOINT ["java", "-jar", "app.jar"]