const form =  document.getElementById('form-deposito');
const nomebenficiario  =  document.getElementById('nome-beneficiario');
let formEValido = false;

function ValidaNome(nomecompleto) {
   const nomecomoarray = nomecompleto.split(' ');
   return nomecomoarray.length >= 2;
}

form.addEventListener('Submit', function(e) {
    e.preventDefault();

    const numerocontabenficiario = document.getElementById('Número-conta');
    const Valor = document.getElementById('valor-deposito');
    const mensagemSucesso = (` montante de: <b>${Valor.value}</b> depositado para cliente: <b>${nomebenficiario.value}</b> - conta: <b>${numerocontabenficiario.value}</b>`);
    
    formEValido = ValidaNome(nomebenficiario.value)
    if (formEValido) {
        const containerMensagemSucesso = document.querySelector('.success-message');
        containerMensagemSucesso.innerHTML = mensagemSucesso;
        containerMensagemSucesso.style.display = 'block';

        nomebenficiario.value ='';
        numerocontabenficiario.value = '';
        Valor.value = '';
    } else {
        nomebenficiario.style.border = '1px solid red';
        document.querySelector('.error-message').style.display = 'block';
    }
})

nomebenficiario.addEventListener('keyup', function(e) {
    console.log(e.target.value);
    formEValido = ValidaNome(e.target.value);
    if (!formEValido) {
        nomebenficiario.classList.add('error');
        document.querySelector('.error-message').style.display = 'block';
    } else {
        nomebenficiario.classList.remove('error');
        document.querySelector('.error-message').style.display = 'none';
    }
});