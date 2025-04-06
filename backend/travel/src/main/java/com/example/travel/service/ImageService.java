package com.example.travel.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageService {

  @Value("${file.upload-dir}")
  private String uploadDir;

  public String saveImage(MultipartFile file) throws IOException {
    String extension = file
      .getOriginalFilename()
      .substring(file.getOriginalFilename().lastIndexOf("."));
    String fileName = UUID.randomUUID().toString() + extension;

    Path uploadsPath = Paths.get("")
      .toAbsolutePath()
      .resolve(uploadDir)
      .normalize();
    Path savePath = uploadsPath.resolve(fileName);
    Files.createDirectories(savePath.getParent());
    file.transferTo(savePath.toFile());

    return fileName;
  }

  public void deleteImage(String filename) {
    Path uploadsPath = Paths.get("")
      .toAbsolutePath()
      .resolve(uploadDir)
      .normalize();
    Path imagePath = uploadsPath.resolve(filename);
    try {
      Files.deleteIfExists(imagePath);
    } catch (IOException e) {
      throw new RuntimeException(
        "画像ファイルの削除に失敗しました: " + filename,
        e
      );
    }
  }

  public Path getImagePath(String filename) {
    return Paths.get("").toAbsolutePath().resolve(uploadDir).resolve(filename);
  }
}
