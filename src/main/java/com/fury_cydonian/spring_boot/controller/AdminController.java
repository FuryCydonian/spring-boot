package com.fury_cydonian.spring_boot.controller;

import com.fury_cydonian.spring_boot.model.Role;
import com.fury_cydonian.spring_boot.model.User;
import com.fury_cydonian.spring_boot.service.RoleService;
import com.fury_cydonian.spring_boot.service.RoleServiceImpl;
import com.fury_cydonian.spring_boot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.management.relation.RoleNotFoundException;
import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Controller
//@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;

    private final RoleService roleService;

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public AdminController(UserService userService, RoleService roleService, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userService = userService;
        this.roleService = roleService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }


    @GetMapping("/admin")
    public String successAdmin(@AuthenticationPrincipal User user, Model model) {
        model.addAttribute("user", user);
        model.addAttribute("rolesAuthUser", user.getRoles());
        return "admin";
    }

    @GetMapping("admin/users")
    public String getUsers(Model model) {
        List<User> users = userService.getAllUsers();
        model.addAttribute("users", users);
        return "users";
    }

    @GetMapping("admin/users/create")
    public String createUserForm(Model model) {
        User user = new User();
        model.addAttribute("roles", roleService.getRoles());
        model.addAttribute("user", user);
        return "create";
    }

    @PostMapping("admin/users/create")
    public String createUser(@ModelAttribute("user") User user, @RequestParam("roles") Long[] roles) {
        Set<Role> roleSet = Arrays.stream(roles).map(roleService::getRoleById).collect(Collectors.toSet());
        user.setRoles(roleSet);
        userService.saveUser(user);
        return "users";
    }

    @GetMapping("admin/users/{id}/edit")
    public String updateUserForm(@PathVariable("id") long id, @ModelAttribute("user") User user) {
        return "edit";
    }

    @PostMapping("admin/users/{id}/edit")
    public String updateUser(@PathVariable("id") long id, @ModelAttribute("user") User user) {
        userService.saveUser(user);
        return "redirect:/admin/users";
    }

    @GetMapping("admin/users/{id}/delete")
    public String deleteUser(@PathVariable("id") long id) {
        userService.deleteUser(id);
        return "redirect:/admin/users";
    }

}
