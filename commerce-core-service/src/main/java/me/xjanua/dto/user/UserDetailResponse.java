package me.xjanua.dto.user;

import java.util.List;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;
import me.xjanua.dto.role.RoleSummaryResponse;
import me.xjanua.enums.UserStatus;

@Getter
@Setter
public class UserDetailResponse {
    private UUID id;
    private String email;
    private UserStatus status;
    private List<RoleSummaryResponse> roles;
}
