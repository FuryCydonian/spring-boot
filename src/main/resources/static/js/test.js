$(async function () {
    console.log('!!!!!!!!!!!!!!!   TEST.js file')
    await getTableWithUsers()
    await addNewUser()
    modalFunc()
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
                                data-toggle="modal" 
                                data-target="#editModal"
                                id="editTableButton">Edit</button>
                    </td>
                    <td>
                        <button type="button" data-id="${user.id}" data-action="delete" class="btn btn-danger btn-sm" 
                                data-toggle="modal" 
                                data-target="#deleteModal" 
                                id="deleteTableButton">Delete</button>
                    </td>
                </tr>
            )`
            tableBody.append(tableRow)
        })
    })
}

const modalFunc = () => {
    const editModal = $('#editModal')
    const deleteModal = $('#deleteModal')
    console.log('EDIT MODAL: ' + editModal)

    $('#mainTableWithUsers').find('button').on('click', async (event) => {
        event.preventDefault()
        let targetButton = $(event.target)
        let userID = targetButton.data('id')
        console.log('USER ID FROM BUTTON TABLE: ' + userID)
        let action = targetButton.data('action')
        console.log('ACTION: ' + action)

        // const user = await (await userFetchService.findOneUserById(userID)).json()
        //
        // console.log('USER FROM EDIT_USER FUNC: ' + user.firstName + ' ' + user.email)
        //
        // const allRoles = await (await userFetchService.findAllRoles()).json()
        //
        // allRoles.forEach(role => console.log('ROLES: ' + role.name))
        //
        // // заполняем форму юзером
        // editModal.find('#editID').val(user.id).prop('disabled', true)
        // editModal.find('#editFirstName').val(user.firstName)
        // editModal.find('#editEmail').val(user.email)
        //
        // allRoles.forEach(role => {
        //     user.roles.forEach(userRole => {
        //         editModal.find('#editRoles').append(new Option(role.name.replace('ROLE_', ''), role.id,
        //             false, role.id == userRole.id ? true : false)).prop('required', true)
        //     })
        //
        // })
        // editModal.modal('show')
        //
        // editModal.find(`#editButtonAccept`).on('click', async (event) => {
        //     event.preventDefault()
        //     console.log('EDIT BUTTON CLICKED')
        //
        //     const id = editModal.find('#editID').val().trim()
        //     console.log('USER ID FROM MODAL: ' + id)
        //
        //     const firstName = editModal.find('#editFirstName').val().trim()
        //     const email = editModal.find(`#editEmail`).val().trim()
        //
        //     console.log('EMAIL FROM FIELD: ' + email)
        //
        //     const password = editModal.find(`#editPassword`).val().trim()
        //
        //     const rolesIDFromForm = editModal.find('#editRoles').val();
        //     console.log('ROLES_ID: ' + rolesIDFromForm)
        //
        //     let userRoles = []
        //
        //     console.log(allRoles)
        //
        //     allRoles.forEach(roleFromDB => {
        //         rolesIDFromForm.forEach(roleID => roleID == roleFromDB.id ? userRoles.push(roleFromDB) : null)
        //     })
        //
        //     if (email === '' || password === '') {
        //         alert('It seems You forgot email or password')
        //         return
        //     }
        //
        //     if (!isEmail(email)) {
        //         alert('Wrong email format')
        //         return
        //     }
        //
        //     const data = {
        //         id: id,
        //         firstName: firstName,
        //         email: email,
        //         password: password,
        //         roles: userRoles
        //     }
        //
        //     console.log(data)
        //
        //     let response = await userFetchService.updateUser(data, id)
        //
        //     if (response.ok) {
        //         await getTableWithUsers()
        //         // alert('User successfully updated')
        //         editModal.modal('hide')
        //     } else {
        //         alert(`response status: ${response.status},
        //                 ${response.body.toString()}`)
        //     }
        // })

        if (action === 'edit') {
            console.log('ID EDIT')
            await editUser(editModal, userID)
        } else if (action === 'delete') {
            console.log('IF DELETE')
            await deleteUser(deleteModal, userID)
        }
    })
};


// const editModal = () => {
//     editModal.modal({
//         keyboard: true,
//         backdrop: "static",
//         // show: false,
//     }).on('show.bs.modal', '#editModal', async (event) => {
//             event.preventDefault()
//             let button = $(event.relatedTarget);
//             console.log(button)
//             let id = button.data('id');
//             console.log('ID FROM EDIT MODAL ' + id)
//             let action = button.data('action');
//             await editUser($(this), id);
//         }).on('hidden.bs.modal', (event) => {
//
//     });
// }

