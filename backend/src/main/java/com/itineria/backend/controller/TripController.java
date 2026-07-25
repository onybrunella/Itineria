package com.itineria.backend.controller;

import java.util.List;
import java.util.Objects;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.itineria.backend.dto.CreateTripRequest;
import com.itineria.backend.dto.TripResponse;
import com.itineria.backend.dto.UserInfo;
import com.itineria.backend.entity.*;
import com.itineria.backend.service.*;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        Objects.requireNonNull(tripService);
        this.tripService = tripService;
    }

    @PostMapping
    public TripResponse createTrip(@RequestBody CreateTripRequest request, Authentication authentication) {
        var user = (User) authentication.getPrincipal();
        var trip = tripService.createTrip(request.getTitle(), request.getDescription(), request.getStartDate(),
                request.getEndDate(), request.getStatus(), user);
        return toResponse(trip);
    }

    @GetMapping
    public List<TripResponse> getUserTrips(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        var trips = tripService.getUserTrips(user);
        return trips.stream().map(this::toResponse).toList();
    }

    @GetMapping("/{id}")
    public TripResponse getTrip(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        var trip = tripService.getTrip(id, user);
        return toResponse(trip);
    }

    @PutMapping("/{id}")
    public TripResponse updateTrip(@PathVariable Long id, @RequestBody CreateTripRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        var trip = tripService.updateTrip(id, user, request.getTitle(), request.getDescription(),
                request.getStartDate(), request.getEndDate(), request.getStatus());
        return toResponse(trip);
    }

    @DeleteMapping("/{id}")
    public void deleteTrip(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        tripService.deleteTrip(id, user);
    }

    private TripResponse toResponse(Trip trip) {
        var userInfo = new UserInfo(trip.getUser().getId(), trip.getUser().getPseudo());
        return new TripResponse(
                trip.getId(),
                trip.getTitle(),
                trip.getDescription(),
                trip.getStartDate(),
                trip.getEndDate(),
                trip.getStatus(),
                userInfo
        );
    }
}