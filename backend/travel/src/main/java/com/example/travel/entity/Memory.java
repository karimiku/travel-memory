package com.example.travel.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "memories")
@NoArgsConstructor
@AllArgsConstructor
public class Memory {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String title;

  @Column(nullable = false)
  private String prefecture;

  @Column(nullable = true)
  private LocalDate date; // 任意の日付け

  @Column(columnDefinition = "TEXT", nullable = true)
  private String description; // 任意の詳細（自由記述）

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private AppUser user;

  @OneToMany(
    mappedBy = "memory",
    cascade = CascadeType.ALL,
    orphanRemoval = true
  )
  @JsonManagedReference
  private List<MemoryImage> images;
}
