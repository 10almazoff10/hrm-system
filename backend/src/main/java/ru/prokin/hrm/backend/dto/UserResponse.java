package ru.prokin.hrm.backend.dto;

public record UserResponse(
        Long id,
        String username,
        String firstName,
        String lastName,
        String positionName,
        String companyName,
        Long positionId,  // Добавь это
        Long companyId
) {}
