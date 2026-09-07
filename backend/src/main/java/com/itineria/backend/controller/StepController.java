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
import com.itineria.backend.dto.StepResponse;
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
    public StepResponse createStep(@PathVariable Long tripId, @RequestBody CreateStepRequest request,
            Authentication authentication) {
        var user = (User) authentication.getPrincipal();
        var step = stepService.createStep(tripId, user, request.getLocationName(), request.getLatitude(),
                request.getLongitude(), request.getDate(), request.getNote(), request.getOrderIndex());
        return toResponse(step);
    }

    @GetMapping
    public List<StepResponse> getStepsForTrip(@PathVariable Long tripId, Authentication authentication) {
        var user = (User) authentication.getPrincipal();
        var steps = stepService.getStepsForTrip(tripId, user);
        return steps.stream().map(this::toResponse).toList();
    }

    @PutMapping("/{stepId}")
    public StepResponse updateStep(@PathVariable Long tripId, @PathVariable Long stepId,
            @RequestBody CreateStepRequest request, Authentication authentication) {
        var user = (User) authentication.getPrincipal();
        var step = stepService.updateStep(stepId, user, request.getLocationName(), request.getLatitude(),
                request.getLongitude(), request.getDate(), request.getNote(), request.getOrderIndex());
        return toResponse(step);
    }

    @DeleteMapping("/{stepId}")
    public void deleteStep(@PathVariable Long tripId, @PathVariable Long stepId, Authentication authentication) {
        var user = (User) authentication.getPrincipal();
        stepService.deleteStep(stepId, user);
    }

    private StepResponse toResponse(Step step) {
        return new StepResponse(
                step.getId(),
                step.getLocationName(),
                step.getLatitude(),
                step.getLongitude(),
                step.getDate(),
                step.getNote(),
                step.getOrderIndex()
        );
    }
}