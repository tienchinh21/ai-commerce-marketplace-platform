package me.xjanua.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import me.xjanua.model.Permission;
import me.xjanua.model.Role;
import me.xjanua.model.RolePermission;

public interface RolePermissionRepository
        extends JpaRepository<RolePermission, Long>, JpaSpecificationExecutor<RolePermission> {

    List<RolePermission> findByRoleIn(List<Role> roles);

    List<RolePermission> findByRole(Role role);

    Optional<RolePermission> findByRoleAndPermission(Role role, Permission permission);
}
