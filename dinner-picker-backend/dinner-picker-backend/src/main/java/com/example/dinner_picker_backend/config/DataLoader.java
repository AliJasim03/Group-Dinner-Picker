package com.example.dinner_picker_backend.config;

import com.example.dinner_picker_backend.entity.Option;
import com.example.dinner_picker_backend.repository.OptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private OptionRepository optionRepository;

    @Override
    public void run(String... args) throws Exception {
        if (optionRepository.count() == 0) {
            // Add some sample restaurants
            optionRepository.save(new Option("Pizza Palace", "https://pizzapalace.com"));
            optionRepository.save(new Option("Burger Barn", "https://burgerbarn.com"));
            optionRepository.save(new Option("Sushi Supreme", "https://sushisupreme.com"));
            optionRepository.save(new Option("Taco Town", "https://tacotown.com"));
        }
    }
}
