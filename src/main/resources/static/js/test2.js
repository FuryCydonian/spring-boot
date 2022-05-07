const urlUsers = 'http://localhost:8080/api/users'
const urlRoles = 'http://localhost:8080/api/roles'
let tableBody = document.querySelector('#usersList')
let result = ''
getUsers()
function getUsers() {
    fetch(urlUsers)
        .then(response => response.json())
        .then(data => {
            drawUsersTable(data)
        })
        .catch(err => console.log(err))
}
const drawUsersTable = (users) => {
    tableBody.innerHTML = ''
    result = ''
    users.forEach( user => {
        let userRoles = ``
        for(let role of user.roles) {
            userRoles += role.name.replace("ROLE_", "") + ' '
        }
        result += `<tr>
                    <td>${user.id}</td>
                    <td>${user.firstName}</td>
                    <td>${user.email}</td>
                    <td>${userRoles}</td>
                    <td>
                        <button type="button" class="btn btn-info text-white" 
                            id="editButton"
                            data-id="${user.id}"
                            data-bs-toggle="modal">Edit
                        </button></td>
                    <td>
                        <button type="button" class="btn btn-danger text-white"
                            id="deleteButton"
                            data-id="${user.id}"
                            data-bs-toggle="modal">Delete
                        </button></td>
                   </tr>`

    })
    tableBody.innerHTML = result
}

const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e)
        }
    })
}

const editModal = new bootstrap.Modal(document.getElementById('editModal'))
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'))

on(document, 'click', '#editButton', e => {
    const tableRow = e.target.parentNode.parentNode
    let editIdForm = tableRow.children[0].innerHTML

    fetch(`${urlUsers}/${editIdForm}`)
        .then(res => res.json())
        .then(data => showEditModal(data))
})

on(document, 'click', '#deleteButton', e => {
    const tableRow = e.target.parentNode.parentNode
    let deleteIdForm = tableRow.children[0].innerHTML

    fetch(`${urlUsers}/${deleteIdForm}`)
        .then(res => res.json())
        .then(data => showDeleteModal(data))
})
//=================== edit ===========================
const showEditModal = (user) => {
    const editId = document.getElementById('editID')
    const editName = document.getElementById('editFirstName')
    const editEmail = document.getElementById('editEmail')
    const editRoles = document.getElementById('editRoles')

    editId.value = user.id
    editName.value = user.firstName
    editEmail.value = user.email
    while (editRoles.options.length) {
        editRoles.options[0] = null;
    }
    fetch(urlRoles)
        .then(res => res.json())
        .then(roles => {
            roles.forEach(role => {
                user.roles.forEach(userRole => {
                    if (userRole.id === role.id) {
                        editRoles.append(new Option(role.name.replace('ROLE_', ''), role.id, true, true));
                        role = true;
                    }
                });
                (role !== true) ? editRoles.append(new Option(role.name.replace('ROLE_', ''), role.id)) : null;
            });
        });

    editModal.show()

    const editUserButton = document.getElementById('editButtonAccept')
    editUserButton.addEventListener('click', e => {
        e.preventDefault()

        let rolesFromForm = document.getElementById('editRoles')
        let selectedOptions = rolesFromForm.selectedOptions
        let selected = []
        for (let i = 0; i < selectedOptions.length; i++) {
            selected.push({id: selectedOptions[i].value, name: 'ROLE_' + selectedOptions[i].text})
        }
        let prevPass = user.password
        let pass;
        if (document.getElementById('editPassword').value === '') {
            pass = prevPass
        } else {
            pass = document.getElementById('editPassword').value
        }
        let data = {
            id: editId.value,
            firstName: editName.value,
            email: editEmail.value,
            password: pass,
            roles: selected
        }
        fetch(`${urlUsers}/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(getUsers)

        editModal.hide()
        document.getElementById('editPassword').value = ''
    })
}
//=================== edit ===========================
//=================== delete =========================
const showDeleteModal = (user) => {
    const deleteId = document.getElementById('deleteID')
    const deleteName = document.getElementById('deleteFirstName')
    const deleteEmail = document.getElementById('deleteEmail')
    const deleteRoles = document.getElementById('deleteRoles')

    deleteId.value = user.id
    deleteName.value = user.firstName
    deleteEmail.value = user.email
    while (deleteRoles.options.length) {
        deleteRoles.options[0] = null;
    }
    fetch(urlRoles)
        .then(res => res.json())
        .then(roles => {
            roles.forEach(role => {
                user.roles.forEach(userRole => {
                    if (userRole.id === role.id) {
                        deleteRoles.append(new Option(role.name.replace('ROLE_', ''), role.id, true, true));
                        role = true;
                    }
                });
                (role !== true) ? deleteRoles.append(new Option(role.name.replace('ROLE_', ''), role.id)) : null;
            });
        });

    deleteId.setAttribute('disabled', 'true')
    deleteName.setAttribute('disabled', 'true')
    deleteEmail.setAttribute('disabled', 'true')
    deleteRoles.setAttribute('disabled', 'true')

    deleteModal.show()

    const deleteButtonAccept = document.getElementById('deleteButtonAccept')
    deleteButtonAccept.addEventListener('click', e => {
        e.preventDefault()
        fetch(`${urlUsers}/${user.id}`, {
            method: 'DELETE',
        })
            .then(getUsers)
        deleteModal.hide()
    })
}
//=================== delete =========================
//=================== add ============================
const name = document.getElementById('newFirstName')
const email = document.getElementById('newEmail')
const password = document.getElementById('newPassword')
const formRoles = document.getElementById('newRoles')
fetch(urlRoles)
    .then(res => res.json())
    .then(roles => {
        roles.forEach(role => {
            formRoles.append(new Option(role.name.replace('ROLE_', ''), role.id + ''));
        })
    })

const addUserButton = document.getElementById('addButton')
addUserButton.addEventListener('click', e => {
        e.preventDefault()
        let rolesFromForm = document.getElementById('newRoles')
        let selectedOptions = rolesFromForm.selectedOptions
        let selected = []
        for (let i = 0; i < selectedOptions.length; i++) {
            selected.push({id: selectedOptions[i].value, name: 'ROLE_' + selectedOptions[i].text})
        }

        let data = {
            firstName: name.value,
            email: email.value,
            password: password.value,
            roles: selected
        }
        fetch(urlUsers, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(getUsers)
        name.value = ''
        email.value = ''
        password.value = ''
        formRoles.value = ''
    })
//=================== add ============================