// редактируем юзера из модалки редактирования, заполняем данными, забираем данные, отправляем
const editUser = async(modal, userID) => {
    const user = await (await userFetchService.findOneUserById(userID)).json()
    console.log('USER FROM EDIT_USER FUNC: ' + user.firstName + ' ' + user.email)
    const allRoles = await (await userFetchService.findAllRoles()).json()
    allRoles.forEach(role => console.log('ROLES: ' + role.name))

    // заполняем форму юзером
    modal.find('#editID').val(user.id).prop('disabled', true)
    modal.find('#editFirstName').val(user.firstName)
    modal.find('#editEmail').val(user.email)

    allRoles.forEach(role => {
        user.roles.forEach(userRole => {
            modal.find('#editRoles').append(new Option(role.name.replace('ROLE_', ''), role.id,
                false, role.id == userRole.id ? true : false)).prop('required', true)
        })
    })

    modal.find(`#editButtonAccept`).on('click', async (event) => {
        event.preventDefault()
        console.log('EDIT BUTTON CLICKED')

        let id = modal.find('#editID').val().trim()
        console.log('USER ID FROM MODAL: ' + id)

        const firstName = modal.find('#editFirstName').val().trim()
        const email = modal.find(`#editEmail`).val().trim()

        console.log('EMAIL FROM FIELD: ' + email)

        const password = modal.find(`#editPassword`).val().trim()

        const rolesIDFromForm = modal.find('#editRoles').val();
        console.log('ROLES_ID: ' + rolesIDFromForm)

        let userRoles = []

        console.log(allRoles)

        allRoles.forEach(roleFromDB => {
            rolesIDFromForm.forEach(roleID => roleID == roleFromDB.id ? userRoles.push(roleFromDB) : null)
        })

        if (email === '' || password === '') {
            alert('It seems You forgot email or password')
            return
        }

        if (!isEmail(email)) {
            alert('Wrong email format')
            return
        }

        const data = {
            id: id,
            firstName: firstName,
            email: email,
            password: password,
            roles: userRoles
        }

        console.log(data)

        let response = await userFetchService.updateUser(data, id)

        if (response.ok) {
            // await getTableWithUsers()
            // alert('User successfully updated')
            modal.modal('hide')
        } else {
            alert(`response status: ${response}`)
        }
    })
}

const deleteUser = async(modal, userID) => {
    const user = await (await userFetchService.findOneUserById(userID)).json()

    console.log('USER FROM DELETE_USER FUNC: ' + user.firstName + ' ' + user.email)
    const allRoles = await (await userFetchService.findAllRoles()).json()
    allRoles.forEach(role => console.log('ROLES: ' + role.name))

    // заполняем форму юзером
    modal.find('#ID').val(user.id).prop('disabled', true)
    modal.find('#firstName').val(user.firstName)
    modal.find('#email').val(user.email)

    allRoles.forEach(role => {
        user.roles.forEach(userRole => {
            modal.find('#roles').append(new Option(role.name.replace('ROLE_', ''), role.id,
                false, role.id == userRole.id ? true : false)).prop('required', true)
        })
    })

    modal.find('#deleteButtonAccept').on('click', async (event) => {
        event.preventDefault()
        let response = await userFetchService.deleteUser(userID)

        if (response.ok) {
            // await getTableWithUsers()
            modal.modal('hide')
        } else {
            alert(`response status: ${response}`)
        }
    })
}

const addNewUser = async() => {
    const allRoles = await (await userFetchService.findAllRoles()).json()

    const addUserForm = $('#newUser')

    allRoles.forEach(role => {
        addUserForm.find('#newRoles').append(new Option(role.name.replace('ROLE_', ''), role.id, false, role.id == 2 ? true : false))
    })

    $('#addButton').on('click', async (e) => {
        e.preventDefault()
        const firstName = addUserForm.find('#newFirstName').val().trim()
        const email = addUserForm.find('#newEmail').val().trim()
        const password = addUserForm.find('#newPassword').val().trim()

        const rolesFromForm = addUserForm.find('#newRoles').val()

        let selectedRoles = []
        allRoles.forEach(role => {
            rolesFromForm.forEach(roleIdFromForm => {
                if (role.id == roleIdFromForm) {
                    selectedRoles.push(role)
                }
            })
        })

        console.log('SELECTED ROLES: ' + selectedRoles)


        // TODO вместо повтора кода сделать функции чекеры пароля и ролей и имейла
        if (email === '' || password === '') {
            alert('It seems You forgot email or password or roles')
            return
        }

        if (!isEmail(email)) {
            alert('Wrong email format')
            return
        }

        const data = {
            firstName: firstName,
            email: email,
            password: password,
            roles: selectedRoles
        }

        const addResponse = await userFetchService.addNewUser(data)

        if (addResponse.ok) {
            await getTableWithUsers()
            alert('User successfully create')


            let selectors = ['#newFirstName', 'newEmail', 'newPassword']
            selectors.forEach(selector => {
                addUserForm.find(selector).reset()
            })
        } else {
            alert('Response status: ' + addResponse.statusText)
        }
    })

}

const isEmail = (email) => {
    let regExp = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
    return regExp.test(email)
}

