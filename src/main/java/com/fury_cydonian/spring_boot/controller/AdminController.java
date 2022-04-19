package com.fury_cydonian.spring_boot.controller;

import com.fury_cydonian.spring_boot.model.Role;
import com.fury_cydonian.spring_boot.model.User;
import com.fury_cydonian.spring_boot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.Set;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private UserService userService;

    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public AdminController(UserService userService, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userService = userService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;

    }

    @GetMapping
    public String successAdmin(Principal principal, Model model) {
        User user = userService.findUserByEmail(principal.getName());
        model.addAttribute("user", user);
        model.addAttribute("roles", user.getRoles());
        return "admin";
    }

    @GetMapping("/users")
    public String getUsers(Model model) {
        List<User> users = userService.getAllUsers();
        model.addAttribute("users", users);
        return "users";
    }

    @GetMapping("/users/create")
    public String createUserForm(@ModelAttribute("user") User user) {
        return "create";
    }

    @PostMapping("/users/create")
    public String createUser(@ModelAttribute("user") User user) {
        userService.saveUser(user);
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        Set<Role> roles = user.getRoles();
//        user.setRoles(Collections.singleton(new Role(2, "ROLE_USER")));

        return "redirect:/admin/users";
    }

    @GetMapping("/users/{id}/edit")
    public String updateUserForm(@PathVariable("id") long id, @ModelAttribute("user") User user) {
        return "edit";
    }

    @PostMapping("/users/{id}/edit")
    public String updateUser(@PathVariable("id") long id, @ModelAttribute("user") User user) {
        userService.saveUser(user);
        return "redirect:/users";
    }

    @GetMapping("/users/{id}/delete")
    public String deleteUser(@PathVariable("id") long id) {
        userService.deleteUser(id);
        return "redirect:/users";
    }

}
