package com.example.dinner_picker_backend.repository;

import com.example.dinner_picker_backend.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {

    @Query("SELECT g FROM Group g JOIN g.members m WHERE m.id = :userId")
    List<Group> findByMembersId(Long userId);

    @Query("SELECT g FROM Group g ORDER BY g.createdAt DESC")
    List<Group> findAllOrderByCreatedAtDesc();
}