package com.example.dinner_picker_backend.repository;

import com.example.dinner_picker_backend.entity.Option;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OptionRepository extends JpaRepository<Option, Long> {

    @Query("SELECT o FROM Option o ORDER BY o.votes DESC")
    List<Option> findAllOrderByVotesDesc();
}
