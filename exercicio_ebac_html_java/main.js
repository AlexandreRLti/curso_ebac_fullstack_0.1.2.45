const form =  document.getElementById("form-deposiito");

function ValidaNome(nomecompleto) {
   const nomecomoarray = nomecompleto.split(' ');
   return nomecomoarray.length >= 2;
}

form.addEventListener('submit' , function (e) {
    e.preventDefault();

    const nomebenficiario = document.getElementById('nome-benficiario');
    if (ValidaNome(nomebenficiario.value) === false) {
    alert("o nome não está completo");
    } else {
        alert("tudo certo");
    }
})


console.log(form);
