package com.example.dinner_picker_backend.config;

import com.example.dinner_picker_backend.entity.*;
import com.example.dinner_picker_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private VotingSessionRepository votingSessionRepository;

    @Autowired
    private OptionRepository optionRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Create default user
            User user = new User("Alex Johnson", "alex@example.com", "🧑‍💻");
            user = userRepository.save(user);

            // Create sample groups
            Group workGroup = new Group("Work Team", "Weekly lunch decisions for the office", "💼", "#667eea");
            workGroup.getMembers().add(user);
            workGroup = groupRepository.save(workGroup);

            Group friendsGroup = new Group("Weekend Squad", "Friends weekend dining adventures", "🎉", "#f093fb");
            friendsGroup.getMembers().add(user);
            friendsGroup = groupRepository.save(friendsGroup);

            Group familyGroup = new Group("Family Dinners", "Sunday family meal planning", "👨‍👩‍👧‍👦", "#4facfe");
            familyGroup.getMembers().add(user);
            familyGroup = groupRepository.save(familyGroup);

            // Create sample voting sessions
            VotingSession workSession = new VotingSession("Friday Team Lunch", "Let's decide where to eat this Friday!", workGroup);
            workSession.setDeadline(LocalDateTime.now().plusDays(2));
            workSession = votingSessionRepository.save(workSession);

            VotingSession friendsSession = new VotingSession("Saturday Night Dinner", "Epic dinner spot for Saturday night", friendsGroup);
            friendsSession = votingSessionRepository.save(friendsSession);

            // Add sample restaurants
            Option option1 = new Option("Pasta Paradise", "https://pastaparadise.com", workSession);
            option1.setCuisine("Italian");
            option1.setPriceRange("$$");
            option1.setVotes(3);
            optionRepository.save(option1);

            Option option2 = new Option("Taco Fiesta", "https://tacofiesta.com", workSession);
            option2.setCuisine("Mexican");
            option2.setPriceRange("$");
            option2.setVotes(5);
            optionRepository.save(option2);

            Option option3 = new Option("Sushi Zen", "https://sushizen.com", friendsSession);
            option3.setCuisine("Japanese");
            option3.setPriceRange("$$$");
            option3.setVotes(2);
            optionRepository.save(option3);
        }
    }
}