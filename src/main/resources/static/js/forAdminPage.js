// import * as service from './static/js/fetchService';

$(function () {

    console.log('HELLO FROM JS FILE!!!!!!!!!!!!!!!!!!!!!')

    editModal()
});

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

const editModal = () => {
    $('edit-user-modal').modal({
        show: false
    }).on('show.bs.modal', (e) => {
        let button = $(e.relatedTarget)
        let id = button.data('userId')
        editUser($(this), id)
    })
}

const editUser = (modal, id) => {
    modal.find('#editFormBtn').on('click', async (event) => {
        let id = modal.find('#editID').val().trim()
        let firstName = modal.find('#editFirstName').val().trim()
        let email = modal.find('#editEmail').val().trim()
        let password = modal.find('#editPassword').val().trim()

        let rolesFromForm = modal.find('#editRoles').val().trim()

        // let userRoles = []

        let data = {
            id: id,
            firstName: firstName,
            email: email,
            password: email,
            roles: rolesFromForm
        }

        console.log(data)

        let response = await userFetchService.updateUser(data.id)
        if (response.ok) {
            alert(`${email} successfully updated`)
            modal.modal('hide')
        }
        alert(`response status: ${response.status}, /n ${response.body}`)
    })
}