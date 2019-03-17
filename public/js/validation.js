let scanner = new Instascan.Scanner({
    video: document.getElementById('preview'),
    mirror: false
});

scanner.addListener('scan', (content) => {
    checkForTicketValidation(content);
});

Instascan.Camera.getCameras().then(cameras => {
    if (cameras.length > 0) {
        scanner.start(cameras[0]);
    } else {
        alert("Não existe camera no dispositivo");
    }
});

var statusHolder = $('#status');
var idle = $('#idle');
var userInfo = $('#userInfo');
var userName = $('#userName');
var userRegistration = $('#userRegistration');
var invalidUser = $('#invalidUser')

function validTicket(user) {
    idle.hide();
    userName.html(user.name);
    userRegistration.html(user.registration);
    userInfo.show();
    statusHolder.removeClass('bg-primary').addClass('bg-success');
    setTimeout(() => {
        userInfo.hide();
        userName.html('');
        userRegistration.html('');
        idle.show();
        statusHolder.removeClass('bg-success').addClass('bg-primary');
    }, 2000);
}

function invalidTicket() {
    idle.hide();
    invalidUser.show();
    statusHolder.removeClass('bg-primary').addClass('bg-danger');
    setTimeout(() => {
        invalidUser.hide();
        idle.show();
        statusHolder.removeClass('bg-danger').addClass('bg-primary');
    }, 2000);
}

function checkForTicketValidation(id) {
    $.ajax({
        url: '/admin/validation',
        type: 'POST',
        data: {
            id: id
        }
    }).done((res) => {
        validTicket(res);
    }).fail((err) => {
        invalidTicket();
    });
}
