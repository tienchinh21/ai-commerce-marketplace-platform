package me.xjanua.dto.permission;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PermissionRequest {
    private String code;
    private String description;
}