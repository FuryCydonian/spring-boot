$(function () {

    console.log('HELLO FROM JS FILE!!!!!!!!!!!!!!!!!!!!!')

    onClickTableButton()
});

const userFetchService = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // 'Referer': null
    },
    findAllUsers: async () => await fetch('api/users'),
    findOneUserById: async (id) => await fetch(`api/users/${id}`),
    addNewUser: async (user) => await fetch('api/users', {
        method: 'POST',
        headers: userFetchService.headers,
        body: JSON.stringify(user)
    }),
    updateUser: async (user, id) => await fetch(`api/users/${id}`, {
        method: 'PUT',
        headers: userFetchService.headers,
        body: JSON.stringify(user)
    }),
    deleteUser: async (id) => await fetch(`api/users/${id}`, {
        method: 'DELETE',
        headers: userFetchService.headers
    }),
    findAllRoles: async () => await fetch('api/roles'),
}

const onClickTableButton = () => {
    $("#mainTableWithUsers").find('button').on('click', (event) => {
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

const editUser = (id) => {
    let modal = $(`#editUserModal${id}`)
    modal.find(`#editFormBtn${id}`).on('click', async (event) => {
        console.log('EDIT BUTTON CLICKED')

        let id = modal.find('#editID').val().trim()
        console.log('USER ID FROM MODAL: ' + id)

        let firstName = modal.find('#editFirstName').val().trim()
        let email = modal.find(`#editEmail${id}`).val().trim()
        let password = modal.find(`#editPassword${id}`).val().trim()

        if (email === '' || password === '') {
            alert('It seems You forgot email or password')
            return
        }

        if (!isEmail(email)) {
            alert('Wrong email format')
            return
        }

        let rolesIDFromForm = modal.find('#editRoles').val();
        console.log('ROLES_ID: ' + rolesIDFromForm)

        let userRoles = []

        let allRolesFromDB = await (await userFetchService.findAllRoles()).json()
        console.log(allRolesFromDB)

        allRolesFromDB.forEach(roleFromDB => {
            rolesIDFromForm.forEach(roleID => roleID == roleFromDB.id ? userRoles.push(roleFromDB) : null)
        })

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
            modal.modal('hide')
            location.reload();
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