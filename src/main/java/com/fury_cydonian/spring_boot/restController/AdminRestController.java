package com.fury_cydonian.spring_boot.restController;

import com.fury_cydonian.spring_boot.model.Role;
import com.fury_cydonian.spring_boot.model.User;
import com.fury_cydonian.spring_boot.service.RoleService;
import com.fury_cydonian.spring_boot.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class AdminRestController {

    private final UserService userService;
    private final RoleService roleService;

    public AdminRestController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/users")
    public List<User> listOfAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/users/{id}")
    public User findUserById(@PathVariable("id") long id) {
        return userService.getUserById(id);
    }

    @PostMapping("/users/{id}/edit")
    public HttpStatus updateUser(@PathVariable("id") long id, @ModelAttribute("user") User user, @RequestParam("roles") Long[] roles) {
        Set<Role> roleSet = Arrays.stream(roles).map(roleService::getRoleById).collect(Collectors.toSet());
        user.setRoles(roleSet);
        userService.saveUser(user);
        return HttpStatus.OK;
    }
}