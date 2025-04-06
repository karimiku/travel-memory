package com.example.travel.dto;

import com.example.travel.entity.MemoryImage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MemoryImageResponse {

  private String imageUrl;
  private String comment;

  public static MemoryImageResponse fromEntity(MemoryImage image) {
    return new MemoryImageResponse(image.getImageUrl(), image.getComment());
  }
}
