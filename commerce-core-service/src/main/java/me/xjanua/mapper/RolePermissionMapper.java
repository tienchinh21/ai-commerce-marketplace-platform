package me.xjanua.mapper;

import org.mapstruct.Mapper;

import me.xjanua.dto.rolePermission.RolePermissionResponse;
import me.xjanua.model.RolePermission;

@Mapper(componentModel = "spring")
public interface RolePermissionMapper {

    RolePermissionResponse toResponse(RolePermission rolePermission);
}
