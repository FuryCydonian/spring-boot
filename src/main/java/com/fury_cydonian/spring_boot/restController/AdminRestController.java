package com.fury_cydonian.spring_boot.restController;

import com.fury_cydonian.spring_boot.model.Role;
import com.fury_cydonian.spring_boot.model.User;
import com.fury_cydonian.spring_boot.service.RoleService;
import com.fury_cydonian.spring_boot.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

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

    @GetMapping("/user")
    public User currentUser(@AuthenticationPrincipal User authUser) {
        return authUser;
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<String> updateUser(@PathVariable("id") long id, @RequestBody User user) {
        try {
            userService.saveUser(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Something went wrong");
        }
        return ResponseEntity.ok("User is updated");
    }

    @PostMapping("/users")
    public ResponseEntity<String> saveUser(@RequestBody User user) {
        try {
            userService.saveUser(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Something went wrong");
        }
        return ResponseEntity.ok("User is added");
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") long id) {
        try {
            userService.deleteUser(id);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Something went wrong");
        }
        return ResponseEntity.ok("User is deleted");
    }

    @GetMapping("/roles")
    public Set<Role> getAllRoles() {
        return roleService.getRoles();
    }
}
