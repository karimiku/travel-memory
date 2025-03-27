package com.example.travel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.travel.entity.Wishlists;

public interface WishlistsRepository extends JpaRepository<Wishlists, Long> {
    List<Wishlists> findByUser_UserId(Long userId);
    
}
