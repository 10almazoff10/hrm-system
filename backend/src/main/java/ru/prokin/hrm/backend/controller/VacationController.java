package ru.prokin.hrm.backend.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.prokin.hrm.backend.dto.VacationRequest;
import ru.prokin.hrm.backend.dto.VacationResponse;
import ru.prokin.hrm.backend.model.User;
import ru.prokin.hrm.backend.service.VacationService;

import java.util.List;

@RestController
@RequestMapping("/api/vacations")
public class VacationController {

    private final VacationService vacationService;

    public VacationController(VacationService vacationService) {
        this.vacationService = vacationService;
    }

    @GetMapping("/calendar")
    public List<VacationResponse> getCalendar(@AuthenticationPrincipal User user, @RequestParam(required = false) Long positionId) {
        return vacationService.getCalendar(user, positionId);
    }

    @GetMapping("/my")
    public List<VacationResponse> getMyVacations(@AuthenticationPrincipal User user) {
        return vacationService.getUserVacations(user);
    }

    @PostMapping
    public ResponseEntity<?> create(@AuthenticationPrincipal User user, @Valid @RequestBody VacationRequest request) {
        vacationService.createVacation(user, request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @AuthenticationPrincipal User user, @Valid @RequestBody VacationRequest request) {
        vacationService.updateVacation(id, user, request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        vacationService.deleteVacation(id, user);
        return ResponseEntity.ok().build();
    }
}

