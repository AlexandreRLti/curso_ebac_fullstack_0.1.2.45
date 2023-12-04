const form =  document.getElementById('form-deposiito');

function ValidaNome(nomecompleto) {
   const nomecomoarray = nomecompleto.split(' ');
   return nomecomoarray.length >= 2;
}

form.addEventListener ('submit' , function ca(e) {
    let formEValido = false;
    e.preventDefault();

    const nomebenficiario = document.getElementById('nome-benficiario');
    const numerocontabenficiario = document.getElementById('Número-conta');
    const Valor = document.getElementById('valor-deposito');
    const mensagemSucesso = (` montante de: ${valor.value} depositado para cliente: ${nomebenficiario.value} - conta: ${numerocontabenficiario.value}`);
    
    formEValido = ValidaNome(nomebenficiario.value)
    if (formEValido) {
        alert("mensagemSucesso");

        nomebenficiario.value ='';
        numerocontabenficiario.value = '';
        valor.value = '';

    } else {
        alert("o nome não está completo");
    }
})


console.log(form);
