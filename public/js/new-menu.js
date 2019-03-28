var currentDay = 0;
var lunchCard = $('#lunchCard');
var dinnerCard = $('#dinnerCard');

var daysFakeSchema = [
    {}, {}, {}, {}, {}, {}, {}
];

$(document).ready(() => {
    $('select').selectpicker({
        noneSelectedText: 'Selecione'
    });

    var container, display, input, datepicker, dates;

    dates = [];
    container = $('#week-picker');
    input = $('#firstDate');
    display = container.find('.form-control');

    container.datepicker({
        language: "pt-BR",
        todayHighlight: true,
        weekStart: 0,
        beforeShowDay: function (date) {
            var i, j;
            for (i = 0, j = dates.length; i < j; i += 1) {
                if (dates[i].getTime() === date.getTime()) {
                    return {
                        classes: 'active'
                    };
                }
            }
        }
    });
    datepicker = container.data('datepicker');

    function setDates(date) {
        var diffToWeekStart, weekStart, i, nd;
        diffToWeekStart = datepicker.o.weekStart - date.getDay();
        if (diffToWeekStart > 0) {
            diffToWeekStart = diffToWeekStart - 7;
        }

        // Getting first day of the week
        weekStart = new Date(date.valueOf());
        weekStart.setDate(weekStart.getDate() + diffToWeekStart);
        input.val(weekStart.toISOString());

        // Saving week days
        dates = [];
        for (i = 0; i < 7; i += 1) {
            nd = new Date(weekStart.valueOf());
            nd.setDate(nd.getDate() + i);
            dates.push(nd);
        }
        datepicker.update();
    }

    function setDisplay() {
        $('#list-tab').removeClass('disabled-div');
        $('#nav-tabContent').removeClass('disabled-div');

        for (let i = 0; i < 7; ++i) {
            daysFakeSchema[i].date = dates[i];
            let currentDate = dates[i];
            $(`#dayDate${i}`).html(`${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`);
        }
    }

    container.on('changeDate', function () {
        setDates(datepicker.getDate());
        setDisplay();
    });

    // Propagate display click to bootstrap group-addon
    display.on('click', function () {
        container.find('.input-group-addon').trigger('click');
    });
});

function selectDay(day) {
    currentDay = day;
    $('#saveDailyBtn').attr('day', currentDay);

    console.log($('#saveDailyBtn').attr('day'));
}

function showCard(card) {
    if (card == 0) {
        dinnerCard.fadeOut("fast", () => {
            lunchCard.fadeIn("fast");
        });
    } else {
        lunchCard.fadeOut("fast", () => {
            dinnerCard.fadeIn("fast");
        });
    }
}