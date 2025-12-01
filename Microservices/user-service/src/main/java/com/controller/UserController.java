package com.controller;

import com.dto.LoginRequest;
import com.dto.RegisterRequest;
import com.dto.UserResponse;
import com.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    @PostMapping("/register")
    public UserResponse register(@RequestBody RegisterRequest req) {
        return service.register(req);
    }

    @PostMapping("/login")
    public UserResponse login(@RequestBody LoginRequest req) {
        return service.login(req);
    }

    @GetMapping("/test")
    public String test() {
        return "User Service is running!";
    }
}
