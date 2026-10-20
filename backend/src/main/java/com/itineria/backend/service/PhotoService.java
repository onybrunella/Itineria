package com.itineria.backend.service;

import java.util.List;
import java.util.Objects;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.itineria.backend.entity.Photo;
import com.itineria.backend.entity.User;
import com.itineria.backend.repository.PhotoRepository;
import com.itineria.backend.storage.FileStorage;

@Service
public class PhotoService {

    private final PhotoRepository photoRepository;
    private final StepService stepService;
    private final FileStorage fileStorage;

    public PhotoService(PhotoRepository photoRepository, StepService stepService, FileStorage fileStorage) {
        Objects.requireNonNull(photoRepository);
        this.photoRepository = photoRepository;
        Objects.requireNonNull(stepService);
        this.stepService = stepService;
        Objects.requireNonNull(fileStorage);
        this.fileStorage = fileStorage;
    }

    public Photo createPhoto(Long stepId, User user, MultipartFile file) {
        var step = stepService.getStep(stepId, user);
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fichier manquant.");
        }
        var contentType = file.getContentType();
        if (contentType == null
                || !(contentType.equals("image/jpeg")
                    || contentType.equals("image/png")
                    || contentType.equals("image/webp"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Type de fichier non autorisé.");
        }
        var key = fileStorage.save(file);
        var photo = new Photo(key);
        photo.setStep(step);
        return photoRepository.save(photo);
    }

    public Photo getOwnedPhoto(Long stepId, Long photoId, User user) {
        var photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cette photo n'existe pas."));
        if (!Objects.equals(photo.getStep().getId(), stepId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cette photo n'existe pas.");
        }
        if (!Objects.equals(photo.getStep().getTrip().getUser().getId(), user.getId())) {
            throw new AccessDeniedException("Vous n'avez pas accès à cette photo.");
        }
        return photo;
    }

    public Resource loadFile(Photo photo) {
        return fileStorage.load(photo.getUrl());
    }

    public List<Photo> getPhotosForStep(Long stepId, User user) {
        var step = stepService.getStep(stepId, user);
        return photoRepository.findByStep(step);
    }

    public void deletePhoto(Long stepId, Long photoId, User user) {
        var photo = getOwnedPhoto(stepId, photoId, user);
        fileStorage.delete(photo.getUrl());
        photoRepository.delete(photo);
    }
}
