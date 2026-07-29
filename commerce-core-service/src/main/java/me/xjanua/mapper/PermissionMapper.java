package me.xjanua.mapper;

import org.mapstruct.Mapper;

import me.xjanua.dto.permission.PermissionResponse;
import me.xjanua.model.Permission;

@Mapper(componentModel = "spring")
public interface PermissionMapper {

    PermissionResponse toResponse(Permission permission);
}
