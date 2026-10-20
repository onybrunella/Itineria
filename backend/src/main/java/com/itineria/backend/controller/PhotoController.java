package com.itineria.backend.controller;

import java.util.List;
import java.util.Objects;

import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
    public PhotoResponse createPhoto(@PathVariable Long stepId, @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        var user = (User) authentication.getPrincipal();
        var photo = photoService.createPhoto(stepId, user, file);
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
        photoService.deletePhoto(stepId, photoId, user);
    }

    @GetMapping("/{photoId}/file")
    public ResponseEntity<Resource> getPhotoFile(@PathVariable Long stepId, @PathVariable Long photoId,
            Authentication authentication) {
        var user = (User) authentication.getPrincipal();
        var photo = photoService.getOwnedPhoto(stepId, photoId, user);
        return ResponseEntity.ok()
                .contentType(mediaTypeFor(photo.getUrl()))
                .body(photoService.loadFile(photo));
    }

    private MediaType mediaTypeFor(String key) {
        var name = key.toLowerCase();
        if (name.endsWith(".png")) {
            return MediaType.IMAGE_PNG;
        }
        if (name.endsWith(".webp")) {
            return MediaType.parseMediaType("image/webp");
        }
        if (name.endsWith(".jpg") || name.endsWith(".jpeg")) {
            return MediaType.IMAGE_JPEG;
        }
        return MediaType.APPLICATION_OCTET_STREAM;
    }

    private PhotoResponse toResponse(Photo photo) {
        return new PhotoResponse(photo.getId(), photo.getUrl(), photo.getUploadedAt());
    }
}
