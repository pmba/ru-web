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

function proceedToDeleteIntolerance(intoleranceID) {
    $('#confirmDeleteForm').attr('action', `/admin/intolerances/delete/${intoleranceID}?_method=DELETE`);
    $('#deleConfirmationModal').modal('show');
}

function proceedToDeleteAdmin(adminID) {
    $('#confirmDeleteForm').attr('action', `/admin/admins/delete/${adminID}?_method=DELETE`);
    $('#deleConfirmationModal').modal('show');
}

function proceedToDeleteDish(dishID) {
    $('#confirmDeleteForm').attr('action', `/admin/dishes/delete/${dishID}?_method=DELETE`);
    $('#deleConfirmationModal').modal('show');
}


