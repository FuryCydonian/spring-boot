
let formEdit = $('#formEdit');


formEdit.submit((e) => {
    e.preventDefault();
    let th = $(this);
    let editURL = th.attr('href');

    fetch()
})
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