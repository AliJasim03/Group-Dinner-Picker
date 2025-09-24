package com.example.dinner_picker_backend.controller;

import com.example.dinner_picker_backend.service.DinnerPickerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.dinner_picker_backend.entity.Option;
import com.example.dinner_picker_backend.dto.AddOptionRequest;
import java.util.*;
import org.springframework.http.MediaType;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@WebMvcTest(DinnerPickerController.class)
public class DinnerPickerControllerTest {

    private DinnerPickerController dinnerPickerController;
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DinnerPickerService dinnerPickerService;

    @Autowired
    private ObjectMapper objectMapper;

    private Option testOption;
    private AddOptionRequest addOptionRequest;

    @BeforeEach
    void setUp() {
        testOption = new Option();
        testOption.setId(1L);
        testOption.setName("Pizza Palace");
        testOption.setLink("https://pizzapalace.com");
        testOption.setVotes(5);
        testOption.setCuisine("Italian");
        testOption.setPriceRange("$$");

        addOptionRequest = new AddOptionRequest();
        addOptionRequest.setName("Pizza Palace");
        addOptionRequest.setLink("https://pizzapalace.com");
        addOptionRequest.setCuisine("Italian");
        addOptionRequest.setPriceRange("$$");
        addOptionRequest.setVotingSessionId(1L);
    }

    @Test
    void getOptions_ShouldReturnAllOptions_WhenOptionsExist() throws Exception {
        List<Option> options = Arrays.asList(testOption);
        when(dinnerPickerService.getAllOptions()).thenReturn(options);

        // Act & Assert
        mockMvc.perform(get("/api/options"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].name").value("Pizza Palace"))
                .andExpect(jsonPath("$.data[0].votes").value(5))
                .andExpect(jsonPath("$.total").value(1));

        verify(dinnerPickerService).getAllOptions();
    }

}
