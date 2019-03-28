var currentDay = 1;
var lunchCard = $('#lunchCard');
var dinnerCard = $('#dinnerCard');

var daysFakeSchema = [];
var daysStatus = [0, 0, 0, 0, 0, 0, 0];

$(document).ready(() => {
    $('select').selectpicker({
        noneSelectedText: 'Selecione'
    });

    for (let i = 0; i < 7; ++i) {
        daysFakeSchema.push({
        lunch: {
            meat: [],
            vegetarian: [],
            sideDish: [],
            dessert: [],
            drinks: []
        },
        dinner: {
            meat: [],
            vegetarian: [],
            sideDish: [],
            dessert: [],
            drinks: []
        }});
    }

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

    let lunchMeat = $('#lunchMeat');
    let lunchVegetarian = $('#lunchVegetarian');
    let lunchSideDish = $('#lunchSideDish');
    let lunchDessert = $('#lunchDessert');
    let lunchDrink = $('#lunchDrink');

    let dinnerMeat = $('#dinnerMeat');
    let dinnerVegetarian = $('#dinnerVegetarian');
    let dinnerSideDish = $('#dinnerSideDish');
    let dinnerDessert = $('#dinnerDessert');
    let dinnerDrink = $('#dinnerDrink');

    lunchMeat.val(daysFakeSchema[currentDay].lunch.meat);
    lunchVegetarian.val(daysFakeSchema[currentDay].lunch.vegetarian);
    lunchSideDish.val(daysFakeSchema[currentDay].lunch.sideDish);
    lunchDessert.val(daysFakeSchema[currentDay].lunch.dessert);
    lunchDrink.val(daysFakeSchema[currentDay].lunch.drinks);

    dinnerMeat.val(daysFakeSchema[currentDay].dinner.meat);
    dinnerVegetarian.val(daysFakeSchema[currentDay].dinner.vegetarian);
    dinnerSideDish.val(daysFakeSchema[currentDay].dinner.sideDish);
    dinnerDessert.val(daysFakeSchema[currentDay].dinner.dessert);
    dinnerDrink.val(daysFakeSchema[currentDay].dinner.drinks);

    $('select').selectpicker('refresh');
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

function saveDaily() {

    let lunchMeat = $('#lunchMeat');
    let lunchVegetarian = $('#lunchVegetarian');
    let lunchSideDish = $('#lunchSideDish');
    let lunchDessert = $('#lunchDessert');
    let lunchDrink = $('#lunchDrink');

    let dinnerMeat = $('#dinnerMeat');
    let dinnerVegetarian = $('#dinnerVegetarian');
    let dinnerSideDish = $('#dinnerSideDish');
    let dinnerDessert = $('#dinnerDessert');
    let dinnerDrink = $('#dinnerDrink');

    daysFakeSchema[currentDay].lunch = {};
    daysFakeSchema[currentDay].lunch.meat = lunchMeat.val();
    daysFakeSchema[currentDay].lunch.vegetarian = lunchVegetarian.val();
    daysFakeSchema[currentDay].lunch.sideDish = lunchSideDish.val();
    daysFakeSchema[currentDay].lunch.dessert = lunchDessert.val();
    daysFakeSchema[currentDay].lunch.drinks = lunchDrink.val();

    daysFakeSchema[currentDay].dinner = {};
    daysFakeSchema[currentDay].dinner.meat = dinnerMeat.val();
    daysFakeSchema[currentDay].dinner.vegetarian = dinnerVegetarian.val();
    daysFakeSchema[currentDay].dinner.sideDish = dinnerSideDish.val();
    daysFakeSchema[currentDay].dinner.dessert = dinnerDessert.val();
    daysFakeSchema[currentDay].dinner.drinks = dinnerDrink.val();

    daysStatus[currentDay] = 1;

    $(`#dayStatus${currentDay}`).html('<i class="fas fa-check"></i>');
}

function saveAllMenu() {
    let notConfirmedDays = [];
    let dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    for (let i = 0; i < 7; ++i) {
        if (daysStatus[i] == 0) {
            notConfirmedDays.push(dayNames[i]);
        }
    }

    if (notConfirmedDays.length <= 0) {
        $('#saveAllMenuModalBody').html('Todos os dias da semana foram confirmados.')
    } else {
        $('#saveAllMenuModalBody').html(`${notConfirmedDays} ${notConfirmedDays.length == 1 ? '<br>Não foi confirmado.' : '<br>Não foram confirmados.'}`);
    }

    $('#saveAllMenuModal').modal('show');
}

function submitAllMenu() {
    $.ajax({
        url: '/admin/menu/new',
        type: 'POST',
        data: {
            days: daysFakeSchema
        }
    }).done((res) => {
        console.log(res);
    }).fail((err) => {
        console.log(err);
    });
}