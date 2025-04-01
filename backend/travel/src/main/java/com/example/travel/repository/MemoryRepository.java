package com.example.travel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.travel.entity.Memory;

@Repository
public interface MemoryRepository extends JpaRepository<Memory, Long> {
    // ユーザーIDからその人の思い出を取得
    List<Memory> findByUserUserId(Long userId);
}