# Javaランタイムだけ持った軽量なイメージ
FROM eclipse-temurin:17-jdk-jammy



# 作業ディレクトリを作成
WORKDIR /app

# JARファイルをコピー（パスは相対）
COPY target/travel-0.0.1-SNAPSHOT.jar app.jar

# ポートを指定（Spring Bootのデフォルトポート）
EXPOSE 8080

# 起動コマンド
ENTRYPOINT ["java", "-jar", "app.jar"]