package com.example.travel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.travel.entity.MemoryImage;

@Repository
public interface MemoryImageRepository extends JpaRepository<MemoryImage, Long> {
    // 特定の思い出に紐づく画像一覧を取得
    List<MemoryImage> findByMemoryId(Long memoryId);
}