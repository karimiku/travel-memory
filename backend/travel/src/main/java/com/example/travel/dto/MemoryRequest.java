// dto/MemoryRequestDto.java
package com.example.travel.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.Data;

@Data
public class MemoryRequest {
    private String title;
    private String prefecture;
    private LocalDate date;
    private String description;
    private List<String> imageUrls; // 複数画像URL
}