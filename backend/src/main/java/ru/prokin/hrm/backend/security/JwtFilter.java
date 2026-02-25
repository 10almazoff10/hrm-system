package ru.prokin.hrm.backend.security;

import ru.prokin.hrm.backend.model.User;
import ru.prokin.hrm.backend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.lang.NonNull;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // 1. Проверяем наличие Bearer токена
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        String userId = null;

        try {
            userId = jwtUtil.extractUserId(jwt);
        } catch (Exception e) {
            logger.error("Could not extract userId from JWT token", e);
        }

        // 2. Если ID извлечен и аутентификация еще не установлена
        if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Находим пользователя в базе
            User user = userRepository.findById(Long.parseLong(userId)).orElse(null);

            // 3. Валидируем токен и создаем объект аутентификации
            if (user != null && jwtUtil.validateToken(jwt, userId)) {
                // Используем Collections.emptyList(), если не хотим передавать роли,
                // но хотим, чтобы пользователь считался аутентифицированным.
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        java.util.Collections.emptyList()
                );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
