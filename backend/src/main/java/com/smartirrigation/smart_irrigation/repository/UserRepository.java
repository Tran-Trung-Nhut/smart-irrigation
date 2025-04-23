package com.smartirrigation.smart_irrigation.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.smartirrigation.smart_irrigation.models.User;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);
    void deleteByUsername(String username);
}