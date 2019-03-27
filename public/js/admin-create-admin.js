var passwordVisible = false;
var previousVisibilityIcon = '<i class="fas fa-eye-slash"></i>';
var passwordInput = $('#password');

function showPassword(passwordIcon) {
    passwordVisible = !passwordVisible;
    let currentVisibilityIcon = passwordIcon.innerHTML;
    passwordIcon.innerHTML = previousVisibilityIcon;
    previousVisibilityIcon = currentVisibilityIcon;
    passwordInput.attr('type', passwordVisible ? 'text' : 'password');
}

var passwordControl = $('#passwordChangeControl');

passwordControl.on('click', () => {
    if (passwordControl.is(':checked')) {
        passwordControl.val(true);

        $('#passwordConfirmation').val('');
        $('#password').val('');
        $('#passwordDiv').removeClass('disabled-div');
        $('#passwordConfirmationDiv').removeClass('disabled-div');
    } else {
        passwordControl.val(false);

        $('#passwordConfirmation').val('Boa Tentativa');
        $('#password').val('Boa Tentativa');
        $('#passwordDiv').addClass('disabled-div');
        $('#passwordConfirmationDiv').addClass('disabled-div');
    }
});