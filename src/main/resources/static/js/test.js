$(async function () {
    console.log('!!!!!!!!!!!!!!!test.js file')
    await getTableWithUsers()
    editModal()
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
    let tableBody = $('#mainTableWithUsers tbody')
    tableBody.empty()

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
                                data-toggle="modal" data-target="#editModal" id="editTableButton">Edit</button>
                    </td>
                    <td>
                        <button type="button" data-id="${user.id}" data-action="delete" class="btn btn-danger btn-sm" 
                                data-toggle="modal" data-target="#deleteModal" id="deleteTableButton">Delete</button>
                    </td>
                </tr>
            )`
            tableBody.append(tableRow)
        })
    })

    console.log('TABLE CREATED')

    // обрабатываем нажатие на любую из кнопок edit или delete
    // достаем из нее данные и отдаем модалке, которую открываем
    // $('#mainTableWithUsers').find('button').on('click', (event) => {
    //     let defaultModal = $('#someDefaultModal');
    //
    //     let targetButton = $(event.target);
    //     alert(targetButton)
    //
    //     let buttonUserId = targetButton.attr('data-id');
    //     console.log(buttonUserId)
    //     let buttonAction = targetButton.attr('action');
    //     console.log(buttonAction)
    //
    //     defaultModal.attr('data-id', buttonUserId);
    //     defaultModal.attr('data-action', buttonAction);
    //     defaultModal.modal('show');
    // })
}

// const onClickEditButton = () => {
//     $('#mainTableWithUsers').find('#editTableButton').on('click', (event) => {
//         let targetButton = $(event.target);
//         console.log('target button: ' + targetButton)
//
//         let userId = targetButton.data('id')
//         console.log('user ID: ' + userId)
//
//         let action = targetButton.data('action')
//         console.log('action: ' + action)
//
//         if (action === 'edit') {
//             console.log('IF EDIT!!!!!!!!!!!!!!!')
//             editUser(userId)
//         }
//     })
// }

// // что то деалем при открытии модалки и при закрытии
// // основываясь на ее дата атрибутах
// const getEditModal = async () => {
//     $('#editModal').modal({
//         keyboard: true,
//         backdrop: "static",
//         show: false
//     }).on("show.bs.modal", (event) => {
//         let thisModal = $(event.target);
//         let userid = thisModal.attr('data-id');
//         let action = thisModal.attr('data-action');
//         switch (action) {
//             case 'edit':
//                 editUser(thisModal, userid);
//                 break;
//             case 'delete':
//                 // deleteUser(thisModal, userid);
//                 break;
//         }
//     }).on("hidden.bs.modal", (e) => {
//         let thisModal = $(e.target);
//         thisModal.find('.modal-title').html('');
//         thisModal.find('.modal-body').html('');
//         thisModal.find('.modal-footer').html('');
//     })
// }

function editModal() {
    $('#editModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false,
    }).on("show.bs.modal", (event) => {
        let button = $(event.relatedTarget);
        console.log(button)
        let id = button.data('id');
        console.log('ID FROM EDIT MODAL ' + id)
        let action = button.data('action');
        editUser($(this), id);
    }).on('hidden.bs.modal', function(event){

    });
}


// редактируем юзера из модалки редактирования, заполняем данными, забираем данные, отправляем
const editUser = async(modal, id) => {
    const user = await (await userFetchService.findOneUserById(id)).json()

    console.log('USER FROM EDIT_USER FUNC: ' + user.firstName + ' ' + user.email)

    const allRoles = await (await userFetchService.findAllRoles()).json()

    allRoles.forEach(role => console.log('ROLES: ' + role.name))

    modal.show();

    // заполняем форму юзером
    modal.find('#ID').val(user.id).prop('disabled', true)
    modal.find('#ID').attr('value, ')
    modal.find('#firstName').val(user.firstName)
    modal.find('#email').val(user.email)

    allRoles.forEach(role => {
        user.roles.forEach(userRole => {
            modal.find('#roles').append(new Option(role.name.replace('ROLE_', ''), role.id,
                false, role.id == userRole.id ? true : false)).prop('required', true)
        })

    })

    modal.find(`#editButtonAccept`).on('click', async (event) => {
        console.log('EDIT BUTTON CLICKED')

        // let id = modal.find('#ID').val().trim()
        console.log('USER ID FROM MODAL: ' + id)

        let firstName = modal.find('#firstName').val().trim()
        let email = modal.find(`#email`).val().trim()

        console.log('EMAIL FROM FIELD: ' + email)

        let password = modal.find(`#password`).val().trim()

        let rolesIDFromForm = modal.find('#roles').val();
        console.log('ROLES_ID: ' + rolesIDFromForm)

        let userRoles = []

        console.log(allRoles)

        allRoles.forEach(roleFromDB => {
            rolesIDFromForm.forEach(roleID => roleID == roleFromDB.id ? userRoles.push(roleFromDB) : null)
        })

        if (email === '' || password === '' || userRoles === []) {
            alert('It seems You forgot email or password or roles')
            return
        }

        if (!isEmail(email)) {
            alert('Wrong email format')
            return
        }

        let data = {
            id: id,
            firstName: firstName,
            email: email,
            password: password,
            roles: userRoles
        }

        console.log(data)

        let response = await userFetchService.updateUser(data, id)

        if (response.ok) {
            await getTableWithUsers()
            // alert('User successfully updated')
            modal.modal('hide')
        } else {
            alert(`response status: ${response.status}, 
            ${response.body.toString()}`)
        }
    })
}

const isEmail = (email) => {
    let regExp = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
    return regExp.test(email)
}

