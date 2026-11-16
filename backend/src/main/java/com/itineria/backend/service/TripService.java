package com.itineria.backend.service;

import com.itineria.backend.entity.*;
import com.itineria.backend.repository.PhotoRepository;
import com.itineria.backend.repository.StepRepository;
import com.itineria.backend.repository.TripRepository;
import com.itineria.backend.storage.FileStorage;

import org.springframework.security.access.AccessDeniedException;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TripService {
    private final TripRepository tripRepository;
    private final StepRepository stepRepository;
    private final PhotoRepository photoRepository;
    private final FileStorage fileStorage;

    public TripService(TripRepository tripRepository, StepRepository stepRepository, PhotoRepository photoRepository,
            FileStorage fileStorage) {
        Objects.requireNonNull(tripRepository);
        Objects.requireNonNull(stepRepository);
        Objects.requireNonNull(photoRepository);
        Objects.requireNonNull(fileStorage);
        this.tripRepository = tripRepository;
        this.stepRepository = stepRepository;
        this.photoRepository = photoRepository;
        this.fileStorage = fileStorage;
    }

    public Trip createTrip(String title, String description, LocalDate startDate, LocalDate endDate, TripStatus status,
            User user) {
        var trip = new Trip(title, description, startDate, endDate, status);
        trip.setUser(user);
        var savedTrip = tripRepository.save(trip);
        return savedTrip;
    }

    public List<Trip> getUserTrips(User user) {
        return tripRepository.findByUser(user);
    }

    public Trip getTrip(Long tripId, User user) {
        var trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("Ce voyage n'existe pas."));
        if (!Objects.equals(trip.getUser().getId(), user.getId())) {
            throw new AccessDeniedException("Vous n'avez pas accès à ce voyage.");
        }
        return trip;
    }

    public Trip updateTrip(Long tripId, User user, String title, String description, LocalDate startDate,
            LocalDate endDate, TripStatus status) {
        var trip = getTrip(tripId, user);

        trip.setTitle(title);
        trip.setDescription(description);
        trip.setEndDate(endDate);
        trip.setStartDate(startDate);
        trip.setStatus(status);

        return tripRepository.save(trip);
    }

    @Transactional
    public void deleteTrip(Long tripId, User user) {
        var trip = getTrip(tripId, user);
        var steps = stepRepository.findByTripOrderByOrderIndexAsc(trip);
        for (var step : steps) {
            var photos = photoRepository.findByStep(step);
            for (var photo : photos) {
                fileStorage.delete(photo.getUrl());
                photoRepository.delete(photo);
            }
            stepRepository.delete(step);
        }
        tripRepository.delete(trip);
    }
}