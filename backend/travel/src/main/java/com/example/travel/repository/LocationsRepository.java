package com.example.travel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.travel.entity.Locations;

public interface LocationsRepository extends JpaRepository<Locations, Long>{
    List<Locations> findByUser_UserId(Long userId);    
}
