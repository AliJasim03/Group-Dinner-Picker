package com.example.dinner_picker_backend.service;

import com.example.dinner_picker_backend.entity.Option;
import com.example.dinner_picker_backend.entity.VotingConfig;
import com.example.dinner_picker_backend.entity.VotingSession;
import com.example.dinner_picker_backend.repository.OptionRepository;
import com.example.dinner_picker_backend.repository.VotingConfigRepository;
import com.example.dinner_picker_backend.repository.VotingSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DinnerPickerService {

    @Autowired
    private OptionRepository optionRepository;

    @Autowired
    private VotingConfigRepository votingConfigRepository;

    @Autowired
    private VotingSessionRepository votingSessionRepository;

    // For backward compatibility - get all options
    public List<Option> getAllOptions() {
        return optionRepository.findAllOrderByVotesDesc();
    }

    // New method - get options by session
    public List<Option> getSessionOptions(Long sessionId) {
        return optionRepository.findByVotingSessionIdOrderByVotesDesc(sessionId);
    }

    // For backward compatibility - add option without session
    public Option addOption(String name, String link) {
        if (isVotingLocked()) {
            throw new RuntimeException("Voting is locked. Cannot add new options.");
        }

        Option option = new Option(name, link);
        return optionRepository.save(option);
    }

    // New method - add option to specific session
    public Option addOptionToSession(String name, String link, String imageUrl, String cuisine, String priceRange, Long sessionId) {
        Optional<VotingSession> sessionOpt = votingSessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            throw new RuntimeException("Voting session not found");
        }

        VotingSession session = sessionOpt.get();
        if (session.getLocked()) {
            throw new RuntimeException("This voting session is locked. Cannot add new options.");
        }

        Option option = new Option(name, link, imageUrl, cuisine, priceRange, session);
        return optionRepository.save(option);
    }

    public void vote(Long optionId, Integer delta) {
        Optional<Option> optionOpt = optionRepository.findById(optionId);
        if (optionOpt.isEmpty()) {
            throw new RuntimeException("Option not found");
        }

        Option option = optionOpt.get();

        // Check if voting is locked (either globally or for this session)
        if (isVotingLocked()) {
            throw new RuntimeException("Voting is locked globally.");
        }

        if (option.getVotingSession() != null && option.getVotingSession().getLocked()) {
            throw new RuntimeException("This voting session is locked.");
        }

        int newVotes = option.getVotes() + delta;

        // Prevent negative votes
        if (newVotes < 0) {
            newVotes = 0;
        }

        option.setVotes(newVotes);
        optionRepository.save(option);
    }

    public void lockVoting(Boolean locked) {
        Optional<VotingConfig> configOpt = votingConfigRepository.findById(1L);
        VotingConfig config;

        if (configOpt.isPresent()) {
            config = configOpt.get();
            config.setLocked(locked);
        } else {
            config = new VotingConfig(locked);
        }

        votingConfigRepository.save(config);
    }

    public boolean isVotingLocked() {
        Optional<VotingConfig> configOpt = votingConfigRepository.findById(1L);
        return configOpt.map(VotingConfig::getLocked).orElse(false);
    }

    public Option getWinner() {
        List<Option> options = getAllOptions();
        return options.isEmpty() ? null : options.get(0);
    }

    public Option getSessionWinner(Long sessionId) {
        List<Option> options = getSessionOptions(sessionId);
        return options.isEmpty() ? null : options.get(0);
    }
}