var passwordVisible        = false;
var previousVisibilityIcon = '<i class="fas fa-eye-slash"></i>';
var passwordInput          = $('#password');

function showPassword(passwordIcon) {
        passwordVisible        = !passwordVisible;
    let currentVisibilityIcon  = passwordIcon.innerHTML;
        passwordIcon.innerHTML = previousVisibilityIcon;
        previousVisibilityIcon = currentVisibilityIcon;
    passwordInput.attr('type', passwordVisible ? 'text' : 'password');
}