$(document).ready(() => {
    $('#intolerancesSelect').selectpicker({
        noneSelectedText : 'Adicione ou remova intolerâncias' 
    });

    $('#buyTicketSelect').selectpicker({
        noneSelectedText : 'Selecione o valor da ficha' 
    });

    $('#intolerancesSelect').change(() => {
        $('#submitIntoleranceBtn').prop('disabled', false);
    });
});

function showQrCode(id) {
    $('#qrCodeHolder').html('');

    new QRCode(document.getElementById('qrCodeHolder'), {
        text: id,
        correctLevel: QRCode.CorrectLevel.H
    });

    $('#qrCodeTicket').modal('toggle');
}

