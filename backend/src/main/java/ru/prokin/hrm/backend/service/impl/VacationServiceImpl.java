package ru.prokin.hrm.backend.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.prokin.hrm.backend.dto.VacationRequest;
import ru.prokin.hrm.backend.dto.VacationResponse;
import ru.prokin.hrm.backend.model.User;
import ru.prokin.hrm.backend.model.Vacation;
import ru.prokin.hrm.backend.repository.VacationRepository;
import ru.prokin.hrm.backend.service.VacationService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class VacationServiceImpl implements VacationService {

    private final VacationRepository vacationRepository;

    public VacationServiceImpl(VacationRepository vacationRepository) {
        this.vacationRepository = vacationRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<VacationResponse> getCalendar(User user, Long positionId) {
        Long targetId = (positionId != null) ? positionId :
                (user.getPosition() != null ? user.getPosition().getId() : null);

        if (targetId == null) return List.of();

        return vacationRepository.findAllByPositionId(targetId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void createVacation(User user, VacationRequest request) {
        validateDates(request);
        Vacation vacation = new Vacation(user, request.startDate(), request.endDate());
        vacationRepository.save(vacation);
    }

    @Override
    public void updateVacation(Long id, User user, VacationRequest request) {
        validateDates(request);
        Vacation vacation = vacationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Отпуск не найден"));

        if (!vacation.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Доступ запрещен: это не ваша заявка");
        }

        if ("APPROVED".equals(vacation.getStatus())) {
            throw new RuntimeException("Нельзя редактировать уже одобренный отпуск");
        }

        vacation.setStartDate(request.startDate());
        vacation.setEndDate(request.endDate());
        vacation.setStatus("PENDING"); // Сброс на модерацию
        vacationRepository.save(vacation);
    }

    @Override
    public void deleteVacation(Long id, User user) {
        Vacation vacation = vacationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Отпуск не найден"));

        if (!vacation.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Доступ запрещен");
        }

        vacationRepository.delete(vacation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VacationResponse> getUserVacations(User user) {
        return vacationRepository.findByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private void validateDates(VacationRequest request) {
        if (request.startDate().isAfter(request.endDate())) {
            throw new RuntimeException("Дата начала не может быть позже даты окончания");
        }
    }

    private VacationResponse mapToResponse(Vacation v) {
        return new VacationResponse(
                v.getId(),
                v.getUser().getFirstName() + " " + v.getUser().getLastName(),
                v.getStartDate(),
                v.getEndDate(),
                v.getStatus(),
                v.getUser().getId()
        );
    }
}
