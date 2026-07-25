package com.itineria.backend.dto;

import java.time.LocalDate;
import java.util.Objects;

import com.itineria.backend.entity.TripStatus;

public class TripResponse {

    private Long id;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private TripStatus status;
    private UserInfo user;

    public TripResponse(Long id, String title, String description, LocalDate startDate, LocalDate endDate, TripStatus status, UserInfo user) {
        this.id = id;
        this.title = title;
        this.description = description;
        Objects.requireNonNull(status);
        this.status = status;
        Objects.requireNonNull(startDate);
        this.startDate = startDate;
        this.endDate = endDate;
        Objects.requireNonNull(user);
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public TripStatus getStatus() {
        return status;
    }

    public UserInfo getUser() {
        return user;
    }
}