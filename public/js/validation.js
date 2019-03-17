var statusHolder = $('#status');
var idle = $('#idle');
var userInfo = $('#userInfo');
var userName = $('#userName');
var userRegistration = $('#userRegistration');
var ticketValue = $('#value');
var invalidUser = $('#invalidUser');
var displayingUser = false;

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

statusHolder.on('click', () => {
    hideValidTicket();
});

function hideValidTicket() {
    if (displayingUser) {
        userInfo.hide();
        userName.html('');
        ticketValue.html('');
        userRegistration.html('');
        statusHolder.removeClass('bg-success').addClass('bg-primary');
        idle.show();
    }
}

function displayValidTicket(user) {
    idle.hide();
    userName.html(user.name);
    userRegistration.html(user.registration);
    ticketValue.html(user.value.toFixed(2));
    userInfo.show();
    statusHolder.removeClass('bg-primary').addClass('bg-success');
    displayingUser = true;
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
        displayValidTicket(res);
    }).fail((err) => {
        invalidTicket();
    });
}