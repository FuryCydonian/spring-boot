import * as service from 'static/js/fetchService';

$(function () {
    editUser(editUserID, editURL);
})

// let editModal = $('.edit-user-modal');
let editUserID = $('.editUserID').attr('value');
let editURL = `/admin/users/${editUserID}/edit`;
let formEdit = $('#formEdit' + editUserID);

service.findUserByID(editUserID)

function editUser(id, url) {
    formEdit.submit(async (e) => {
        e.preventDefault();
        let response = await fetch(url, {
            method: 'POST',
            body: new FormData(formEdit)
        });

        let result = await response.json();

        alert(result.message);
    });
}

// async function sendData(id) {
//
// }


// formEdit.onsubmit = async (e) => {
//     e.preventDefault();
//     let editURL = this.attr('action')
//
//     let response = await fetch(editURL, {
//         method: 'POST',
//         body: new FormData(formEdit)
//     });
//
//     let result = await response.json();
//
//     alert(result.message);
// };