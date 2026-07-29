package me.xjanua.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import me.xjanua.dto.UserDetailsCustom;
import me.xjanua.dto.auth.AuthenticationRequest;
import me.xjanua.dto.auth.ResponseLoginDto;
import me.xjanua.dto.user.UserRegisterRequest;
import me.xjanua.service.AuthService;
import me.xjanua.service.TokenService;
import me.xjanua.service.UserService;

@RequestMapping("/auth")
@RequiredArgsConstructor
@RestController
public class AuthController {

    private final AuthService authService;
    private final TokenService tokenService;
    private final UserService userService;
    
    @PostMapping("/login")
    public ResponseEntity<ResponseLoginDto> login(@RequestBody AuthenticationRequest request) {
        UserDetailsCustom userDetails = authService.authenticate(request);

        ResponseLoginDto res = new ResponseLoginDto();
        String accessToken = tokenService.createAccessToken(userDetails.getUserId(), userDetails.getAuthorities());
        res.setAccessToken(accessToken);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody UserRegisterRequest request) {
        userService.register(request);
        return ResponseEntity.ok().build();
    }
}
