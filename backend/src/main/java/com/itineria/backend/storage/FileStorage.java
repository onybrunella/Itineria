package com.itineria.backend.storage;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;

public interface FileStorage {

    String save(MultipartFile file);
    Resource load(String key);
    void delete(String key);
} 