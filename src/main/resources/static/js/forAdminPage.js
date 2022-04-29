
$("#tableWithUsers").find('button').on('click', (event) => {
    let targetButton = $(event.target);
    let buttonUserId = targetButton.attr('data-id');
    let buttonAction = targetButton.attr('data-action');

    let editUserModal = $(`#edit-user${buttonUserId}`);

    console.log(buttonUserId)
    console.log(targetButton)
    console.log(editUserModal)
    console.log(`#edit-user${buttonUserId}`)

    editUserModal.attr('data-userid', buttonUserId);
    editUserModal.attr('data-action', buttonAction);
    // editUserModal.modal.show();
})