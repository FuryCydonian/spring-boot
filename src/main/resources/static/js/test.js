$(document).ready(function (){

    console.log('!!!!!!!!!!!!!!!!!!!!!!!');
    $('#eBtn').click(function(e) {
        e.preventDefault();
        var href = $(this).attr('href');

        $.get(href, function(user, status) {
            $('.myForm #editId').val(user.id);
            $('.myForm #editFirstName').val(user.firstName);
            $('.myForm #editEmail').val(user.email);
            $('.myForm #editPassword').val(user.password);
            $('.myForm #editRoles').val(user.roles);

        });

        concole.log
        // $('#editUserModal').modal('show');

    });

});