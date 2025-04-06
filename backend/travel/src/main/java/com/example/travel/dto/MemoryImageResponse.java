package com.example.travel.dto;

import com.example.travel.entity.MemoryImage;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MemoryImageResponse {
  private Long id;
  private String imageUrl;
  private String comment;

  public static MemoryImageResponse fromEntity(MemoryImage image) {
    return new MemoryImageResponse(
        image.getId(),
        image.getImageUrl(),
        image.getComment());
  }
}