$(document).ready(() => {
    $('select').selectpicker({
        noneSelectedText : 'Adicione ou remova intolerâncias' 
    });

    $('#intolerancesSelect').change(() => {
        $('#submitIntoleranceBtn').prop('disabled', false);
    });
});