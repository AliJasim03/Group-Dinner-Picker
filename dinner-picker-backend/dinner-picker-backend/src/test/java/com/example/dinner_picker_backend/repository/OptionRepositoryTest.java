package com.example.dinner_picker_backend.repository;

import com.example.dinner_picker_backend.entity.VotingSession;
import com.example.dinner_picker_backend.entity.Group;
import com.example.dinner_picker_backend.entity.Option;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@SpringBootTest
@Transactional
public class OptionRepositoryTest {
    @Autowired
    private OptionRepository optionRepository;

    @Test
    @DisplayName("Test findAllOrderByVotesDesc")
    public void testFindAllOrderByVotesDesc() {
        // Given
        Option option1 = new Option();
        option1.setName("Option 1");
        option1.setVotes(5);
        option1.setLink("https://option1.com");
        optionRepository.save(option1);

        Option option2 = new Option();
        option2.setName("Option 2");
        option2.setVotes(10);
        option2.setLink("https://option2.com");
        optionRepository.save(option2);

        Option option3 = new Option();
        option3.setName("Option 3");
        option3.setVotes(3);
        option3.setLink("https://option3.com");
        optionRepository.save(option3);

        // When
        List<Option> options = optionRepository.findAllOrderByVotesDesc();

        // Then
        assert options.size() == 3;
        assert options.get(0).getVotes() == 10;
        assert options.get(1).getVotes() == 5;
        assert options.get(2).getVotes() == 3;
    }

    @Test
    @DisplayName("Test findByVotingSessionIdOrderByVotesDesc")
    public void testFindByVotingSessionIdOrderByVotesDesc() {
        // create group
        Group group = new Group();
        group.setName("Test Group");
        group.setCreatedAt(LocalDateTime.now());
        VotingSession session = new VotingSession();
        session.setTitle("Test Session");
        session.setGroup(group);
        session.setLocked(false);


        Option option1 = new Option();
        option1.setName("Option 1");
        option1.setVotes(5);
        option1.setLink("https://option1.com");
        option1.setVotingSession(session);
        optionRepository.save(option1);

        Option option2 = new Option();
        option2.setName("Option 2");
        option2.setVotes(10);
        option2.setLink("https://option2.com");
        option2.setVotingSession(session);
        optionRepository.save(option2);

        Option option3 = new Option();
        option3.setName("Option 3");
        option3.setLink("https://option3.com");
        option3.setVotes(3);
        option3.setVotingSession(session);
        optionRepository.save(option3);

        // When
        List<Option> options = optionRepository.findByVotingSessionIdOrderByVotesDesc(session.getId());

        // Then
        assert options.size() == 3;
        assert options.get(0).getVotes() == 10;
        assert options.get(1).getVotes() == 5;
        assert options.get(2).getVotes() == 3;
    }

    @Test
    @DisplayName("Test findWinnersBySessionId")
    public void testFindWinnersBySessionId() {
        // create group
        Group group = new Group();
        group.setName("Test Group");
        group.setCreatedAt(LocalDateTime.now());
        VotingSession session = new VotingSession();
        session.setTitle("Test Session");
        session.setGroup(group);
        session.setLocked(false);

        Option option1 = new Option();
        option1.setName("Option 1");
        option1.setVotes(5);
        option1.setVotingSession(session);
        option1.setLink("https://option1.com");
        optionRepository.save(option1);
        
        Option option2 = new Option();
        option2.setName("Option 2");
        option2.setLink("https://option2.com");
        option2.setVotes(0);
        option2.setVotingSession(session);
        optionRepository.save(option2);
        
        List<Option> options = optionRepository.findWinnersBySessionId(session.getId());
        assert options.size() == 1;
        assert options.get(0).getVotes() == 5;  
    }
}
