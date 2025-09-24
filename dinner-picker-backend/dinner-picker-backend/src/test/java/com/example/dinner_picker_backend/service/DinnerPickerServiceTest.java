package com.example.dinner_picker_backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

import com.example.dinner_picker_backend.entity.Group;
import com.example.dinner_picker_backend.entity.Option;
import com.example.dinner_picker_backend.entity.VotingSession;
import com.example.dinner_picker_backend.repository.OptionRepository;
import com.example.dinner_picker_backend.repository.VotingConfigRepository;
import com.example.dinner_picker_backend.repository.VotingSessionRepository;

public class DinnerPickerServiceTest {
  private OptionRepository optionRepository;
  private VotingSessionRepository votingSessionRepository;
  private VotingConfigRepository votingConfigRepository;
  private DinnerPickerService dinnerPickerService;

  @BeforeEach
  void setUp() {
    optionRepository = mock(OptionRepository.class);
    votingSessionRepository = mock(VotingSessionRepository.class);
    votingConfigRepository = mock(VotingConfigRepository.class);
    dinnerPickerService = new DinnerPickerService(optionRepository, votingSessionRepository, votingConfigRepository);
  }

  @Test
  void addOption_ShouldThrowException_WhenSessionIsLocked() {
    // Arrange
    Long sessionId = 1L;
    String optionName = "Pizza Palace";
    String optionLink = "https://pizzapalace.com";
    String imageUrl = "https://example.com/image.jpg";
    String cuisine = "Italian";
    String priceRange = "$$";
    
    Group group = new Group();
    group.setId(1L);
    group.setName("Test Group");

    VotingSession votingSession = new VotingSession();
    votingSession.setId(sessionId);
    votingSession.setLocked(true); // Session is locked
    votingSession.setGroup(group);

    // Mock the repository to return the locked session
    when(votingSessionRepository.findById(sessionId)).thenReturn(Optional.of(votingSession));

    // Act & Assert
    RuntimeException exception = assertThrows(RuntimeException.class, () -> {
      dinnerPickerService.addOptionToSession(optionName, optionLink, imageUrl, cuisine, priceRange, sessionId);
    });

    assertThat(exception.getMessage()).contains("This voting session is locked");
    
    // Verify that save was never called since the operation should fail
    verify(optionRepository, never()).save(any(Option.class));
  }

  // @Test
  // void addOptionToSession_ShouldSucceed_WhenSessionIsUnlocked() {
  //   // Arrange
  //   Long sessionId = 1L;
  //   String optionName = "Pizza Palace";
  //   String optionLink = "https://pizzapalace.com";
  //   String imageUrl = "https://example.com/image.jpg";
  //   String cuisine = "Italian";
  //   String priceRange = "$$";
    
  //   Group group = new Group();
  //   group.setId(1L);
  //   group.setName("Test Group");

  //   VotingSession votingSession = new VotingSession();
  //   votingSession.setId(sessionId);
  //   votingSession.setLocked(false); // Session is unlocked
  //   votingSession.setGroup(group);

  //   Option expectedOption = new Option(optionName, optionLink, imageUrl, cuisine, priceRange, votingSession);
  //   expectedOption.setId(1L);

  //   // Mock the repositories
  //   when(votingSessionRepository.findById(sessionId)).thenReturn(Optional.of(votingSession));
  //   when(optionRepository.save(any(Option.class))).thenReturn(expectedOption);

  //   // Act
  //   Option result = dinnerPickerService.addOptionToSession(optionName, optionLink, imageUrl, cuisine, priceRange, sessionId);

  //   // Assert
  //   assertThat(result).isNotNull();
  //   assertThat(result.getName()).isEqualTo(optionName);
  //   assertThat(result.getLink()).isEqualTo(optionLink);
  //   assertThat(result.getImageUrl()).isEqualTo(imageUrl);
  //   assertThat(result.getCuisine()).isEqualTo(cuisine);
  //   assertThat(result.getPriceRange()).isEqualTo(priceRange);
    
  //   verify(optionRepository).save(any(Option.class));
  // }

  @Test
  void addOptionToSession_ShouldThrowException_WhenSessionNotFound() {
    // Arrange
    Long sessionId = 1L;
    String optionName = "Pizza Palace";
    String optionLink = "https://pizzapalace.com";

    // Mock the repository to return empty
    when(votingSessionRepository.findById(sessionId)).thenReturn(Optional.empty());

    // Act & Assert
    RuntimeException exception = assertThrows(RuntimeException.class, () -> {
      dinnerPickerService.addOptionToSession(optionName, optionLink, null, null, null, sessionId);
    });

    assertThat(exception.getMessage()).contains("Voting session not found with ID: " + sessionId);
  }

  @Test
  void addOptionToSession_ShouldThrowException_WhenNameIsEmpty() {
    // Arrange
    Long sessionId = 1L;
    String emptyName = "";
    String optionLink = "https://pizzapalace.com";

    // Act & Assert
    IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
      dinnerPickerService.addOptionToSession(emptyName, optionLink, null, null, null, sessionId);
    });

    assertThat(exception.getMessage()).contains("Restaurant name cannot be empty");
  }

  // @Test
  // void getSessionOptions_ShouldReturnOptions_WhenSessionExists() {
  //   // Arrange
  //   Long sessionId = 1L;
  //   Option option1 = new Option();
  //   option1.setId(1L);
  //   option1.setName("Pizza Palace");
  //   option1.setVotes(5);

  //   Option option2 = new Option();
  //   option2.setId(2L);
  //   option2.setName("Burger King");
  //   option2.setVotes(3);

  //   when(optionRepository.findByVotingSessionIdOrderByVotesDesc(sessionId))
  //       .thenReturn(List.of(option1, option2));

  //   // Act
  //   List<Option> result = dinnerPickerService.getSessionOptions(sessionId);

  //   // Assert
  //   assertThat(result).hasSize(2);
  //   assertThat(result.get(0).getName()).isEqualTo("Pizza Palace");
  //   assertThat(result.get(0).getVotes()).isEqualTo(5);
  //   assertThat(result.get(1).getName()).isEqualTo("Burger King");
  //   assertThat(result.get(1).getVotes()).isEqualTo(3);
  // } 

    
}
 