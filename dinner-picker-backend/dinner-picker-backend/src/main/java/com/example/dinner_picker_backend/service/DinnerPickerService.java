package com.example.dinner_picker_backend.service;

import com.example.dinner_picker_backend.entity.Option;
import com.example.dinner_picker_backend.entity.VotingConfig;
import com.example.dinner_picker_backend.repository.OptionRepository;
import com.example.dinner_picker_backend.repository.VotingConfigRepository;
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

    public List<Option> getAllOptions() {
        return optionRepository.findAllOrderByVotesDesc();
    }

    public Option addOption(String name, String link) {
        if (isVotingLocked()) {
            throw new RuntimeException("Voting is locked. Cannot add new options.");
        }

        Option option = new Option(name, link);
        return optionRepository.save(option);
    }

    public void vote(Long optionId, Integer delta) {
        if (isVotingLocked()) {
            throw new RuntimeException("Voting is locked.");
        }

        Optional<Option> optionOpt = optionRepository.findById(optionId);
        if (optionOpt.isEmpty()) {
            throw new RuntimeException("Option not found");
        }

        Option option = optionOpt.get();
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
}
