// dto/MemoryRequestDto.java
package com.example.travel.dto;

import java.time.LocalDate;

import lombok.Data;

//思い出の編集リクエストを受け取る
@Data
public class MemoryRequest {
  private Number id;
  private String title;
  private String prefecture;
  private LocalDate date;
  private String description;

  // ゲッターとセッター
  public Number getId() {
    return id;
  }

  public void setId(Number id) {
    this.id = id;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getPrefecture() {
    return prefecture;
  }

  public void setPrefecture(String prefecture) {
    this.prefecture = prefecture;
  }

  public LocalDate getDate() {
    return date;
  }

  public void setDate(LocalDate date) {
    this.date = date;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }
}
