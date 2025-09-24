package com.example.dinner_picker_backend.service;

import com.example.dinner_picker_backend.entity.Option;
import com.example.dinner_picker_backend.entity.VotingConfig;
import com.example.dinner_picker_backend.entity.VotingSession;
import com.example.dinner_picker_backend.repository.OptionRepository;
import com.example.dinner_picker_backend.repository.VotingConfigRepository;
import com.example.dinner_picker_backend.repository.VotingSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DinnerPickerService {

    private static final Logger logger = LoggerFactory.getLogger(DinnerPickerService.class);

    @Autowired
    private OptionRepository optionRepository;

    @Autowired
    private VotingConfigRepository votingConfigRepository;

    @Autowired
    private VotingSessionRepository votingSessionRepository;

    public DinnerPickerService(OptionRepository optionRepository, VotingSessionRepository votingSessionRepository, VotingConfigRepository votingConfigRepository) {
        this.optionRepository = optionRepository;
        this.votingSessionRepository = votingSessionRepository;
        this.votingConfigRepository = votingConfigRepository;
    }
    // For backward compatibility - get all options
    public List<Option> getAllOptions() {
        try {
            return optionRepository.findAllOrderByVotesDesc();
        } catch (Exception e) {
            logger.error("Error fetching all options: ", e);
            throw new RuntimeException("Failed to fetch options", e);
        }
    }

    // New method - get options by session
    public List<Option> getSessionOptions(Long sessionId) {
        try {
            if (sessionId == null || sessionId <= 0) {
                throw new IllegalArgumentException("Invalid session ID: " + sessionId);
            }

            return optionRepository.findByVotingSessionIdOrderByVotesDesc(sessionId);
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error fetching options for session {}: ", sessionId, e);
            throw new RuntimeException("Failed to fetch session options", e);
        }
    }

    // For backward compatibility - add option without session
    public Option addOption(String name, String link) {
        try {
            // Validate inputs
            if (name == null || name.trim().isEmpty()) {
                throw new IllegalArgumentException("Option name cannot be empty");
            }

            if (link == null || link.trim().isEmpty()) {
                throw new IllegalArgumentException("Option link cannot be empty");
            }

            if (isVotingLocked()) {
                throw new RuntimeException("Voting is locked. Cannot add new options.");
            }

            Option option = new Option(name.trim(), link.trim());
            Option savedOption = optionRepository.save(option);

            logger.info("Successfully added option: {} with ID: {}", savedOption.getName(), savedOption.getId());
            return savedOption;

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error adding option: ", e);
            throw new RuntimeException("Failed to add option", e);
        }
    }

    // New method - add option to specific session
    public Option addOptionToSession(String name, String link, String imageUrl, String cuisine, String priceRange, Long sessionId) {
        try {
            // Validate inputs
            if (name == null || name.trim().isEmpty()) {
                throw new IllegalArgumentException("Restaurant name cannot be empty");
            }

            if (link == null || link.trim().isEmpty()) {
                throw new IllegalArgumentException("Restaurant link cannot be empty");
            }

            if (sessionId == null || sessionId <= 0) {
                throw new IllegalArgumentException("Invalid session ID: " + sessionId);
            }

            Optional<VotingSession> sessionOpt = votingSessionRepository.findById(sessionId);
            if (sessionOpt.isEmpty()) {
                throw new RuntimeException("Voting session not found with ID: " + sessionId);
            }

            VotingSession session = sessionOpt.get();

            // Check if session is locked (handle null values properly)
            if (Boolean.TRUE.equals(session.getLocked())) {
                throw new RuntimeException("This voting session is locked. Cannot add new options.");
            }

            Option option = new Option(
                    name.trim(),
                    link.trim(),
                    imageUrl != null ? imageUrl.trim() : null,
                    cuisine,
                    priceRange,
                    session
            );

            Option savedOption = optionRepository.save(option);

            logger.info("Successfully added option '{}' to session ID: {}", savedOption.getName(), sessionId);
            return savedOption;

        } catch (RuntimeException e) {
            logger.warn("Business logic error adding option to session: ", e);
            throw e;
        } catch (Exception e) {
            logger.error("Error adding option to session {}: ", sessionId, e);
            throw new RuntimeException("Failed to add option to session", e);
        }
    }

    public void vote(Long optionId, Integer delta) {
        try {
            // Validate inputs
            if (optionId == null || optionId <= 0) {
                throw new IllegalArgumentException("Invalid option ID: " + optionId);
            }

            if (delta == null) {
                throw new IllegalArgumentException("Vote delta cannot be null");
            }

            Optional<Option> optionOpt = optionRepository.findById(optionId);
            if (optionOpt.isEmpty()) {
                throw new RuntimeException("Option not found with ID: " + optionId);
            }

            Option option = optionOpt.get();

            // Check if voting is locked (either globally or for this session)
            if (isVotingLocked()) {
                throw new RuntimeException("Voting is locked globally.");
            }

            if (option.getVotingSession() != null && Boolean.TRUE.equals(option.getVotingSession().getLocked())) {
                throw new RuntimeException("This voting session is locked. Cannot vote on options.");
            }

            int currentVotes = option.getVotes() != null ? option.getVotes() : 0;
            int newVotes = currentVotes + delta;

            // Prevent negative votes
            if (newVotes < 0) {
                newVotes = 0;
            }

            option.setVotes(newVotes);
            optionRepository.save(option);

            logger.info("Successfully updated votes for option ID: {} from {} to {}", optionId, currentVotes, newVotes);

        } catch (RuntimeException e) {
            logger.warn("Business logic error processing vote: ", e);
            throw e;
        } catch (Exception e) {
            logger.error("Error processing vote for option {}: ", optionId, e);
            throw new RuntimeException("Failed to process vote", e);
        }
    }

    public void lockVoting(Boolean locked) {
        try {
            if (locked == null) {
                throw new IllegalArgumentException("Lock status cannot be null");
            }

            Optional<VotingConfig> configOpt = votingConfigRepository.findById(1L);
            VotingConfig config;

            if (configOpt.isPresent()) {
                config = configOpt.get();
                config.setLocked(locked);
            } else {
                config = new VotingConfig(locked);
            }

            votingConfigRepository.save(config);
            logger.info("Global voting lock set to: {}", locked);

        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error setting voting lock: ", e);
            throw new RuntimeException("Failed to update voting lock", e);
        }
    }

    public boolean isVotingLocked() {
        try {
            Optional<VotingConfig> configOpt = votingConfigRepository.findById(1L);
            boolean locked = configOpt.map(VotingConfig::getLocked).orElse(false);

            logger.debug("Global voting lock status: {}", locked);
            return locked;

        } catch (Exception e) {
            logger.error("Error checking voting lock status: ", e);
            // If we can't check, assume unlocked to prevent blocking functionality
            return false;
        }
    }

    public Option getWinner() {
        try {
            List<Option> options = getAllOptions();
            if (options.isEmpty()) {
                logger.info("No options found for winner determination");
                return null;
            }

            Option winner = options.get(0);
            logger.info("Winner determined: {} with {} votes", winner.getName(), winner.getVotes());

            return winner;

        } catch (Exception e) {
            logger.error("Error determining winner: ", e);
            throw new RuntimeException("Failed to determine winner", e);
        }
    }

    public Option getSessionWinner(Long sessionId) {
        try {
            if (sessionId == null || sessionId <= 0) {
                throw new IllegalArgumentException("Invalid session ID: " + sessionId);
            }

            List<Option> options = getSessionOptions(sessionId);
            if (options.isEmpty()) {
                logger.info("No options found for session {} winner determination", sessionId);
                return null;
            }

            Option winner = options.get(0);
            logger.info("Session {} winner determined: {} with {} votes", sessionId, winner.getName(), winner.getVotes());

            return winner;

        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error determining winner for session {}: ", sessionId, e);
            throw new RuntimeException("Failed to determine session winner", e);
        }
    }
}