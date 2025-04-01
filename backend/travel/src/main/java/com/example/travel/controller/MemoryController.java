// controller/MemoryController.java
package com.example.travel.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
    
}