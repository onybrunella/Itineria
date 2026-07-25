package com.itineria.backend.dto;

import java.time.LocalDate;

import com.itineria.backend.entity.TripStatus;

public class CreateTripRequest {

    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private TripStatus status;

    public CreateTripRequest(){}

    public String getTitle(){
        return title;
    }

     public void setTitle(String title) {
        this.title=title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

     public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public TripStatus getStatus() {
        return status;
    }

    public void setStatus(TripStatus status) {
        this.status = status;
    }
    
}