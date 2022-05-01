package com.fury_cydonian.spring_boot.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class Test2Controller {

    @GetMapping("/test2")
    public String getTest2() {
        return "test2";
    }
}
