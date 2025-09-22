package com.example.dinner_picker_backend.repository;

import com.example.dinner_picker_backend.entity.VotingConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VotingConfigRepository extends JpaRepository<VotingConfig, Long> {
}
