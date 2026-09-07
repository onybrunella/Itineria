package com.itineria.backend.dto;

import java.time.LocalDateTime;

public class PhotoResponse {

    private Long id;
    private String url;
    private LocalDateTime uploadedAt;

    public PhotoResponse(Long id, String url, LocalDateTime uploadedAt) {
        this.id = id;
        this.url = url;
        this.uploadedAt = uploadedAt;
    }

    public Long getId() {
        return id;
    }

    public String getUrl() {
        return url;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }
}