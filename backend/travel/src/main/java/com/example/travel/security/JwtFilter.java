package com.example.travel.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtFilter extends OncePerRequestFilter {

  @Autowired
  private JWTUtil jwtUtil;

  @Override
  protected void doFilterInternal(
    HttpServletRequest request,
    HttpServletResponse response,
    FilterChain filterChain
  ) throws ServletException, IOException {
    String path = request.getServletPath();
    if (path.equals("/auth/login") || path.equals("/auth/signup")) {
      filterChain.doFilter(request, response);
      return;
    }

    String token = jwtUtil.resolveToken(request);

    if (token != null && jwtUtil.validateToken(token)) {
      Authentication authentication = jwtUtil.getAuthentication(token);
      UsernamePasswordAuthenticationToken authToken =
        (UsernamePasswordAuthenticationToken) authentication;
      authToken.setDetails(
        new WebAuthenticationDetailsSource().buildDetails(request)
      );
      SecurityContextHolder.getContext().setAuthentication(authToken);
    }

    filterChain.doFilter(request, response);
  }
}
