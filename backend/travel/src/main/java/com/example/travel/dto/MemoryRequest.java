// dto/MemoryRequestDto.java
package com.example.travel.dto;

import java.time.LocalDate;
import lombok.Data;

//思い出の編集リクエストを受け取る
@Data
public class MemoryRequest {

  private String title;
  private String prefecture;
  private LocalDate date;
  private String description;
}
