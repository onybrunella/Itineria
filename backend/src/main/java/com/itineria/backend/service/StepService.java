package com.itineria.backend.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.itineria.backend.dto.ItineraryResponse;
import com.itineria.backend.dto.StepResponse;
import com.itineria.backend.entity.Step;
//import com.itineria.backend.entity.Trip;
import com.itineria.backend.entity.User;
import com.itineria.backend.repository.StepRepository;
import com.itineria.backend.repository.PhotoRepository;
import com.itineria.backend.util.DistanceUtils;
import com.itineria.backend.storage.FileStorage;

@Service
public class StepService {

    private final StepRepository stepRepository;
    private final TripService tripService;
    private final PhotoRepository photoRepository;
    private final FileStorage fileStorage;

    public StepService(StepRepository stepRepository, TripService tripService,
        PhotoRepository photoRepository, FileStorage fileStorage) {
        Objects.requireNonNull(stepRepository);
        this.stepRepository = stepRepository;
        Objects.requireNonNull(tripService);
        this.tripService = tripService;
        Objects.requireNonNull(photoRepository);
        this.photoRepository = photoRepository;
        Objects.requireNonNull(fileStorage);
        this.fileStorage = fileStorage;
    }

    public Step createStep(Long tripId, User user, String locationName, Double latitude, Double longitude,
            LocalDate date, String note, Integer orderIndex) {
        var trip = tripService.getTrip(tripId, user);
        var step = new Step(locationName, latitude, longitude, date, note, orderIndex);
        step.setTrip(trip);

        return stepRepository.save(step);
    }

    public List<Step> getStepsForTrip(Long tripId, User user) {
        var trip = tripService.getTrip(tripId, user);
        return stepRepository.findByTripOrderByOrderIndexAsc(trip);
    }

    /*
     * public ItineraryResponse getItinerary(Long tripId, User user){
     * var steps = getStepsForTrip(tripId, user);
     * var totalDistance=calculateTotalDistance(steps);
     * return new ItineraryResponse(steps, totalDistance);
     * }
     */

    public ItineraryResponse getItinerary(Long tripId, User user) {
        var steps = getStepsForTrip(tripId, user);
        var totalDistance = calculateTotalDistance(steps);
        var stepResponses = steps.stream().map(this::toStepResponse).toList();
        return new ItineraryResponse(stepResponses, totalDistance);
    }

    private StepResponse toStepResponse(Step step) {
        return new StepResponse(
                step.getId(),
                step.getLocationName(),
                step.getLatitude(),
                step.getLongitude(),
                step.getDate(),
                step.getNote(),
                step.getOrderIndex());
    }

    public Step getStep(Long stepId, User user) {
        var step = stepRepository.findById(stepId)
                .orElseThrow(() -> new IllegalArgumentException("Cette étape n'existe pas."));

        if (!Objects.equals(step.getTrip().getUser().getId(), user.getId())) {
            throw new AccessDeniedException("Vous n'avez pas accès à cette étape.");
        }

        return step;
    }

    public Step updateStep(Long stepId, User user, String locationName, Double latitude, Double longitude,
            LocalDate date, String note, Integer orderIndex) {
        var step = getStep(stepId, user);

        step.setLocationName(locationName);
        step.setLatitude(latitude);
        step.setLongitude(longitude);
        step.setDate(date);
        step.setNote(note);
        step.setOrderIndex(orderIndex);

        return stepRepository.save(step);
    }

    /*public void deleteStep(Long stepId, User user) {
        var step = getStep(stepId, user);
        stepRepository.delete(step);
    }*/
   @Transactional
    public void deleteStep(Long stepId, User user) {
    var step = getStep(stepId, user);
    var photos = photoRepository.findByStep(step);
    for (var photo : photos) {
        fileStorage.delete(photo.getUrl());
        photoRepository.delete(photo);
    }
    stepRepository.delete(step);
    }

    public double calculateTotalDistance(List<Step> steps) {
        double totalDistance = 0;

        for (int i = 0; i < steps.size() - 1; i++) {
            Step current = steps.get(i);
            Step next = steps.get(i + 1);

            totalDistance += DistanceUtils.calculateDistanceKm(
                    current.getLatitude(), current.getLongitude(),
                    next.getLatitude(), next.getLongitude());
        }

        return totalDistance;
    }
}