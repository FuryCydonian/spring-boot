
console.log('HELLO FROM SPANISH JS TEST')

// const fetchService = {
//     head: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//         'Referer': null
//     },
//     findAllUsers: async () => await fetch('api/users'),
//     findOneUserById: async (id) => await fetch(`api/users/${id}`),
//     addNewUser: async (user) => await fetch('api/users', {
//         method: 'POST',
//         headers: fetchService.head,
//         body: JSON.stringify(user)
//     }),
//     updateUser: async (user, id) => await fetch(`api/users/${id}`, {
//         method: 'PUT',
//         headers: fetchService.head,
//         body: JSON.stringify(user)
//     }),
//     deleteUser: async (id) => await fetch(`api/users/${id}`, {
//         method: 'DELETE',
//         headers: fetchService.head
//     }),
//     findAllRoles: async () => await fetch('api/roles'),
// }

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

const mainUrl = 'http://localhost:8080/api/users'
const rolesUrl = 'http://localhost:8080/api/roles'
const headers = { 'Content-Type': 'application/json' }

const tableBody = document.querySelector('tbody')
let result = ''
let action = ''

let allUsers = fetch(mainUrl).then(res => res.json()).then(data => data)
let allRoles = await (await fetch(rolesUrl)).json()

//========== EDIT DECLARATION VARS
const editForm = document.getElementById('formEdit')

const editID = document.getElementById('editID')
const editFirstName = document.getElementById('editFirstName')
const editEmail = document.getElementById('editEmail')
const editPassword = document.getElementById('editPassword')
const editRoles = document.getElementById('editRoles')

let editTableButton = document.getElementById('editTableButton')

// let tempButton = document.getElementById('tempButton')

// TODO переименовать здесь и в странице айдтшники элементов удаления
//========== DELETE DECLARATION VARS
const ID = document.getElementById('editID')
const firstName = document.getElementById('editFirstName')
const email = document.getElementById('editEmail')
const password = document.getElementById('editPassword')
const roles = document.getElementById('editRoles')

const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'))
const deleteForm = document.getElementById('formDelete')

let deleteTableButton = document.getElementById('deleteTableButton')

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
    tableBody.innerHTML = ''
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

const getUserList = () => {
    fetch(mainUrl)
        .then(response => response.json())
        .then(data => drawTableRows(data))
}

getUserList()

const editModal = new bootstrap.Modal(document.getElementById('editModal'))

const on = (element, event, selector, handler) => {
    console.log(element)
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e)
        }
    })
}

// ================== Delete button ====================================
on(document, 'click', '#deleteTableButton', e => {
    const deleteButton = e.target
    const row = deleteButton.parentNode.parentNode
    let deleteID = deleteButton.getAttribute('data-id')
    console.log(deleteID)

    fetch(`${mainUrl}/${deleteID}`)
        .then(response => response.json())
        .then(data => showDeleteModal(data))

    // TODO доделать окно удаления, вставить туда значения, вообще доделать удаление
})


// ====================  Edit button  ======================================
on(document, 'click', '#editTableButton',  async e => {
    const editButton = e.target
    const row = editButton.parentNode.parentNode
    let editID = editButton.getAttribute('data-id')
    console.log(editID)

    fetch(`${mainUrl}/${editID}`)
        .then(response => response.json())
        .then(data => showEditModal(data))
})

const showDeleteModal = user => {

}

const showEditModal = user => {

    editID.value = user.id
    editFirstName.value = user.firstName
    editEmail.value = user.email
    editPassword.value = ''

    editRoles.innerHTML = ''

    allRoles.forEach(role => {
        editRoles.append(new Option(role.name.replace('ROLE_', ''), role.id, false,
            role.id == 2))
    })


    const editButtonAccept = document.querySelector('#editButtonAccept')

    editModal.show()

    editButtonAccept.addEventListener('click', e => {
        e.preventDefault()

        let selectedOptions = editRoles.selectedOptions
        let selectedRoles = []
        for (let i = 0; i < selectedOptions.length; i++) {
            selectedRoles.push({id: selectedOptions[i].value, name: 'ROLE_' + selectedOptions[i].text})
        }

        // let prevPassword = user.password

        if (editEmail.value === '' || editPassword.value === '') {
            alert('It seems You forgot email or password')
            return
        }

        let data = {
            id: editID.value,
            firstName: editFirstName.value,
            email: editEmail.value,
            password: editPassword.value,
            roles: selectedRoles
        }
        fetch(`${mainUrl}/${editID.value}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(data)
        }).then(getUserList)

        editModal.hide()
        editPassword.value = ''
    })
}
