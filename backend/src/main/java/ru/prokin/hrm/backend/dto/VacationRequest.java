package ru.prokin.hrm.backend.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record VacationRequest(
        @NotNull(message = "Дата начала обязательна")
        LocalDate startDate,

        @NotNull(message = "Дата окончания обязательна")
        LocalDate endDate
) {
    // В рекордах можно добавлять компактные конструкторы для дополнительной валидации
    public VacationRequest {
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Дата начала не может быть позже даты окончания");
        }
    }
}
