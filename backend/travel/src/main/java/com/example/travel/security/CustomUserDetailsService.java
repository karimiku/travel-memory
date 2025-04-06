package com.example.travel.security;

import com.example.travel.entity.AppUser;
import com.example.travel.repository.UserRepository;
import java.util.Collections;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

  @Autowired
  private UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String email)
    throws UsernameNotFoundException {
    AppUser user = userRepository
      .findByEmail(email)
      .orElseThrow(() ->
        new UsernameNotFoundException("ユーザーが見つかりません")
      );

    return new User(
      user.getEmail(), // principal（ログインID）
      user.getPassword(), // password
      Collections.emptyList() // 権限（必要に応じて後で追加可能）
    );
  }
}
