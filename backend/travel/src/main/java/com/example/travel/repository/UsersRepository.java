package com.example.travel.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.travel.entity.AppUser;

public interface UsersRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmail(String email);
    
}
