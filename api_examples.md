# Примеры curl запросов к API системы учета отпусков

## 1. Регистрация нового пользователя
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ivanov",
    "password": "securepassword123",
    "firstName": "Иван",
    "lastName": "Иванов"
  }'

## 2. Вход в систему
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ivanov",
    "password": "securepassword123"
  }'

## 3. Получение информации о профиле (требуется токен)
# Замените YOUR_JWT_TOKEN_HERE на актуальный JWT токен, полученный при входе
curl -X GET http://localhost:8080/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"

## 4. Обновление профиля (требуется токен)
# Замените YOUR_JWT_TOKEN_HERE на актуальный JWT токен, полученный при входе
curl -X PUT http://localhost:8080/user/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "username": "petrov",
    "firstName": "Петр",
    "lastName": "Петров",
    "password": "newpassword123"
  }'

## 5. Пример ответа при регистрации
# {
#   "token": null,
#   "message": "Регистрация прошла успешно"
# }

## 6. Пример ответа при входе
# {
#   "token": "eyJhbGciOiJIUzI1NiJ9...",
#   "message": "Вход выполнен успешно"
# }

## 7. Пример ответа при ошибке входа
# {
#   "token": null,
#   "message": "Неверные учетные данные"
# }

## 8. Пример ответа при ошибке регистрации (пользователь уже существует)
# {
#   "token": null,
#   "message": "Имя пользователя уже существует"
# }