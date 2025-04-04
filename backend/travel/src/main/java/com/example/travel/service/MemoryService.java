package com.example.travel.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    @Value("${file.upload-dir}")
    private String uploadDir;

    // ✅ 思い出を画像付きで作成
    public MemoryResponse createMemoryWithImages(
            String title,
            String prefecture,
            LocalDate date,
            String description,
            List<MultipartFile> imageFiles
    ) {
        AppUser user = getAuthenticatedUser();

        Memory memory = new Memory();
        memory.setTitle(title);
        memory.setPrefecture(prefecture);
        memory.setDate(date);
        memory.setDescription(description);
        memory.setUser(user);

        List<MemoryImage> images = new ArrayList<>();
        if (imageFiles != null) {
            for (MultipartFile file : imageFiles) {
                try {
                    String originalName = file.getOriginalFilename();
                    String extension = originalName.substring(originalName.lastIndexOf("."));
                    String fileName = UUID.randomUUID().toString() + extension;

                    // アプリ起動パスから uploads ディレクトリへの絶対パスを構築
                    Path rootPath = Paths.get("").toAbsolutePath();
                    Path uploadsPath = rootPath.resolve(uploadDir).normalize();
                    Path savePath = uploadsPath.resolve(fileName);

                    // ディレクトリ作成＆保存
                    Files.createDirectories(savePath.getParent());
                    file.transferTo(savePath.toFile());

                    String imageUrl = "/auth/api/memories/" + memory.getId() + "/images/" + fileName;

                    MemoryImage img = new MemoryImage();
                    img.setImageUrl(imageUrl);
                    img.setMemory(memory);
                    images.add(img);
                } catch (IOException e) {
                    throw new RuntimeException("画像の保存に失敗しました: " + file.getOriginalFilename(), e);
                }
            }
        }

        memory.setImages(images);
        Memory saved = memoryRepository.save(memory);
        return MemoryResponse.fromEntity(saved);
    }

    // ✅ ユーザーの思い出一覧
    public List<MemoryResponse> getAllMemoriesForUser() {
        AppUser user = getAuthenticatedUser();
        List<Memory> memories = memoryRepository.findAllWithImagesByUserId(user.getId());
        return memories.stream().map(MemoryResponse::fromEntity).toList();
    }

    // ✅ 思い出詳細
    public MemoryResponse getMemoryById(Long id) {
        Memory memory = memoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("指定された思い出が見つかりません"));
        return MemoryResponse.fromEntity(memory);
    }

    // ✅ 認証ありで画像を取得（メモリID + ファイル名）
    public Resource getMemoryImage(Long memoryId, String filename) {
        AppUser user = getAuthenticatedUser();

        Memory memory = memoryRepository.findById(memoryId)
                .orElseThrow(() -> new RuntimeException("思い出が見つかりません"));

        if (!memory.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("この画像にアクセスする権限がありません");
        }

        Path rootPath = Paths.get("").toAbsolutePath();
        Path uploadsPath = rootPath.resolve(uploadDir).normalize();
        Path imagePath = uploadsPath.resolve(filename);

        if (!Files.exists(imagePath)) {
            throw new RuntimeException("画像ファイルが存在しません");
        }

        return new FileSystemResource(imagePath);
    }

    //画像追加
    public MemoryResponse addImagesToMemory(Long memoryId, List<MultipartFile> imageFiles) {
        AppUser user = getAuthenticatedUser();
    
        Memory memory = memoryRepository.findById(memoryId)
                .orElseThrow(() -> new RuntimeException("指定された思い出が見つかりません"));
    
        if (!memory.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("この思い出に画像を追加する権限がありません");
        }
    
        List<MemoryImage> newImages = new ArrayList<>();
        for (MultipartFile file : imageFiles) {
            try {
                String originalName = file.getOriginalFilename();
                String extension = originalName.substring(originalName.lastIndexOf("."));
                String fileName = UUID.randomUUID().toString() + extension;
    
                Path rootPath = Paths.get("").toAbsolutePath();
                Path uploadsPath = rootPath.resolve(uploadDir).normalize();
                Path savePath = uploadsPath.resolve(fileName);
    
                Files.createDirectories(savePath.getParent());
                file.transferTo(savePath.toFile());
    
                String imageUrl = "/uploads/" + fileName;
    
                MemoryImage img = new MemoryImage();
                img.setImageUrl(imageUrl);
                img.setMemory(memory);
                newImages.add(img);
            } catch (IOException e) {
                throw new RuntimeException("画像の保存に失敗しました: " + file.getOriginalFilename(), e);
            }
        }
    
        memory.getImages().addAll(newImages);
        memoryImageRepository.saveAll(newImages);
        Memory updated = memoryRepository.save(memory);
    
        return MemoryResponse.fromEntity(updated);
    }

    // ✅ 思い出削除
    public void deleteMemoryById(Long id) {
        Memory memory = memoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("指定された思い出が見つかりません"));
        memoryImageRepository.deleteAll(memory.getImages());
        memoryRepository.delete(memory);
    }

    // ✅ 思い出編集
    public MemoryResponse updateMemory(Long memoryId, MemoryRequest dto) {
        AppUser user = getAuthenticatedUser();
        Memory memory = memoryRepository.findById(memoryId)
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

    // ✅ 現在の認証ユーザーを取得
    private AppUser getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Object principal = auth.getPrincipal();
        String email;

        if (principal instanceof org.springframework.security.oauth2.core.user.OAuth2User oAuth2User) {
            email = oAuth2User.getAttribute("email");
        } else if (principal instanceof org.springframework.security.core.userdetails.User userDetails) {
            email = userDetails.getUsername();
        } else {
            throw new RuntimeException("ユーザー情報が取得できません。");
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません"));
    }
}