package com.example.travel.security;

import com.example.travel.entity.AppUser;
import com.example.travel.entity.AuthProvider;
import com.example.travel.repository.UserRepository;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

  @Autowired
  private UserRepository userRepository;

  @Override
  public OAuth2User loadUser(OAuth2UserRequest userRequest)
    throws OAuth2AuthenticationException {
    OAuth2User oAuth2User = super.loadUser(userRequest);

    String email = oAuth2User.getAttribute("email");
    String username = oAuth2User.getAttribute("name");

    Optional<AppUser> userOptional = userRepository.findByEmail(email);
    AppUser user = userOptional.orElse(null);

    if (user == null) {
      AppUser newUser = new AppUser();
      newUser.setEmail(email);
      newUser.setUsername(
        username != null
          ? username
          : "user_" + UUID.randomUUID().toString().substring(0, 8)
      );
      newUser.setPassword(null); // Googleログインにはパスワード不要
      newUser.setAuthProvider(AuthProvider.GOOGLE);
      userRepository.save(newUser);
    }

    return oAuth2User;
  }
}
