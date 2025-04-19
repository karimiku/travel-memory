package com.example.travel.dto;

import com.example.travel.entity.MemoryImage;

public class MemoryImageResponse {
  private Long id;
  private String imageUrl;
  private String comment;

  public MemoryImageResponse() {
  }

  public MemoryImageResponse(Long id, String imageUrl, String comment) {
    this.id = id;
    this.imageUrl = imageUrl;
    this.comment = comment;
  }

  // ゲッターとセッター
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getImageUrl() {
    return imageUrl;
  }

  public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
  }

  public String getComment() {
    return comment;
  }

  public void setComment(String comment) {
    this.comment = comment;
  }

  public static MemoryImageResponse fromEntity(MemoryImage image) {
    return new MemoryImageResponse(
        image.getId(),
        image.getImageUrl(),
        image.getComment());
  }
}