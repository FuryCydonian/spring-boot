create table IF NOT EXISTS users
(
    id       bigint auto_increment
    primary key,
    email    varchar(255) not null,
    name     varchar(255) not null,
    password varchar(255) not null,
    constraint users_email_uindex
    unique (email)
);

create table IF NOT EXISTS roles
(
    id   int         not null
        primary key,
    name varchar(50) not null
);

create table IF NOT EXISTS users_roles
(
    user_id  bigint not null,
    role_id int    not null,
    foreign key (role_id) references roles (id),
    foreign key (user_id) references users (id)
);

-- Пароли твуик же как имена
insert into users (id, email, name, password) values
     (1, 'admin@mail.com', 'admin', '$2y$12$sK8lfqDsFbCsEMlimjqEBO/SCQn/olHJnBAKSFDlyx.8MV4fyk9xS'),
     (2, 'user@mail.com', 'user', '$2y$12$IkVlKZb5k5Z7Bt7Y7UEKDuDreASfBtIM.0RpJSjdZOylOuOfswN12'),
     (3, 'admin_user@mail.com', 'admin_user', '$2y$12$gBXER8KEuBUcWG6IHaFF9eXgvzYxvFCvYNSclbuyb7o5T9JTBiHS2');

insert into roles (id, name) values
    (1, 'ROLE_ADMIN'),
    (2, 'ROLE_USER');

insert into users_roles (user_id, role_id) values
    (1, 1),
    (2, 2),
    (3, 2),
    (3, 1);