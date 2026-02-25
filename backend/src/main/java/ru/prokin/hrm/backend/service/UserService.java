package ru.prokin.hrm.backend.service;

import ru.prokin.hrm.backend.dto.UserUpdateRequest;
import ru.prokin.hrm.backend.model.User;

public interface UserService {
    User findByUsername(String username);
    User updateUser(String username, UserUpdateRequest userUpdateRequest);
    boolean existsByUsername(String username);
}