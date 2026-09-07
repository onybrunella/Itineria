package com.itineria.backend.service;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;


import com.itineria.backend.entity.Photo;
import com.itineria.backend.entity.User;
import com.itineria.backend.repository.PhotoRepository;

@Service
public class PhotoService {

    private final PhotoRepository photoRepository;
    private final StepService stepService;

    public PhotoService(PhotoRepository photoRepository, StepService stepService){
        Objects.requireNonNull(photoRepository);
        this.photoRepository=photoRepository;
        Objects.requireNonNull(stepService);
        this.stepService=stepService;
    }

    public Photo createPhoto(Long stepId, User user, String url){
        var step = stepService.getStep(stepId, user);
        var photo=new Photo(url);
        photo.setStep(step);
        return photoRepository.save(photo);

    }

    public List<Photo> getPhotosForStep(Long stepId, User user) {
        var step=stepService.getStep(stepId, user);
        return photoRepository.findByStep(step);
    }

    public void deletePhoto(Long photoId, User user){
        var photo=photoRepository.findById(photoId).orElseThrow(()-> new IllegalArgumentException("Cette photo n'existe pas."));
        if(!Objects.equals(photo.getStep().getTrip().getUser().getId(), user.getId())){
            throw new AccessDeniedException("Vous n'avez pas accès à cette photo.");
        }
        photoRepository.delete(photo);

    }
    
}
