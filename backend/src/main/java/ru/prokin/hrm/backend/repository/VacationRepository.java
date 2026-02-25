package ru.prokin.hrm.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.prokin.hrm.backend.model.Vacation;
import java.util.List;

public interface VacationRepository extends JpaRepository<Vacation, Long> {

    // Личные отпуска
    List<Vacation> findByUserId(Long userId);

    // Отпуска всех коллег по компании (для календаря)
    @Query("SELECT v FROM Vacation v JOIN FETCH v.user u WHERE u.company.id = :companyId")
    List<Vacation> findAllByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT v FROM Vacation v JOIN FETCH v.user u " +
            "WHERE u.position.id = :positionId")
    List<Vacation> findAllByPositionId(@Param("positionId") Long positionId);

}
