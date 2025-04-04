// controller/MemoryController.java
package com.example.travel.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.travel.dto.MemoryRequest;
import com.example.travel.dto.MemoryResponse;
import com.example.travel.service.MemoryService;



@RestController
@RequestMapping("/auth/api/memories")
public class MemoryController {

    @Autowired
    private MemoryService memoryService;

    @PostMapping
    public ResponseEntity<MemoryResponse> createMemory(@RequestBody MemoryRequest dto) {
        MemoryResponse createdMemory = memoryService.createMemory(dto);
        return ResponseEntity.ok(createdMemory);
    }

    @GetMapping
    public ResponseEntity<List<MemoryResponse>> getUserAllMemoryies() {
        List<MemoryResponse> memories = memoryService.getAllMemoriesForUser();
        return ResponseEntity.ok(memories);
    }
    
    //写真以外の更新
    @PutMapping("/{id}")
    public ResponseEntity<MemoryResponse> updateMemory(@PathVariable("id") Long memoryid, @RequestBody MemoryRequest dto) {
        MemoryResponse updatedMemory = memoryService.updateMemory(memoryid, dto);
        return ResponseEntity.ok(updatedMemory);
    }
    
    //特定のMemoryーを取得
    @GetMapping("/{id}")
    public ResponseEntity<MemoryResponse> getMemoryById(@PathVariable Long id) {
    MemoryResponse memory = memoryService.getMemoryById(id);
    return ResponseEntity.ok(memory);
    }

    //特定のMemoryを削除
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMemory(@PathVariable Long id) {
        memoryService.deleteMemoryById(id);
        return ResponseEntity.noContent().build();
    }
}

    
    

