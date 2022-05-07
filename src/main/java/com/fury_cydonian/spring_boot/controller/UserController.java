package com.fury_cydonian.spring_boot.controller;

import com.fury_cydonian.spring_boot.model.User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UserController {

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/user")
    public String userInfo(@AuthenticationPrincipal User authUser, Model model) {

        model.addAttribute("auth_user", authUser);
        return "user";
    }

}
