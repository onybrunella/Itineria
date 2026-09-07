package com.itineria.backend.dto;

import java.time.LocalDate;

public class StepResponse {

    private Long id;
    private String locationName;
    private Double latitude;
    private Double longitude;
    private LocalDate date;
    private String note;
    private Integer orderIndex;

    public StepResponse(Long id, String locationName, Double latitude, Double longitude, LocalDate date, String note, Integer orderIndex) {
        this.id = id;
        this.locationName = locationName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.date = date;
        this.note = note;
        this.orderIndex = orderIndex;
    }

    public Long getId() { return id; }
    public String getLocationName() { return locationName; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public LocalDate getDate() { return date; }
    public String getNote() { return note; }
    public Integer getOrderIndex() { return orderIndex; }
}