package me.xjanua.service;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import me.xjanua.model.User;
import me.xjanua.model.UserRole;
import me.xjanua.repository.UserRoleRepository;

@Service
@RequiredArgsConstructor
public class UserRoleService {

    private final UserRoleRepository userRoleRepository;

    public List<UserRole> findByUser(User user) {
        return userRoleRepository.findByUser(user);
    }
}
