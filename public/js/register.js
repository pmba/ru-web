$(document).ready(() => {

});

$('#register').submit((e) => {
    $('#loading-anim').removeClass('d-none');
    $('#loading-anim').addClass('d-flex');
    
    $.ajax({
        type: "POST",
        url: "",
        data: {
            username: $('#username').val(),
            password: $('#password').val()
        }
    })
    .done((res) => {
        alert('Usuário Existe!');
    })
    .fail((err) => {
        alert('Login ou Senha incorretos!');
    })
    .always(() => {
        $('#loading-anim').removeClass('d-flex');
        $('#loading-anim').addClass('d-none');
    });

    e.preventDefault();
});