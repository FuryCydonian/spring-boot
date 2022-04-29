package com.fury_cydonian.spring_boot.config;

import com.fury_cydonian.spring_boot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private final SuccessUserHandler successUserHandler;

    private final UserService userService;

    @Autowired
    public WebSecurityConfig(SuccessUserHandler successUserHandler, UserService userService) {
        this.successUserHandler = successUserHandler;
        this.userService = userService;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeRequests()
                    .antMatchers("/").permitAll()
                    .antMatchers("/test").permitAll()
                    .antMatchers("/admin/**").hasRole("ADMIN")
                    .antMatchers("/user").hasAnyRole("ADMIN", "USER")
                .anyRequest().authenticated()
                .and()
                .formLogin()
                    .loginPage("/login")
                    .permitAll()
                    .successHandler(successUserHandler)
                .and()
                .logout()
                    .permitAll()
                .and()
                .logout().permitAll()
                    .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                    .logoutSuccessUrl("/login?logout")
                    .invalidateHttpSession(true)
                    .clearAuthentication(true)
                    .deleteCookies("JSESSIONID");
    }

    @Bean("bCryptPasswordEncoder")
    protected BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
//        auth.authenticationProvider(daoAuthenticationProvider());
        auth.userDetailsService(userService).passwordEncoder(bCryptPasswordEncoder());
    }

//    @Bean
//    protected DaoAuthenticationProvider daoAuthenticationProvider() {
//        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
//        daoAuthenticationProvider.setPasswordEncoder(bCryptPasswordEncoder());
//        daoAuthenticationProvider.setUserDetailsService(userService);
//        return daoAuthenticationProvider;
//    }
}
