package ru.prokin.hrm.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
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
public class RegistrationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testRegisterUserSuccessfully() throws Exception {
        // Clean up any existing test user
        userRepository.deleteByUsername("registertestuser");

        RegisterRequest registerRequest = new RegisterRequest("registertestuser", "password123", "Test", "User");
        registerRequest.setPositionId(1L); // Using a mock position ID

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Регистрация прошла успешно"));
    }

    @Test
    public void testRegisterUserWithExistingUsername() throws Exception {
        // Clean up any existing test user
        userRepository.deleteByUsername("existinguser");

        // First, register a user
        RegisterRequest firstRegisterRequest = new RegisterRequest("existinguser", "password123", "Test", "User");
        firstRegisterRequest.setPositionId(1L); // Using a mock position ID
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(firstRegisterRequest)))
                .andExpect(status().isOk());

        // Then try to register with the same username
        RegisterRequest secondRegisterRequest = new RegisterRequest("existinguser", "anotherpassword", "Another", "User");
        secondRegisterRequest.setPositionId(1L); // Using a mock position ID
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(secondRegisterRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Имя пользователя уже существует"));
    }
}