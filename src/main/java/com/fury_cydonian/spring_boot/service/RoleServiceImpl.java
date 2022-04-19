package com.fury_cydonian.spring_boot.service;

import com.fury_cydonian.spring_boot.model.Role;
import com.fury_cydonian.spring_boot.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.management.relation.RoleNotFoundException;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Autowired
    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void createRole(Role role) {
        roleRepository.save(role);
    }

    @Override
    public Role getRoleById(Long id) {
        return roleRepository.findById(id).orElse(null);
    }

    @Override
    public void updateRole(Role role) {
        roleRepository.save(role);
    }

    @Override
    public void deleteRole(Long id) {
        roleRepository.delete(roleRepository.getById(id));
    }

    @Override
    public Set<Role> getRoles() {
        return roleRepository.findAll().stream().collect(Collectors.toSet());
    }

//    @Override
//    public Role findByName(String name) {
//        return roleRepository.findUserByNameRole(name);
//    }
}