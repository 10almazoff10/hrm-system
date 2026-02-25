package ru.prokin.hrm.backend.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import ru.prokin.hrm.backend.dto.UserResponse;
import ru.prokin.hrm.backend.dto.UserUpdateRequest;
import ru.prokin.hrm.backend.model.Company;
import ru.prokin.hrm.backend.model.Position;
import ru.prokin.hrm.backend.model.User;
import ru.prokin.hrm.backend.repository.CompanyRepository;
import ru.prokin.hrm.backend.repository.PositionRepository;
import ru.prokin.hrm.backend.repository.UserRepository;
import ru.prokin.hrm.backend.security.JwtUtil;
import ru.prokin.hrm.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private PositionRepository positionRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getUserProfile(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();

        UserResponse response = new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getPosition() != null ? user.getPosition().getName() : "Не указана",
                user.getCompany() != null ? user.getCompany().getName() : "Не указана",
                user.getPosition() != null ? user.getPosition().getId() : null,
                user.getCompany() != null ? user.getCompany().getId() : null
        );


        return ResponseEntity.ok(response);
    }



    @GetMapping("/positions")
    public ResponseEntity<List<Position>> getPositionsByCompany(@RequestParam(required = false) Long companyId) {
        List<Position> positions;

        if (companyId != null) {
            // Возвращаем должности конкретной компании
            positions = positionRepository.findByCompany_Id(companyId);
        } else {
            // Если ID не передан, возвращаем всё (или пустой список, на твой вкус)
            positions = positionRepository.findAll();
        }

        return ResponseEntity.ok(positions);
    }


    @GetMapping("/companies")
    public ResponseEntity<List<Company>> getAllCompanies() {
        List<Company> companies = companyRepository.findAll();
        return ResponseEntity.ok(companies);
    }
    
    private String extractJwtFromRequest() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@Valid @RequestBody UserUpdateRequest userUpdateRequest) {
        try {
            String token = extractJwtFromRequest();
            if (token != null) {
                String userId = jwtUtil.extractUserId(token);
                User currentUser = userRepository.findById(Long.parseLong(userId)).orElse(null);
                if (currentUser != null) {
                    User updatedUser = userService.updateUser(currentUser.getUsername(), userUpdateRequest);
                    return ResponseEntity.ok(updatedUser);
                }
            }
            return ResponseEntity.status(401).build(); // Unauthorized
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Ошибка обновления профиля: " + e.getMessage()));
        }
    }
    
    // Error response helper class
    public static class ErrorResponse {
        private String message;
        
        public ErrorResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
    }
}