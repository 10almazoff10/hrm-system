package ru.prokin.hrm.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import ru.prokin.hrm.backend.dto.AuthRequest;
import ru.prokin.hrm.backend.dto.RegisterRequest;
import ru.prokin.hrm.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testRegisterUser() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest("testuser", "password", "Test", "User");
        registerRequest.setPositionId(1L); // Using a mock position ID

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Регистрация прошла успешно"));
    }

    @Test
    public void testLoginUser() throws Exception {
        // First register a user
        RegisterRequest registerRequest = new RegisterRequest("loginuser", "password", "Login", "User");
        registerRequest.setPositionId(1L); // Using a mock position ID
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk());

        // Then try to login
        AuthRequest authRequest = new AuthRequest("loginuser", "password");
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.message").value("Вход выполнен успешно"));
    }

    @Test
    public void testLoginWithInvalidCredentials() throws Exception {
        AuthRequest authRequest = new AuthRequest("nonexistent", "wrongpassword");
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Неверные учетные данные"));
    }
}