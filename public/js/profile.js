$(document).ready(() => {
    $('select').selectpicker({
        noneSelectedText : 'Adicione ou remova intolerâncias' 
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