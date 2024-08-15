$(document).ready(function() {
    // Função para adicionar uma nova tarefa
    $('#taskForm').submit(function(event) {
        event.preventDefault(); // Impede o envio do formulário padrão
        
        // Obtém o valor do campo de entrada
        const task = $('#taskInput').val();
        
        // Adiciona a tarefa à lista
        if (task) {
            $('#taskList').append('<li>' + task + '</li>');
            $('#taskInput').val(''); // Limpa o campo de entrada
        }
    });

    // Função para marcar a tarefa como concluída ao clicar
    $('#taskList').on('click', 'li', function() {
        $(this).toggleClass('completed');
    });
});