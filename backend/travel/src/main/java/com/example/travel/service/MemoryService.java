package com.example.travel.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

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

    public MemoryResponse createMemory(MemoryRequest dto) {
        AppUser user = getAuthenticatedUser();

        // Memoryエンティティ作成
        Memory memory = new Memory();
        memory.setTitle(dto.getTitle());
        memory.setPrefecture(dto.getPrefecture());
        memory.setDate(dto.getDate());
        memory.setDescription(dto.getDescription());
        memory.setUser(user);

        // 画像リスト変換
        List<MemoryImage> images = dto.getImageUrls().stream().map(url -> {
            MemoryImage img = new MemoryImage();
            img.setImageUrl(url);
            img.setMemory(memory);
            return img;
        }).toList();
        
        memory.setImages(images);

        // DB保存
        Memory savedMemory = memoryRepository.save(memory);

        // DTOに変換して返す
        return MemoryResponse.fromEntity(savedMemory);
    }

    public List<MemoryResponse> getAllMemoriesForUser() {
        AppUser user = getAuthenticatedUser();
        List<Memory> memories = memoryRepository.findAllWithImagesByUserId(user.getId());
        return memories.stream().map(memory -> {
            MemoryResponse res = new MemoryResponse();
            res.setId(memory.getId());
            res.setTitle(memory.getTitle());
            res.setPrefecture(memory.getPrefecture());
            res.setDate(memory.getDate());
            res.setDescription(memory.getDescription());
            res.setImageUrls(
                memory.getImages().stream()
                    .map(MemoryImage::getImageUrl)
                    .toList()
            );
            return res;
        }).toList();

    }

    public MemoryResponse updateMemory(Long memoryId, MemoryRequest dto){
        AppUser user = getAuthenticatedUser();
        Memory memory = memoryRepository.findById(memoryId)
                .orElseThrow(() -> new RuntimeException("指定されたIDのMemoryが見つかりません"));

        if(!memory.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("この思い出を編集する権限がありません");
        }

        memory.setTitle(dto.getTitle());
        memory.setPrefecture(dto.getPrefecture());
        memory.setDate(dto.getDate());
        memory.setDescription(dto.getDescription());

        Memory updatedMemory = memoryRepository.save(memory);

        return MemoryResponse.fromEntity(updatedMemory);


    }

    private AppUser getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email;
        Object principal = authentication.getPrincipal();
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

    public MemoryResponse getMemoryById(Long id) {
        Memory memory = memoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("指定された思い出が見つかりません"));
        
        return MemoryResponse.fromEntity(memory);
    }

    public void deleteMemoryById(Long id) {
        Memory memory = memoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("指定された思い出が見つかりません"));
        List<MemoryImage> images = memory.getImages();
        for (MemoryImage image : images) {
            memoryImageRepository.deleteById(image.getId());
        }
        memoryRepository.deleteById(id);
    }
}

