const url = 'http://localhost:3400/clientes';
const listClient = document.querySelector('table>tbody');
let modalClient = new bootstrap.Modal(document.getElementById('modalCliente')) ;
let clientStorage = [];
let btnAdd = document.getElementById('btn-adicionar');
let modalTitle = document.querySelector('h4.modal-title');
let btnSave = document.getElementById('btn-salvar');
let btnCancel = document.getElementById('btn-cancelar');
let editMode = false;
let errorMessage = document.querySelector('.errorMessage')
let formModal = {
    id: document.getElementById('id'),
    telefone: document.getElementById('telefone'),
    cpf: document.getElementById('cpf'),
    email: document.getElementById('email'),
    nome: document.getElementById('nome'),
    dataCadastro:document.getElementById('dataCadastro')
}
btnAdd.addEventListener('click', () =>{
    editMode = false;
    modalTitle.textContent = 'Adicionar Cliente'
    cleanModal()
    modalClient.show()
})
btnSave.addEventListener('click', () => {
    let cliente = getModalClient();

    if(!cliente.email || !cliente.cpfOuCnpj) {
        return errorMessage.innerHTML = 'Os campos e-mail e cpf  não podem estar vazios';
    }
if(editMode) {
    attClientBackEnd(cliente);
}else {
    addClientBackEnd(cliente);
} 
})
btnCancel.addEventListener('click', () => {
    modalClient.hide();
})
function getModalClient() {
    return new Cliente ({
       id: formModal.id.value,
       cpfOuCnpj:formModal.cpf.value,
       email:formModal.email.value,
       nome:formModal.nome.value,
       telefone: formModal.telefone.value,
       dataCadastro:(formModal.dataCadastro.value) ? new Date(formModal.dataCadastro.value).toISOString() : new Date().toISOString()
    })  
}
function getClient() {
    fetch(url, {
        method:'GET',
        'Content-Type' : 'application/json',
        headers: {
            'Authorization': obterToken()
        }
    })
    .then(response => response.json())
    .then(clientes => {
        clientStorage = clientes;
        createTable(clientes)
    })
    .catch() 
}
function editEvent(id) {
    editMode = true;
    modalTitle.textContent = 'Editar Cliente';
    let cliente = clientStorage.find(cliente => cliente.id == id);
    attModal(cliente)
    modalClient.show()
    //alert(`Editar Cliente ` + '' + id);

}
function attModal(cliente) {
    formModal.id.value = cliente.id
    formModal.cpf.value = cliente.cpfOuCnpj
    formModal.nome.value = cliente.nome
    formModal.email.value = cliente.email
    formModal.telefone.value = cliente.telefone
    formModal.dataCadastro.value = cliente.dataCadastro.substring(0,10)
}
function cleanModal() {
    formModal.id.value ='';
    formModal.cpf.value = '';
    formModal.nome.value = '';
    formModal.email.value = '';
    formModal.telefone.value = '';
    formModal.dataCadastro.value = '';
}
function deleteEvent(id) {
    let cliente = clientStorage.find(c => c.id == id);
    if(confirm('Deseja realmente excluir esse cliente? ' +  cliente.nome)) {
       deleteClientBackEnd(cliente)
    }  
}
function createHTML(cliente)  {
    let tr = document.createElement('tr');
    let tdId = document.createElement('td');
    let tdName = document.createElement('td');
    let tdCpf = document.createElement('td');
    let tdEmail = document.createElement('td');
    let tdTelefone = document.createElement('td');
    let tdEvents = document.createElement('td');
    let tdDate = document.createElement('td');
    tdId.textContent = cliente.id;
    tdName.textContent = cliente.nome;
    tdCpf.textContent = cliente.cpfOuCnpj;
    tdEmail.textContent = cliente.email;
    tdDate.textContent = new Date(cliente.dataCadastro).toLocaleDateString();
    tdTelefone.textContent = cliente.telefone;
    tdEvents.innerHTML = `<i class='bi bi-pencil-fill m-2 sm-12'  onclick='editEvent(${cliente.id})'></i> <i class='bi bi-trash m-2 sm-12'  onclick='deleteEvent(${cliente.id})'></i>`
    tr.appendChild(tdId);
    tr.appendChild(tdName);
    tr.appendChild(tdCpf);
    tr.appendChild(tdEmail);
    tr.appendChild(tdTelefone);
    tr.appendChild(tdDate);
    tr.appendChild(tdEvents);

    listClient.appendChild(tr)
}
function createTable(clientes) {
    
    listClient.textContent= "";
    
    clientes.forEach(cliente => {
       createHTML(cliente)
    });
  
}
function addClientBackEnd(cliente) {
    cliente.dataCadastro = new Date().toISOString();

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': obterToken()
        },
        body: JSON.stringify(cliente)
    })
    .then(response => response.json())
    .then(response => {
        let clientApi = new Cliente(response)
        clientStorage.push(clientApi);
        createTable(clientStorage)
        modalClient.hide();
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Cliente adicionado com sucesso!',
            showConfirmButton: false,
            timer: 2500
        });
    }
    )    
    .catch(error => {
        console.log(error);
    })
}
function attClientBackEnd(cliente){
    fetch(`${url}/${cliente.id}`, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
            'Authorization': obterToken()
        },
        body: JSON.stringify(cliente)
    })
    .then(response => response.json())
    .then(() => {
        attTableClient(cliente,false)
        modalClient.hide();
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Cliente atualizado com sucesso!',
            showConfirmButton: false,
            timer: 2500
        });
    }
    )   
    .catch(error => {
        console.log(error);
    })
}
    function deleteClientBackEnd(cliente) {
        fetch(`${url}/${cliente.id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Authorization': obterToken()
            }
        })
        .then(response => response.json())
        .then(() => {
            attTableClient(cliente,true)
            modalClient.hide();
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Cliente excluído com sucesso!',
                showConfirmButton: false,
                timer: 2500
            });

        }
        )      
        .catch(error => {
            console.log(error);
        })
    }
  
function attTableClient(cliente, removeClient) {
    let find = clientStorage.findIndex((c) => c.id == cliente.id);
     (removeClient) ? clientStorage.splice(find, 1) : clientStorage.splice(1, find, cliente);

createTable(clientStorage);

  }

getClient()
