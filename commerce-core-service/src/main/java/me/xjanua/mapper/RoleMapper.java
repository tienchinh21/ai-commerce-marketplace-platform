package me.xjanua.mapper;

import org.mapstruct.Mapper;
import me.xjanua.dto.role.RoleResponse;
import me.xjanua.dto.role.RoleSummaryResponse;
import me.xjanua.model.Role;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    RoleResponse toResponse(Role role);

    RoleSummaryResponse toSummaryResponse(Role role);
}
