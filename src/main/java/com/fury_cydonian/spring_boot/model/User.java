package com.fury_cydonian.spring_boot.model;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.Collection;
import java.util.List;

@Data
@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "role")
    private String role;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "status")
    private String status;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // TODO
//        Collection<Role> roles = List.of(this.getRole().);
        return null;
    }

    @Override
    public String getUsername() {
        return null;
    }

    @Override
    public boolean isAccountNonExpired() {
        return getStatus().equals(Status.ACTIVE);
    }

    @Override
    public boolean isAccountNonLocked() {
        return getStatus().equals(Status.ACTIVE);
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return getStatus().equals(Status.ACTIVE);
    }

    @Override
    public boolean isEnabled() {
        return getStatus().equals(Status.ACTIVE);
    }
}