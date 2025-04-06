package com.example.travel.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

  private final JWTUtil jwtUtil;

  public OAuth2LoginSuccessHandler(JWTUtil jwtUtil) {
    this.jwtUtil = jwtUtil;
  }

  @Override
  public void onAuthenticationSuccess(
    HttpServletRequest request,
    HttpServletResponse response,
    Authentication authentication
  ) throws IOException, ServletException {
    var oAuth2User =
      (org.springframework.security.oauth2.core.user.OAuth2User) authentication.getPrincipal();
    String email = oAuth2User.getAttribute("email");

    String token = jwtUtil.generateToken(email);
    System.out.println("email from OAuth2: " + email);

    response.sendRedirect(
      "http://localhost:5173/oauth2/redirect?token=" + token
    );
  }
}
