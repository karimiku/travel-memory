package com.example.travel.repository;

import com.example.travel.entity.Memory;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MemoryRepository extends JpaRepository<Memory, Long> {
  // ユーザーIDからその人の思い出を取得
  List<Memory> findByUserId(Long userId);

  @Query(
    "SELECT DISTINCT m FROM Memory m LEFT JOIN FETCH m.images WHERE m.user.id = :userId"
  )
  List<Memory> findAllWithImagesByUserId(@Param("userId") Long userId);
}
