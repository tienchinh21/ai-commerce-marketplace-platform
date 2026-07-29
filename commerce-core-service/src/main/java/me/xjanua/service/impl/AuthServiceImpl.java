package me.xjanua.service.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import me.xjanua.dto.UserDetailsCustom;
import me.xjanua.dto.auth.AuthenticationRequest;
import me.xjanua.service.AuthService;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;

    @Override
    public UserDetailsCustom authenticate(AuthenticationRequest request) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword());

        Authentication authentication = authenticationManager.authenticate(authenticationToken);
        return (UserDetailsCustom) authentication.getPrincipal();
    }
}
