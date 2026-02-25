package ru.prokin.hrm.backend.service.impl;

import ru.prokin.hrm.backend.dto.UserUpdateRequest;
import ru.prokin.hrm.backend.model.Company;
import ru.prokin.hrm.backend.model.Position;
import ru.prokin.hrm.backend.model.User;
import ru.prokin.hrm.backend.repository.CompanyRepository;
import ru.prokin.hrm.backend.repository.PositionRepository;
import ru.prokin.hrm.backend.repository.UserRepository;
import ru.prokin.hrm.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private PositionRepository positionRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    @Override
    public User updateUser(String username, UserUpdateRequest userUpdateRequest) {
        User user = findByUsername(username);

        user.setFirstName(userUpdateRequest.getFirstName());
        user.setLastName(userUpdateRequest.getLastName());

        if (userUpdateRequest.getCompanyId() != null) {
            Company company = companyRepository.findById(userUpdateRequest.getCompanyId())
                    .orElseThrow(() -> new RuntimeException("Company not found"));
            user.setCompany(company);
        }

        if (userUpdateRequest.getPositionId() != null) {
            Position position = positionRepository.findById(userUpdateRequest.getPositionId())
                    .orElseThrow(() -> new RuntimeException("Position not found"));

            user.setPosition(position);
            // Просто берем компанию напрямую из объекта позиции!
            user.setCompany(position.getCompany());
        }

        // Only update password if it's provided
        if (userUpdateRequest.getPassword() != null && !userUpdateRequest.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userUpdateRequest.getPassword()));
        }

        return userRepository.save(user);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}