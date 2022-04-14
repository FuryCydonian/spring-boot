package com.fury_cydonian.spring_boot.controller;

import com.fury_cydonian.spring_boot.model.User;
import com.fury_cydonian.spring_boot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.nio.file.attribute.UserPrincipalNotFoundException;
import java.security.Principal;
import java.util.List;

@Controller
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
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
        return "redirect:/users";
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

    @GetMapping("/")
    public String mainPage(Model model, Principal principal) throws UserPrincipalNotFoundException {
        if (principal == null) {
            throw new UserPrincipalNotFoundException("!!!Not Found!!!");
        }
        User user = userService.findUserByEmail(principal.getName());
        model.addAttribute(user);
        return "index";
    }

//    @GetMapping("/users/{id}")
//    public String userInfo(@PathVariable("id") long id, Model model) {
//        User user = userService.getUserById(id);
//        model.addAttribute(user);
//        return "user";
//    }

//    @GetMapping("/user/{id}")
//    public String userInfo(@PathVariable long id, Model model) {
//
//        return "user";
//    }

}
