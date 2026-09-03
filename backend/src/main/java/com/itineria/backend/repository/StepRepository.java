package com.itineria.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.itineria.backend.entity.Step;
import com.itineria.backend.entity.Trip;

@Repository
public interface StepRepository extends JpaRepository<Step, Long> {

    List<Step> findByTripOrderByOrderIndexAsc(Trip trip);
}