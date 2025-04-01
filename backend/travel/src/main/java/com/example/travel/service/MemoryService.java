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
        List<Memory> memories = memoryRepository.findByUserUserId(user.getUserId());
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
}

