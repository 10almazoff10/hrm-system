package ru.prokin.hrm.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import ru.prokin.hrm.backend.dto.RegisterRequest;
import ru.prokin.hrm.backend.dto.UserUpdateRequest;
import ru.prokin.hrm.backend.model.User;
import ru.prokin.hrm.backend.repository.UserRepository;
import ru.prokin.hrm.backend.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtUtil jwtUtil;

    private String token;

    @BeforeEach
    public void setUp() throws Exception {
        // Clean up any existing test user
        userRepository.deleteByUsername("testuser");

        // Register a test user
        RegisterRequest registerRequest = new RegisterRequest("testuser", "password", "Test", "User");
        registerRequest.setPositionId(1L); // Using a mock position ID
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)));

        // Generate a token for the test user
        User user = userRepository.findByUsername("testuser").orElse(null);
        if (user != null) {
            token = jwtUtil.generateToken(user.getId().toString());
        }
    }

    @Test
    public void testGetUserProfile() throws Exception {
        mockMvc.perform(get("/user/profile")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.firstName").value("Test"))
                .andExpect(jsonPath("$.lastName").value("User"));
    }

    @Test
    public void testUpdateUserProfile() throws Exception {
        UserUpdateRequest updateRequest = new UserUpdateRequest(null, "Updated", "Name");
        updateRequest.setPositionId(1L); // Using a mock position ID

        mockMvc.perform(put("/user/profile")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Updated"))
                .andExpect(jsonPath("$.lastName").value("Name"));
    }
}