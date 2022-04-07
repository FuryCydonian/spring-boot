package com.fury_cydonian.spring_boot.service;

import com.fury_cydonian.spring_boot.model.User;

import java.util.List;

public interface UserService {
    User getUserById(Long id);

    List<User> getAllUsers();

    void saveUser(User user);

//    void updateUser(User user);

    void deleteUser(Long id);
}
