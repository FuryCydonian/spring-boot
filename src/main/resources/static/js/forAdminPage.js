// import * as service from './static/js/fetchService';

$(document).ready(function () {

    console.log('HELLO FROM JS FILE!!!!!!!!!!!!!!!!!!!!!')

    $('#eBtn').on('click', function (e) {
        e.preventDefault();

        $('#edit-user-modal').modal();
    });
});



// let editModal = $('.edit-user-modal');
// let editUserID = $('.editUserID').attr('value');
// let editURL = `/admin/users/${editUserID}/edit`;
// let formEdit = $('#formEdit' + editUserID);

// service.findUserByID(editUserID)

// function editUser(id, url) {
//     formEdit.submit(async (e) => {
//         e.preventDefault();
//         let response = await fetch(url, {
//             method: 'POST',
//             body: new FormData(formEdit)
//         });
//
//         let result = await response.json();
//
//         alert(result.message);
//     });
// }

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