var menuOpened = false;

$('#toggleMenuBtn').on('click', () => {
    if (!menuOpened) {
        $('#navOptions').css('height', '100%');
        $('.btn-menu').css({'transform' : 'scaleY(-1)'});
        menuOpened = !menuOpened;
    } else {
        $('#navOptions').css('height', '0');
        $('.btn-menu').css({'transform' : 'scaleY(1)'});
        menuOpened = !menuOpened;
    }
});

$('[data-toggle="popover"]').popover();