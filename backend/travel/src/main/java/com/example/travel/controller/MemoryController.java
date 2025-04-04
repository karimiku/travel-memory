package com.example.travel.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.travel.dto.MemoryRequest;
import com.example.travel.dto.MemoryResponse;
import com.example.travel.service.MemoryService;

@RestController
@RequestMapping("/auth/api/memories")
public class MemoryController {

    @Autowired
    private MemoryService memoryService;

    // ✅ 思い出作成（画像付き）
    @PostMapping
    public ResponseEntity<?> createMemory(
            @RequestParam("title") String title,
            @RequestParam("prefecture") String prefecture,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam("description") String description,
            @RequestParam(value = "images", required = false) List<MultipartFile> images
    ) {
        memoryService.createMemoryWithImages(title, prefecture, date, description, images);
        return ResponseEntity.ok("思い出が保存されました！");
    }

    // ✅ ユーザーの思い出一覧取得
    @GetMapping
    public ResponseEntity<List<MemoryResponse>> getUserAllMemories() {
        List<MemoryResponse> memories = memoryService.getAllMemoriesForUser();
        return ResponseEntity.ok(memories);
    }

    // ✅ 思い出更新（画像除く）
    @PutMapping("/{id}")
    public ResponseEntity<MemoryResponse> updateMemory(@PathVariable("id") Long memoryId, @RequestBody MemoryRequest dto) {
        MemoryResponse updatedMemory = memoryService.updateMemory(memoryId, dto);
        return ResponseEntity.ok(updatedMemory);
    }

    // ✅ 特定の思い出取得
    @GetMapping("/{id}")
    public ResponseEntity<MemoryResponse> getMemoryById(@PathVariable Long id) {
        MemoryResponse memory = memoryService.getMemoryById(id);
        return ResponseEntity.ok(memory);
    }

    // ✅ 特定の思い出の画像取得
    @GetMapping("/{id}/images/{filename}")
    public ResponseEntity<Resource> getMemoryImage(
        @PathVariable Long id,
        @PathVariable String filename
) {
    Resource image = memoryService.getMemoryImage(id, filename);
    return ResponseEntity.ok()
            .contentType(MediaType.IMAGE_JPEG) // PNGなら MediaType.IMAGE_PNG
            .body(image);
}
    // ✅ 思い出の画像追加
    @PostMapping("/{id}/images")
    public ResponseEntity<MemoryResponse> addImagesToMemory(
        @PathVariable Long id,
        @RequestParam("images") List<MultipartFile> images
        ) {
    MemoryResponse updatedMemory = memoryService.addImagesToMemory(id, images);
    return ResponseEntity.ok(updatedMemory);
}


    // ✅ 思い出削除
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMemory(@PathVariable Long id) {
        memoryService.deleteMemoryById(id);
        return ResponseEntity.noContent().build();
    }
}