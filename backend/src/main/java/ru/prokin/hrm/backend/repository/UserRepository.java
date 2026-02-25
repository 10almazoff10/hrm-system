package ru.prokin.hrm.backend.repository;

import ru.prokin.hrm.backend.model.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u WHERE u.username = :username")
    Optional<User> findByUsername(@Param("username") String username);

    Boolean existsByUsername(String username);

    @Modifying
    @Query("DELETE FROM User u WHERE u.username = :username")
    void deleteByUsername(@Param("username") String username);

    /**
     * Важнейший метод для работы профиля.
     * EntityGraph говорит Hibernate: "Сделай JOIN с таблицами позиций и компаний сразу".
     */
    @EntityGraph(attributePaths = {"position", "company"})
    @Override
    Optional<User> findById(Long id);
}
