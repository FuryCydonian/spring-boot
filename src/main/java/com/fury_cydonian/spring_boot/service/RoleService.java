package com.fury_cydonian.spring_boot.service;

import com.fury_cydonian.spring_boot.model.Role;

import javax.management.relation.RoleNotFoundException;
import java.util.Set;

public interface RoleService {
    Set<Role> getRoles();
    void createRole(Role role);
    Role getRoleById(Long id);
    void updateRole(Role role);
    void deleteRole(Long id);
//    Role findByName(String name);
}
