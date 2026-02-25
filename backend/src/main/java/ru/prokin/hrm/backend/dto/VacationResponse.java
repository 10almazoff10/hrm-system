package ru.prokin.hrm.backend.dto;

import java.time.LocalDate;

public record VacationResponse(
        Long id,
        String employeeName,
        LocalDate startDate,
        LocalDate endDate,
        String status,
        Long userId
) {}
