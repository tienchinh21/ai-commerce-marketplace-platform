package me.xjanua.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import me.xjanua.model.Role;
import me.xjanua.model.User;
import me.xjanua.model.UserRole;

public interface UserRoleRepository extends JpaRepository<UserRole, Integer>, JpaSpecificationExecutor<UserRole> {

    List<UserRole> findByUser(User user);

    boolean existsByUserAndRole(User user, Role role);
}
