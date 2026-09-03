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

import com.itineria.backend.dto.CreateStepRequest;
import com.itineria.backend.entity.Step;
import com.itineria.backend.entity.User;
import com.itineria.backend.service.StepService;

@RestController
@RequestMapping("/api/trips/{tripId}/steps")
public class StepController {

    private final StepService stepService;

    public StepController(StepService stepService) {
        Objects.requireNonNull(stepService);
        this.stepService = stepService;
    }

    @PostMapping
    public Step createStep(@PathVariable Long tripId, @RequestBody CreateStepRequest request,
            Authentication authentication) {
        var user = (User) authentication.getPrincipal();
        return stepService.createStep(tripId, user, request.getLocationName(), request.getLatitude(),
                request.getLongitude(), request.getDate(), request.getNote(), request.getOrderIndex());
    }

    @GetMapping
    public List<Step> getStepsForTrip(@PathVariable Long tripId, Authentication authentication) {
        var user = (User) authentication.getPrincipal();
        return stepService.getStepsForTrip(tripId, user);
    }

    @PutMapping("/{stepId}")
    public Step updateStep(@PathVariable Long tripId, @PathVariable Long stepId,
            @RequestBody CreateStepRequest request, Authentication authentication) {
        var user = (User) authentication.getPrincipal();
        return stepService.updateStep(stepId, user, request.getLocationName(), request.getLatitude(),
                request.getLongitude(), request.getDate(), request.getNote(), request.getOrderIndex());
    }

    @DeleteMapping("/{stepId}")
    public void deleteStep(@PathVariable Long tripId, @PathVariable Long stepId, Authentication authentication) {
        var user = (User) authentication.getPrincipal();
        stepService.deleteStep(stepId, user);
    }
}