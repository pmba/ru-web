var meatSelectionArea = $('#meat');
var vegieSelectionArea = $('#vegie');

$(document).ready(() => {

    $(document).ready(function () {
        $('.rating').rating();
    });

    $('.single-select').selectpicker({
        noneSelectedText : 'Selecione o prato que você comeu' 
    });

    $('.multi-select').selectpicker({
        noneSelectedText : 'Selecione os pratos que você comeu' 
    });

    $('#dishType').change(() => {
        if ($('#dishType').val() == 'meat') {
            vegieSelectionArea.fadeOut('fast', () => {
                $('#vegieSelect').attr('disabled', 'disabled');
                $('#vegieRating').attr('disabled', 'disabled');
                meatSelectionArea.fadeIn('fast');
                $('#meatSelect').removeAttr('disabled');
                $('#meatRating').removeAttr('disabled');
            });
        } else {
            meatSelectionArea.fadeOut('fast', () => {
                $('#meatSelect').attr('disabled', 'disabled');
                $('#meatRating').attr('disabled', 'disabled');
                vegieSelectionArea.fadeIn('fast');
                $('#vegieSelect').removeAttr('disabled');
                $('#vegieRating').removeAttr('disabled');
            });
        }
    });
});
