package com.example.travel.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import com.example.travel.entity.Memory;

import lombok.Data;

@Data
public class MemoryResponse {
    private Long id;
    private String title;
    private String prefecture;
    private LocalDate date;
    private String description;
    private List<String> imageUrls; // 複数画像URL

    public static MemoryResponse fromEntity(Memory memory) {
        MemoryResponse dto = new MemoryResponse();
        dto.id = memory.getId();
        dto.title = memory.getTitle();
        dto.prefecture = memory.getPrefecture();
        dto.date = memory.getDate();
        dto.description = memory.getDescription();
        dto.imageUrls = memory.getImages().stream()
                .map(image -> image.getImageUrl())
                .collect(Collectors.toList());
        return dto;
    }
    
}
