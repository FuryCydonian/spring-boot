$(async function () {
    console.log('!!!!!!!!!!!!!!!test.js file')
    await getTableWithUsers()
    // onClickTableButton()
    // getNewUserForm();
    // getDefaultModal();
    // addNewUser();
})

const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    findAllUsers: async () => await fetch('api/users'),
    findOneUserById: async (id) => await fetch(`api/users/${id}`),
    addNewUser: async (user) => await fetch('api/users', {
        method: 'POST',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    updateUser: async (user, id) => await fetch(`api/users/${id}`, {
        method: 'PUT',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    deleteUser: async (id) => await fetch(`api/users/${id}`, {
        method: 'DELETE',
        headers: userFetchService.head
    }),
    findAllRoles: async () => await fetch('api/roles'),
}

const getTableWithUsers = async () => {
    let table = $('#mainTableWithUsers tbody')
    table.empty()

    let usersJson = (await userFetchService.findAllUsers()).json()
    usersJson.then(users => {
        console.log(users)
        users.forEach(user => {
            let userRoles = ``
            for (let role of user.roles) {
                userRoles += role.name.replace('ROLE_', '') + ' '
            }
            let tableRow = `$(
                <tr>
                    <td>${user.id}</td>
                    <td>${user.firstName}</td>
                    <td>${user.email}</td>
                    <td>${userRoles.slice(0, -1)}</td>
                    <td>
                        <button type="button" data-id="${user.id}" data-action="edit" class="btn btn-info btn-sm" 
                                data-toggle="modal" data-target="#someDefaultModal">Edit</button>
                    </td>
                    <td>
                        <button type="button" data-id="${user.id}" data-action="delete" class="btn btn-danger btn-sm" 
                                data-toggle="modal" data-target="#someDefaultModal">Delete</button>
                    </td>
                </tr>
            )`
            table.append(tableRow)
        })
    })

    console.log('TABLE CREATED')

    // обрабатываем нажатие на любую из кнопок edit или delete
    // достаем из нее данные и отдаем модалке, которую открываем
    $('#mainTableWithUsers').find('button').on('click', (event) => {
        let defaultModal = $('#someDefaultModal');

        let targetButton = $(event.target);
        alert(targetButton)

        let buttonUserId = targetButton.attr('data-id');
        console.log(buttonUserId)
        let buttonAction = targetButton.attr('action');
        console.log(buttonAction)

        defaultModal.attr('data-id', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}

const onClickTableButton = () => {
    $('#mainTableWithUsers').find('button').on('click', (event) => {
        let targetButton = $(event.target);
        console.log('target button: ' + targetButton)

        let userId = targetButton.data('id')
        console.log('user ID: ' + userId)

        let action = targetButton.data('action')
        console.log('action: ' + action)

        if (action === 'edit') {
            console.log('IF EDIT!!!!!!!!!!!!!!!')
            editUser(userId)
        }
    })
}

// что то деалем при открытии модалки и при закрытии
// основываясь на ее дата атрибутах
const getDefaultModal = async () => {
    $('#someDefaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-id');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                // deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}


// редактируем юзера из модалки редактирования, забираем данные, отправляем
const editUser = async (modal, id) => {
    let user = (await userFetchService.findOneUserById(id)).json;

    modal.find('.modal-title').html('Edit user');

    let editButton = `<button  class="btn btn-outline-success" id="editButton">Edit</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(editButton);
    modal.find('.modal-footer').append(closeButton);

    user.then(user => {
        let bodyForm = `
            <form class="form-group" id="editUser">
                <input type="text" class="form-control" id="id" name="id" value="${user.id}" disabled><br>
                <input class="form-control" type="text" id="firstName" value="${user.firstName}"><br>
                <input class="form-control" type="text" id="email" value="${user.email}"><br>
                <input class="form-control" type="password" id="password"><br>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    })

    $("#editButton").on('click', async () => {
        let id = modal.find("#id").val().trim();
        let firstName = modal.find("#firstName").val().trim();
        let email = modal.find("#email").val().trim();
        let password = modal.find("#password").val().trim();
        let data = {
            id: id,
            firstName: firstName,
            email: email,
            password: password,
            // age: age
        }
        const response = await userFetchService.updateUser(data, id);

        if (response.ok) {
            getTableWithUsers();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}