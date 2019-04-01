var menuOpened = false;

$(document).ready(function () {
    $('.table').DataTable({
        "language": {
            "sEmptyTable": "Nenhum registro encontrado",
            "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
            "sInfoFiltered": "(Filtrados de _MAX_ registros)",
            "sInfoPostFix": "",
            "sInfoThousands": ".",
            "sLengthMenu": "_MENU_ resultados por página",
            "sLoadingRecords": "Carregando...",
            "sProcessing": "Processando...",
            "sZeroRecords": "Nenhum registro encontrado",
            "sSearch": "Pesquisar",
            "oPaginate": {
                "sNext": "Próximo",
                "sPrevious": "Anterior",
                "sFirst": "Primeiro",
                "sLast": "Último"
            },
            "oAria": {
                "sSortAscending": ": Ordenar colunas de forma ascendente",
                "sSortDescending": ": Ordenar colunas de forma descendente"
            }
        }
    });
});

$('#toggleMenuBtn').on('click', () => {
    if (!menuOpened) {
        $('#navOptions').css('height', '100%');
        $('.btn-menu').css({
            'transform': 'scaleY(-1)'
        });
        menuOpened = !menuOpened;
    } else {
        $('#navOptions').css('height', '0');
        $('.btn-menu').css({
            'transform': 'scaleY(1)'
        });
        menuOpened = !menuOpened;
    }
});

function proceedToDelete(deleteURL) {
    $('#confirmDeleteForm').attr('action', `${deleteURL}?_method=DELETE`);
    $('#deleConfirmationModal').modal('show');
}

