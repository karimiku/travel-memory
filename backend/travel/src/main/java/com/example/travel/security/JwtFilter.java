package com.example.travel.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

  @Autowired
  private JWTUtil jwtUtil;

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {

    String path = request.getServletPath();
    if (path.equals("/login/oauth2/code")) {
      filterChain.doFilter(request, response);
      return;
    }

    try {
      String token = jwtUtil.resolveToken(request);

      if (token != null && jwtUtil.validateToken(token)) {
        Authentication authentication = jwtUtil.getAuthentication(token);

        if (authentication != null) {
          UsernamePasswordAuthenticationToken authToken = (UsernamePasswordAuthenticationToken) authentication;
          authToken.setDetails(
              new WebAuthenticationDetailsSource().buildDetails(request));
          SecurityContextHolder.getContext().setAuthentication(authToken);
        } else {
          System.out.println("JWT認証エラー: authentication が null です");
        }
      }

    } catch (Exception e) {
      System.err.println("JWT Filter で例外発生: " + e.getMessage());
      e.printStackTrace();
    }

    filterChain.doFilter(request, response);
  }
}