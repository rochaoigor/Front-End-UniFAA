let email = document.getElementById('email');
let password = document.getElementById('passWord');
let errorMessage = document.querySelector('.errorMessage');
let btnEntry = document.getElementById('btn-entry');


    btnEntry.addEventListener('click', () => {

      // 1° Pegar o email digitado
      let userEmail = email.value;
  
      // 2° Pegar a senha digitada.
      let userSenha = password.value;
  
      // 3° Validar se o email e senha estão corretos
  
      if(!userEmail || !userSenha){
          // 4° Caso esteja incorreto, mandar mensagem de usuario ou senha invalida.
          Swal.fire({
              icon: 'error',
              text: 'Os campos de e-mail e senha são obrigatórios!'
          });
  
          // alert("Os campos de e-mail e senha são obrigatórios!");
          return;
      }
  
      // Aqui precisamos enviar esse email e senha ao backend para saber se o usuario pode acessar o sistema.
      autenticar(userEmail, userSenha);
  });
  
  
  function autenticar(email, senha){
     const urlBase = `http://localhost:3400`;
  
     fetch(`${urlBase}/login`, {
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, senha})
     })
      .then(response => {
  
         if(!!response.mensagem){
          alert(response.mensagem);
          return;
  
         }else{
  
          
          salvarToken(response.token);
          salvarUsuario(response.usuario);
          
          Swal.fire( {
            position: 'top-end',
            icon: 'success',
            title: 'Usuário Autenticado com sucesso!',
            showConfirmButton: false,
            timer: 2500
          })
          // Aqui vou esconder a tela de login e carregar o loading..
        
          setTimeout(() =>{
              window.open('cliente.html', '_self');
          }, 2500)
          
         }
      });
  }
  
  
 
  




// Capturando os 3 campos da tela.




// Aqui capturo o evento de click para tomar uma ação qualquer

    // 1° Pegar o email digitado
    // 2° Pegar a senha digitada.
    // 3° Validar se o email e senha estão corretos
    // 4° Caso esteja incorreto, mandar mensagem de usuario ou senha invalida.
    // 5° Caso esteja correto, ir para tela de cadastro de usuario


