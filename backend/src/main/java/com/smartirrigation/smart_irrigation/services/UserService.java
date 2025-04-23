package com.smartirrigation.smart_irrigation.services;

import com.smartirrigation.smart_irrigation.models.User;
import com.smartirrigation.smart_irrigation.repository.UserRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    @Transactional
    public void deleteOneUser(String username){
        userRepository.deleteByUsername(username);
    }


    public Map<String ,Object> SignUp(User user){
        Optional<User> optionalUser = userRepository.findByUsername(user.getUsername());
        Map<String, Object> result = new HashMap<>();
        if(optionalUser.isPresent()){
            result.put("message", "Username này đã tồn tại vui lòng đặt username khác");
        }else{
            User newUser = userRepository.save(user);
            result.put("message", "successful");
            result.put("data", newUser);
        }

        return result;
    }

    public Map<String,Object> SignIn(User user){
        Optional<User> optionalUser = userRepository.findByUsername(user.getUsername());
        Map<String, Object> result = new HashMap<>();
        if(optionalUser.isPresent()){
            User userExist = optionalUser.get();
            if (!userExist.getPassword().equals(user.getPassword())){
                result.put("message", "Mật khẩu không chính xác. Vui lòng nhập lại");
            }else{
                result.put("message", "successful");
                result.put("data", userExist);
            }
        }else{
            result.put("message", "Không tồn tại username này. Vui lòng kiểm tra lại");
        }

        return result;
    }

    public Map<String, Object> changePassword (User user){
        Optional<User> optionalUser = userRepository.findByUsername(user.getUsername());
        Map<String, Object> result = new HashMap<>();
        if(optionalUser.isPresent()){
            User userExist = optionalUser.get();
            if (!userExist.getPassword().equals(user.getPassword())){
                userExist.setPassword(user.getPassword());
                User updatedUser = userRepository.save(userExist);
                result.put("message", "successful");
                result.put("data", updatedUser);
            }else{
                result.put("message", "Mật khẩu mới không được giống mật khẩu hiện tại");
            }
        }else{
            result.put("message", "Không tồn tại username này. Vui lòng kiểm tra lại");
        }

        return result;
    }
}
