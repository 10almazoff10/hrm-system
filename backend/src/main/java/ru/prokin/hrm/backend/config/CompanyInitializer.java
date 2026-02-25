package ru.prokin.hrm.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import ru.prokin.hrm.backend.model.Company;
import ru.prokin.hrm.backend.model.Position;
import ru.prokin.hrm.backend.repository.CompanyRepository;
import ru.prokin.hrm.backend.repository.PositionRepository;


@Component
public class CompanyInitializer implements CommandLineRunner {

    @Autowired
    private PositionRepository positionRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Override
    public void run(String... args) throws Exception {
        // Проверяем, есть ли уже данные, чтобы не дублировать при перезапуске
        if (companyRepository.count() == 0) {

            // 1. Создаем и сохраняем первую компанию
            Company softLogic = companyRepository.save(new Company("ООО Новая компания"));

            // Добавляем должности для первой компании
            savePosition("Администраторы", softLogic);
            savePosition("Бэк-офис", softLogic);
            savePosition("Контроль качества", softLogic);
            savePosition("Менеджеры", softLogic);
            savePosition("Сопровождение и Внедрение", softLogic);
            savePosition("Технический писатель", softLogic);
            savePosition("ТПО, РМА", softLogic);
            savePosition("Шлюзы", softLogic);
            savePosition("Электронный кошелек", softLogic);
            savePosition("Организационная деятельность", softLogic);

            // 2. Создаем и сохраняем вторую компанию
            Company smartix = companyRepository.save(new Company("ООО Вторая компания"));

            // Добавляем должности для второй компании
            savePosition("Контроль качества", smartix);
            savePosition("Сервер и Интеграции", smartix);
            savePosition("Сопровождение и Внедрение", smartix);
            savePosition("UI", smartix);
            savePosition("Мобильные приложения", smartix);
            savePosition("Менеджеры", smartix);
        }
    }

    // Вспомогательный метод для удобства
    private void savePosition(String name, Company company) {
        Position position = new Position(name);
        position.setCompany(company); // Устанавливаем связь
        positionRepository.save(position);
    }
}
