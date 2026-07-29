package me.xjanua.service;

import me.xjanua.dto.UserDetailsCustom;
import me.xjanua.dto.auth.AuthenticationRequest;

public interface AuthService {
    UserDetailsCustom authenticate(AuthenticationRequest request);
}
