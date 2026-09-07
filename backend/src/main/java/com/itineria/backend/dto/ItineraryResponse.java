package com.itineria.backend.dto;

import java.util.List;

public class ItineraryResponse {

    private List<StepResponse> steps;
    private double totalDistanceKm;

    public ItineraryResponse(List<StepResponse> steps, double totalDistanceKm) {
        this.steps = steps;
        this.totalDistanceKm = totalDistanceKm;
    }

    public List<StepResponse> getSteps() {
        return steps;
    }

    public double getTotalDistanceKm() {
        return totalDistanceKm;
    }
}