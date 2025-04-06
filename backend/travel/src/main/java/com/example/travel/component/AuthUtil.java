package com.example.travel.component;

import com.example.travel.entity.AppUser;
import com.example.travel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

//認証ユーザー取得処理
@Component
public class AuthUtil {

  @Autowired
  private UserRepository userRepository;

  public AppUser getAuthenticatedUser() {
    Authentication auth = SecurityContextHolder.getContext()
      .getAuthentication();
    Object principal = auth.getPrincipal();
    String email;

    if (principal instanceof OAuth2User oAuth2User) {
      email = oAuth2User.getAttribute("email");
    } else if (principal instanceof User userDetails) {
      email = userDetails.getUsername();
    } else {
      throw new RuntimeException("ユーザー情報が取得できません。");
    }

    return userRepository
      .findByEmail(email)
      .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません"));
  }
}
