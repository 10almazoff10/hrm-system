package ru.prokin.hrm.backend.controller;

import ru.prokin.hrm.backend.dto.AuthRequest;
import ru.prokin.hrm.backend.dto.AuthResponse;
import ru.prokin.hrm.backend.dto.RegisterRequest;
import ru.prokin.hrm.backend.model.User;
import ru.prokin.hrm.backend.repository.PositionRepository;
import ru.prokin.hrm.backend.repository.UserRepository;
import ru.prokin.hrm.backend.security.JwtUtil;
import ru.prokin.hrm.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PositionRepository positionRepository;

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@Valid @RequestBody AuthRequest authRequest) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    authRequest.getUsername(), 
                    authRequest.getPassword()
                )
            );
        } catch (Exception e) {
            return ResponseEntity.status(401).body(new AuthResponse(null, "Неверные учетные данные"));
        }

        final User user = userService.findByUsername(authRequest.getUsername());
        final String token = jwtUtil.generateToken(user.getId().toString());

        return ResponseEntity.ok(new AuthResponse(token, "Вход выполнен успешно"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userService.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity.status(400).body(new AuthResponse(null, "Имя пользователя уже существует"));
        }

        User user = new User(
            registerRequest.getUsername(),
            passwordEncoder.encode(registerRequest.getPassword()),
            registerRequest.getFirstName(),
            registerRequest.getLastName()
        );

        // Save the user directly using the repository
        userRepository.save(user);

        return ResponseEntity.ok(new AuthResponse(null, "Регистрация прошла успешно"));
    }
}