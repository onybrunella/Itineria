package com.itineria.backend.controller;

import java.util.List;
import java.util.Objects;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.itineria.backend.dto.CreatePhotoRequest;
import com.itineria.backend.dto.PhotoResponse;
import com.itineria.backend.entity.Photo;
import com.itineria.backend.entity.User;
import com.itineria.backend.service.PhotoService;

@RestController
@RequestMapping("/api/steps/{stepId}/photos")
public class PhotoController {

    private final PhotoService photoService;

    public PhotoController(PhotoService photoService) {
        Objects.requireNonNull(photoService);
        this.photoService = photoService;
    }

    @PostMapping
    public PhotoResponse createPhoto(@PathVariable Long stepId, @RequestBody CreatePhotoRequest request,
            Authentication authentication) {
        var user = (User) authentication.getPrincipal();
        var photo = photoService.createPhoto(stepId, user, request.getUrl());
        return toResponse(photo);
    }

    @GetMapping
    public List<PhotoResponse> getPhotosForStep(@PathVariable Long stepId, Authentication authentication) {
        var user = (User) authentication.getPrincipal();
        var photos = photoService.getPhotosForStep(stepId, user);
        return photos.stream().map(this::toResponse).toList();
    }

    @DeleteMapping("/{photoId}")
    public void deletePhoto(@PathVariable Long stepId, @PathVariable Long photoId, Authentication authentication) {
        var user = (User) authentication.getPrincipal();
        photoService.deletePhoto(photoId, user);
    }

    private PhotoResponse toResponse(Photo photo) {
        return new PhotoResponse(photo.getId(), photo.getUrl(), photo.getUploadedAt());
    }
}