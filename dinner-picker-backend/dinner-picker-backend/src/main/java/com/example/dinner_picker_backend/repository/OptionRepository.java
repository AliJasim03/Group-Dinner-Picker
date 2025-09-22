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

    List<Option> findByVotingSessionIdOrderByVotesDesc(Long votingSessionId);

    @Query("SELECT o FROM Option o WHERE o.votingSession.id = :sessionId ORDER BY o.votes DESC")
    List<Option> findByVotingSessionIdSortedByVotes(Long sessionId);

    @Query("SELECT o FROM Option o WHERE o.votingSession.id = :sessionId AND o.votes > 0 ORDER BY o.votes DESC")
    List<Option> findWinnersBySessionId(Long sessionId);
}