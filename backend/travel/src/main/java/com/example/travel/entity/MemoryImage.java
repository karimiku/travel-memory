package com.example.travel.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "memory_images")
@NoArgsConstructor
@AllArgsConstructor
public class MemoryImage {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String imageUrl; // 画像のURLを保存

  @Column(length = 500, nullable = true)
  private String comment; // 各画像に対するコメント（任意）

  @ManyToOne
  @JoinColumn(name = "memory_id", nullable = false)
  @JsonBackReference
  private Memory memory;
}
