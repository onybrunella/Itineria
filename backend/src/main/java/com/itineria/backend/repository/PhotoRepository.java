package com.itineria.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.itineria.backend.entity.Photo;
import com.itineria.backend.entity.Step;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {

    List<Photo> findByStep(Step step);
    
}
