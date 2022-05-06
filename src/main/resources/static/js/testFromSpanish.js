$(async function () {
    console.log('HELLO FROM SPANISH JS TEST')

    const fetchService = {
        head: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Referer': null
        },
        findAllUsers: async () => await fetch('api/users'),
        findOneUserById: async (id) => await fetch(`api/users/${id}`),
        addNewUser: async (user) => await fetch('api/users', {
            method: 'POST',
            headers: fetchService.head,
            body: JSON.stringify(user)
        }),
        updateUser: async (user, id) => await fetch(`api/users/${id}`, {
            method: 'PUT',
            headers: fetchService.head,
            body: JSON.stringify(user)
        }),
        deleteUser: async (id) => await fetch(`api/users/${id}`, {
            method: 'DELETE',
            headers: fetchService.head
        }),
        findAllRoles: async () => await fetch('api/roles'),
    }

    // const getTableWithUsers = async () => {
    //     let tableBody = $('#mainTableWithUsers tbody')
    //     tableBody.empty()
    //
    //     let usersJson = (await fetchService.findAllUsers()).json()
    //     usersJson.then(users => {
    //         console.log(users)
    //         users.forEach(user => {
    //             let userRoles = ``
    //             for (let role of user.roles) {
    //                 userRoles += role.name.replace('ROLE_', '') + ' '
    //             }
    //             let tableRow = `$(
    //                 <tr>
    //                     <td>${user.id}</td>
    //                     <td>${user.firstName}</td>
    //                     <td>${user.email}</td>
    //                     <td>${userRoles.slice(0, -1)}</td>
    //                     <td>
    //                         <button type="button" data-id="${user.id}" data-action="edit" class="btn btn-info btn-sm"
    //                                 data-bs-toggle="modal"
    //                                 data-bs-target="#editModal"
    //                                 id="editTableButton">Edit</button>
    //                     </td>
    //                     <td>
    //                         <button type="button" data-id="${user.id}" data-action="delete" class="btn btn-danger btn-sm"
    //                                 data-bs-toggle="modal"
    //                                 data-bs-target="#deleteModal"
    //                                 id="deleteTableButton">Delete</button>
    //                     </td>
    //                 </tr>
    //             )`
    //             tableBody.append(tableRow)
    //         })
    //     })
    // }

    // const users = 'http://localhost:8080/api/users'
    const tableBody = document.querySelector('tbody')
    let result = ''

    const editModal = new bootstrap.Modal(document.getElementById('editModal'))
    const editForm = document.getElementById('formEdit')

    const editID = document.getElementById('editID')
    const editFirstName = document.getElementById('editFirstName')
    const editEmail = document.getElementById('editEmail')
    const editPassword = document.getElementById('editPassword')
    const editRoles = document.getElementById('editRoles')

    let action = ''

    let editTableButton = document.getElementById('editTableButton')

    let tempButton = document.getElementById('tempButton')

    let allUsers = await (await fetchService.findAllUsers()).json()
    let allRoles = await (await fetchService.findAllRoles()).json()

    // tempButton.addEventListener('click', (event) => {
    //     // editID.val()
    //     editFirstName.value = ''
    //     editEmail.value = ''
    //     // editRoles
    //     editModal.show()
    //     option = 'test'
    // })

    const drawTableRows = (usersList) => {
        console.log(usersList)
        usersList.forEach(user => {
            let userRoles = ``
            for (let role of user.roles) {
                userRoles += role.name.replace('ROLE_', '') + ' '
            }
            result += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.firstName}</td>
                    <td>${user.email}</td>
                    <td>${userRoles.slice(0, -1)}</td>
                    <td>
                        <button type="button" data-id="${user.id}" data-action="edit" class="btn btn-info btn-sm text-white" 
                                data-bs-toggle="modal" 
                                
                                id="editTableButton">Edit</button>
                    </td>
                    <td>
                        <button type="button" data-id="${user.id}" data-action="delete" class="btn btn-danger btn-sm" 
                                data-bs-toggle="modal" 
                                data-bs-target="#deleteModal" 
                                id="deleteTableButton">Delete</button>
                    </td>
                </tr>
                `
        })
        tableBody.innerHTML = result
    }

    drawTableRows(allUsers)

    // fetchService.findAllUsers()
    //     .then(response => response.json())
    //     .then(users => drawTableRows(users))


    const on = (element, event, selector, handler) => {
        console.log(element)
        element.addEventListener(event, e => {
            if (e.target.closest(selector)) {
                handler(e)
            }
        })
    }

    on(document, 'click', '#deleteTableButton', e => {
        const row = e.target.parentNode.parentNode
        const id = e.target.getAttribute('data-id')
        console.log(id)

        // fetchService.deleteUser(id)
        //     .then(response => response.json())
        //     .then(() => tableBody.removeChild(row))

        // TODO доделать окно удаления, вставить туда значения, вообще доделать удаление
    })


    // Edit function
    let idForm = 0
    on(document, 'click', '#editTableButton',  async e => {
        const editButton = e.target
        const row = editButton.parentNode.parentNode
        idForm = editButton.getAttribute('data-id')

        // const user = await (await fetchService.findOneUserById(idForm)).json()

        const firstNameForm = row.children[1].innerHTML
        const emailForm = row.children[2].innerHTML
        // const passwordForm = row.children[3].innerHTML
        // const rolesForm = row.children[4].innerHTML

        editID.value = idForm
        editFirstName.value = firstNameForm
        editEmail.value = emailForm
        editPassword.value = ''

        // allRoles.forEach(role => {
        //     user.roles.forEach(userRole => {
        //         modal.find('#editRoles').append(new Option(role.name.replace('ROLE_', ''), role.id,
        //             false, role.id == userRole.id ? true : false)).prop('required', true)
        //     })
        // })

        allRoles.forEach(role => {
            document.querySelector('#editRoles').append(new Option(role.name.replace('ROLE_', ''), role.id, false,
                role.id == 2 ? true : false))
        })

        let action = editButton.getAttribute('data-action')

        editModal.show()
    })

    editForm.addEventListener('submit', e => {
        e.preventDefault()
        if (action === 'edit') {
            console.log('EDIT ACTION')
        } else if (action === 'delete') {
            console.log('DELETE ACTION')
        }

        editModal.hide()
    })
})