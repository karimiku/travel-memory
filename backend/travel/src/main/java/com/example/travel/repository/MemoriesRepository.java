package com.example.travel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.travel.entity.Memories;

public interface MemoriesRepository extends JpaRepository<Memories, Long> {
    List<Memories> findByLocation_LocationId(Long locationId);
    
}
