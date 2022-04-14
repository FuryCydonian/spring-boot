package com.fury_cydonian.spring_boot.service;

import com.fury_cydonian.spring_boot.model.User;

import java.util.List;

public interface UserService {
    User getUserById(Long id);

    List<User> getAllUsers();

    void saveUser(User user);

    User findUserByEmail(String email);

    void deleteUser(Long id);
}
