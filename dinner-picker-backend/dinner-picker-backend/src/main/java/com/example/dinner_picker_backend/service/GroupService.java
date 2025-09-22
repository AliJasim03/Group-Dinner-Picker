package com.example.dinner_picker_backend.service;

import com.example.dinner_picker_backend.entity.Group;
import com.example.dinner_picker_backend.entity.User;
import com.example.dinner_picker_backend.repository.GroupRepository;
import com.example.dinner_picker_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Group> getAllGroups() {
        return groupRepository.findAllOrderByCreatedAtDesc();
    }

    public Optional<Group> getGroupById(Long id) {
        return groupRepository.findById(id);
    }

    public Group createGroup(String name, String description, String emojiIcon, String colorTheme, Long userId) {
        Group group = new Group(name, description, emojiIcon, colorTheme);

        // Add current user to the group
        if (userId != null) {
            Optional<User> user = userRepository.findById(userId);
            if (user.isPresent()) {
                group.getMembers().add(user.get());
            }
        }

        return groupRepository.save(group);
    }

    public List<Group> getUserGroups(Long userId) {
        return groupRepository.findByMembersId(userId);
    }

    public Group joinGroup(Long groupId, Long userId) {
        Optional<Group> groupOpt = groupRepository.findById(groupId);
        Optional<User> userOpt = userRepository.findById(userId);

        if (groupOpt.isPresent() && userOpt.isPresent()) {
            Group group = groupOpt.get();
            User user = userOpt.get();

            group.getMembers().add(user);
            return groupRepository.save(group);
        }

        throw new RuntimeException("Group or User not found");
    }
}