package com.example.dinner_picker_backend.repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
public class GroupRepositoryTest {
    @Autowired
    private GroupRepository groupRepository;
}
