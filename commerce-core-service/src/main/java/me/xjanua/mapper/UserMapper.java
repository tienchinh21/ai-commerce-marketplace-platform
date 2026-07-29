package me.xjanua.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import me.xjanua.dto.user.UserDetailResponse;
import me.xjanua.model.User;

@Mapper(componentModel = "spring", uses = RoleMapper.class)
public interface UserMapper {

    @Mapping(target = "roles", ignore = true)
    UserDetailResponse toDetailResponse(User user);
}
