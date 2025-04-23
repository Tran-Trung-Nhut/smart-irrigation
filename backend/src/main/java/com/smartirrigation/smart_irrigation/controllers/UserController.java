package com.smartirrigation.smart_irrigation.controllers;

import com.smartirrigation.smart_irrigation.services.UserService;
import com.smartirrigation.smart_irrigation.models.User;


import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @CrossOrigin(origins = "*")
    @PostMapping("/signup")
    public Map<String, Object> SignUp(@RequestBody User user){
        return userService.SignUp(user);
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/signin")
    public Map<String, Object> SignIn(@RequestBody User user){
        return userService.SignIn(user);
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/all")
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/delete/{username}")
    public void deleteOneUser(@PathVariable String username){
        userService.deleteOneUser(username);
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/change-password")
    public Map<String, Object> changePassword(@RequestBody User user){
        return userService.changePassword(user);
    }

}
