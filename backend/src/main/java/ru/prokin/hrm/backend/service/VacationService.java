package ru.prokin.hrm.backend.service;

import ru.prokin.hrm.backend.dto.VacationRequest;
import ru.prokin.hrm.backend.dto.VacationResponse;
import ru.prokin.hrm.backend.model.User;
import java.util.List;

public interface VacationService {
    List<VacationResponse> getCalendar(User user, Long positionId);
    void createVacation(User user, VacationRequest request);
    void updateVacation(Long id, User user, VacationRequest request);
    void deleteVacation(Long id, User user);
    List<VacationResponse> getUserVacations(User user);
}
