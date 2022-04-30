$(async function() {
    console.log('test.js file')
    await getTableWithUsers()
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

const getTableWithUsers = async() => {
    let table = $('#mainTableWithUsers tbody')
    table.empty()

    let usersJson = (await userFetchService.findAllUsers()).json()
    usersJson.then(users => {
        console.log(users)
        users.forEach(user => {
            let userRoles = ``
            for(let role of user.roles) {
                userRoles += role.name.replace('ROLE_', '') + ' '
            }
            let tableRow = `$(
                <tr>
                    <td>${user.id}</td>
                    <td>${user.firstName}</td>
                    <td>${user.email}</td>
                    <td>${userRoles.slice(0, -1)}</td>
                    <td>
                        <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-info btn-sm" 
                                data-toggle="modal" data-target="#someDefaultModal">Edit</button>
                    </td>
                    <td>
                        <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-danger btn-sm" 
                                data-toggle="modal" data-target="#someDefaultModal">Delete</button>
                    </td>
                </tr>
            )`
            table.append(tableRow)
        })
    })

    // обрабатываем нажатие на любую из кнопок edit или delete
    // достаем из нее данные и отдаем модалке, которую к тому же открываем
    $("#mainTableWithUsers").find('button').on('click', (event) => {
        let defaultModal = $('#someDefaultModal');

        let targetButton = $(event.target);
        alert(targetButton)

        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })

}

