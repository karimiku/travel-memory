package com.example.travel.service;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.travel.dto.MemoryRequest;
import com.example.travel.dto.MemoryResponse;
import com.example.travel.entity.AppUser;
import com.example.travel.entity.Memory;
import com.example.travel.entity.MemoryImage;
import com.example.travel.repository.MemoryImageRepository;
import com.example.travel.repository.MemoryRepository;
import com.example.travel.repository.UserRepository;

@Service
public class MemoryService {

  @Autowired
  private MemoryRepository memoryRepository;

  @Autowired
  private MemoryImageRepository memoryImageRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private AuthService authService;

  @Autowired
  private ImageService imageService;

  public MemoryResponse createMemoryWithImages(
      String title,
      String prefecture,
      LocalDate date,
      String description,
      List<MultipartFile> imageFiles) {
    AppUser user = authService.getAuthenticatedUser();

    Memory memory = new Memory();
    memory.setTitle(title);
    memory.setPrefecture(prefecture);
    memory.setDate(date);
    memory.setDescription(description);
    memory.setUser(user);

    Memory saved = memoryRepository.save(memory);

    List<MemoryImage> images = new ArrayList<>();
    if (imageFiles != null && !imageFiles.isEmpty()) {
      for (MultipartFile file : imageFiles) {
        try {
          String fileName = imageService.saveImage(file);
          String imageUrl = "/uploads/" + fileName;

          MemoryImage img = new MemoryImage();
          img.setImageUrl(imageUrl);
          img.setMemory(saved);
          images.add(img);
        } catch (IOException e) {
          throw new RuntimeException(
              "画像の保存に失敗しました: " + file.getOriginalFilename(),
              e);
        }
      }

      memoryImageRepository.saveAll(images);
    }
    saved.setImages(images);
    return MemoryResponse.fromEntity(saved);
  }

  public List<MemoryResponse> getAllMemories() {
    AppUser user = authService.getAuthenticatedUser();
    List<Memory> memories = memoryRepository.findAllWithImagesByUserId(
        user.getId());
    return memories.stream().map(MemoryResponse::fromEntity).toList();
  }

  public Resource getMemoryImage(Long memoryId, String filename) {
    AppUser user = authService.getAuthenticatedUser();

    Memory memory = memoryRepository
        .findById(memoryId)
        .orElseThrow(() -> new RuntimeException("思い出が見つかりません"));

    if (!memory.getUser().getId().equals(user.getId())) {
      throw new RuntimeException("この画像にアクセスする権限がありません");
    }

    Path imagePath = imageService.getImagePath(filename);
    if (!imagePath.toFile().exists()) {
      throw new RuntimeException("画像ファイルが存在しません");
    }

    return new FileSystemResource(imagePath);
  }

  public MemoryResponse addImagesToMemory(
      Long memoryId,
      List<MultipartFile> imageFiles) {
    AppUser user = authService.getAuthenticatedUser();

    Memory memory = memoryRepository
        .findById(memoryId)
        .orElseThrow(() -> new RuntimeException("指定された思い出が見つかりません"));

    if (!memory.getUser().getId().equals(user.getId())) {
      throw new RuntimeException("この思い出に画像を追加する権限がありません");
    }

    List<MemoryImage> newImages = new ArrayList<>();
    for (MultipartFile file : imageFiles) {
      try {
        String fileName = imageService.saveImage(file);
        String imageUrl = "/uploads/" + fileName;

        MemoryImage img = new MemoryImage();
        img.setImageUrl(imageUrl);
        img.setMemory(memory);
        newImages.add(img);
      } catch (IOException e) {
        throw new RuntimeException(
            "画像の保存に失敗しました: " + file.getOriginalFilename(),
            e);
      }
    }

    memory.getImages().addAll(newImages);
    memoryImageRepository.saveAll(newImages);
    Memory updated = memoryRepository.save(memory);
    return MemoryResponse.fromEntity(updated);
  }

  public void deleteMemoryById(Long id) {
    Memory memory = memoryRepository
        .findById(id)
        .orElseThrow(() -> new RuntimeException("指定された思い出が見つかりません"));

    for (MemoryImage image : memory.getImages()) {
      String imageUrl = image.getImageUrl();
      String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
      imageService.deleteImage(filename);
    }

    memoryImageRepository.deleteAll(memory.getImages());
    memoryRepository.delete(memory);
  }

  public MemoryResponse updateMemory(Long memoryId, MemoryRequest dto) {
    AppUser user = authService.getAuthenticatedUser();
    Memory memory = memoryRepository
        .findById(memoryId)
        .orElseThrow(() -> new RuntimeException("指定されたIDのMemoryが見つかりません"));

    if (!memory.getUser().getId().equals(user.getId())) {
      throw new RuntimeException("この思い出を編集する権限がありません");
    }

    memory.setTitle(dto.getTitle());
    memory.setPrefecture(dto.getPrefecture());
    memory.setDate(dto.getDate());
    memory.setDescription(dto.getDescription());

    Memory updatedMemory = memoryRepository.save(memory);
    return MemoryResponse.fromEntity(updatedMemory);
  }

  public MemoryResponse addCommentToImage(
      Long memoryId,
      Long imageId,
      String comment) {
    AppUser user = authService.getAuthenticatedUser();

    Memory memory = memoryRepository
        .findById(memoryId)
        .orElseThrow(() -> new RuntimeException("思い出が見つかりません。"));

    if (!memory.getUser().getId().equals(user.getId())) {
      throw new RuntimeException(
          "この思い出にコメントを追加する権限がありません。");
    }

    MemoryImage image = memoryImageRepository
        .findById(imageId)
        .orElseThrow(() -> new RuntimeException("指定された画像が見つかりません。"));

    image.setComment(comment);
    memoryImageRepository.save(image);

    return MemoryResponse.fromEntity(memory);
  }

  public void deleteImageFromMemory(Long memoryId, Long imageId) {
    AppUser user = authService.getAuthenticatedUser();

    Memory memory = memoryRepository.findById(memoryId)
        .orElseThrow(() -> new RuntimeException("指定された思い出が見つかりません"));

    if (!memory.getUser().getId().equals(user.getId())) {
      throw new RuntimeException("この思い出を編集する権限がありません");
    }

    MemoryImage image = memoryImageRepository.findById(imageId)
        .orElseThrow(() -> new RuntimeException("指定された画像が見つかりません"));
    String filename = Paths.get(image.getImageUrl()).getFileName().toString();
    imageService.deleteImage(filename);
    memoryImageRepository.delete(image);
  }

}
