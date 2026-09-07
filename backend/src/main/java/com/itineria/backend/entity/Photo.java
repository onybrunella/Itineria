package com.itineria.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "photos")
public class Photo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "step_id")
    private Step step;

    @Column(name = "url_photo", nullable = false)
    private String url;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    protected Photo() {
    }
 
    public Photo(String url) {
        Objects.requireNonNull(url);
        this.url = url;
        this.uploadedAt = LocalDateTime.now();
    }
 
    public Long getId() {
        return id;
    }
 
    public void setId(Long id) {
        this.id = id;
    }
 
    public Step getStep() {
        return step;
    }
 
    public void setStep(Step step) {
        this.step = step;
    }
 
    public String getUrl() {
        return url;
    }
 
    public void setUrl(String url) {
        this.url = url;
    }
 
    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }
 
    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
 