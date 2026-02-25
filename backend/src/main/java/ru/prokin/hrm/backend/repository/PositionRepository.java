package ru.prokin.hrm.backend.repository;

import ru.prokin.hrm.backend.model.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PositionRepository extends JpaRepository<Position, Long> {
    Optional<Position> findByName(String name);
    List<Position> findByCompany_Id(Long companyId);
}