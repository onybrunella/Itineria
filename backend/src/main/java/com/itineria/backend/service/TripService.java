package com.itineria.backend.service;

import com.itineria.backend.entity.*;
import com.itineria.backend.repository.TripRepository;

import org.springframework.security.access.AccessDeniedException;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;

@Service
public class TripService {
    private final TripRepository tripRepository;

    public TripService(TripRepository tripRepository) {
        Objects.requireNonNull(tripRepository);
        this.tripRepository = tripRepository;
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
        if (!trip.getUser().equals(user)) {
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

    public void deleteTrip(Long tripId, User user) {
        var trip = getTrip(tripId, user);
        tripRepository.delete(trip);
    }
}