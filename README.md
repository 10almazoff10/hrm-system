# HRM System — Система взаимодействия с сотрудниками

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Система учета и управления сотрудников (HRM — Human Resource Management). Веб-приложение для отслеживания отпусков, управления профилями сотрудников и просмотра календаря отпусков.

## 📋 О проекте

HRM System — это полнофункциональное веб-приложение для управления отпусками в организации. Позволяет сотрудникам подавать заявки на отпуск, просматривать календарь отпусков коллег, а администраторам — управлять пользователями системы.

## ✨ Возможности

### Роли пользователей
- **ROLE_USER** — базовая роль для всех сотрудников
- **ROLE_ADMIN** — расширенные права для управления пользователями

### Функционал
- Регистрация и аутентификация пользователей с JWT-токенами
- Управление профилем сотрудника (ФИО, должность, пароль)
- Подача заявок на отпуск
- Просмотр личного календаря отпусков
- Просмотр календаря отпусков по должностям
- Управление заявками на отпуск (создание, редактирование, удаление)
- Просмотр списка коллег
- Администрирование пользователей (только для роли ADMIN)

## 🛠 Технологический стек

### Backend
- **Java 25**
- **Spring Boot 4.0.3**
- **Spring Security** — аутентификация и авторизация
- **Spring Data JPA** — работа с данными
- **Spring Validation** — валидация запросов
- **JJWT 0.12.6** — JWT-токены
- **PostgreSQL 18** — база данных
- **Lombok** — уменьшение шаблонного кода
- **Maven** — сборка проекта

### Frontend
- **React 19**
- **React Router DOM 7** — навигация
- **Bootstrap 5** — UI-компоненты
- **FullCalendar 6** — календарь отпусков
- **Axios** — HTTP-запросы
- **Vite** — сборка приложения
- **Docker** — контейнеризация

## 📁 Структура проекта

```
hrm-system/
├── backend/                 # Backend на Spring Boot
│   ├── src/main/java/
│   │   └── ru/prokin/hrm/backend/
│   │       ├── controller/  # REST-контроллеры
│   │       ├── model/       # JPA-модели
│   │       ├── repository/  # Репозитории
│   │       ├── service/     # Бизнес-логика
│   │       ├── security/    # JWT и Security config
│   │       └── dto/         # Data Transfer Objects
│   ├── pom.xml
│   └── Dockerfile
├── frontend/                # Frontend на React
│   ├── src/
│   │   ├── components/      # React-компоненты
│   │   ├── pages/           # Страницы приложения
│   │   ├── styles/          # Стили
│   │   └── utils/           # Утилиты
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml       # Оркестрация контейнеров
└── .env                     # Переменные окружения
```

## 🚀 Быстрый старт

### Требования
- Docker и Docker Compose
- Java 25 (для разработки backend)
- Node.js 18+ (для разработки frontend)

### Запуск через Docker Compose

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd hrm-system
```

2. Создайте файл `.env` на основе `env.example`:
```bash
cp env.example .env
```

3. Запустите приложение:
```bash
docker-compose up --build
```

4. Откройте в браузере:
- Frontend: http://localhost:80
- Backend API: http://localhost:8080

### Локальная разработка

#### Backend
```bash
cd backend
./mvnw spring-boot:run
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📡 API Endpoints

### Публичные endpoints (без аутентификации)

| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/auth/register` | Регистрация нового пользователя |
| POST | `/auth/login` | Аутентификация и получение JWT-токена |

### Пользовательские endpoints (требуется аутентификация)

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/user/profile` | Получение профиля текущего пользователя |
| PUT | `/user/profile` | Обновление профиля |
| GET | `/user/profile/roles` | Получение ролей пользователя |
| GET | `/api/vacations/calendar` | Календарь отпусков |
| GET | `/api/vacations/my` | Мои отпуска |
| POST | `/api/vacations` | Создание заявки на отпуск |
| PUT | `/api/vacations/{id}` | Редактирование заявки |
| DELETE | `/api/vacations/{id}` | Удаление заявки |

### Админские endpoints (требуется роль ADMIN)

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/admin/users` | Список всех пользователей |
| PUT | `/admin/users/{id}/role/admin` | Назначить роль ADMIN |

## 📝 Примеры запросов

### Регистрация пользователя
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ivanov",
    "password": "securepassword123",
    "firstName": "Иван",
    "lastName": "Иванов",
    "position": "Разработчик"
  }'
```

### Вход в систему
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ivanov",
    "password": "securepassword123"
  }'
```

### Получение профиля (с токеном)
```bash
curl -X GET http://localhost:8080/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 🗃 Структура базы данных

### Таблицы
- **users** — пользователи (id, username, password, firstName, lastName, position)
- **roles** — роли (id, name)
- **user_roles** — связь пользователей и ролей
- **vacations** — отпуска (id, user_id, startDate, endDate, status)
- **positions** — должности
- **company** — компания

## 🔐 Назначение прав администратора

Для предоставления прав администратора пользователю:

1. Подключитесь к базе данных PostgreSQL
2. Найдите ID пользователя в таблице `users`
3. Найдите ID роли `ROLE_ADMIN` в таблице `roles`
4. Добавьте запись в таблицу `user_roles`:
```sql
INSERT INTO user_roles (user_id, role_id) VALUES (<user_id>, <admin_role_id>);
```

## ⚙️ Конфигурация

Файл `.env`:
```env
# Database
DB_HOST=db
DB_PORT=5432
DB_NAME=vacation_db
DB_USER=vacation_user
DB_PASSWORD=password

EXTERNAL_URL=http://localhost:8081
VITE_API_URL=http://localhost
```

## 📄 Лицензия

MIT License — см. файл [LICENSE](LICENSE) для подробностей.

## 👤 Автор

Prokin Oleg

---

## 🤝 Вклад в проект

Приветствуются issue и pull requests! Для внесения изменений:

1. Создайте fork репозитория
2. Создайте ветку для вашей функции (`git checkout -b feature/AmazingFeature`)
3. Закоммитьте изменения (`git commit -m 'Add some AmazingFeature'`)
4. Отправьте в ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request
