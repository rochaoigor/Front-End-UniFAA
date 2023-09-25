const url = 'http://localhost:3400/produtos'
const listProduto = document.querySelector('table>tbody');
let modalProduto =new bootstrap.Modal(document.getElementById('modalProduto')) ;
let produtoStorage = [];
let btnAdd = document.getElementById('btn-adicionar');
let modalTitle = document.querySelector('h4.modal-title')
let btnSave = document.getElementById('btn-salvar')
let btnCancel = document.getElementById('btn-cancelar');
let editMode = false;
let errorMessage = document.querySelector('.errorMessage')



let formModal = {
    id: document.getElementById('id'),
    nome: document.getElementById('nome'),
    codigoProduto:document.getElementById('codigo'),
    quantidadeEstoque: document.getElementById('quantidadeEstoque'),
    valor: document.getElementById('valor'),
    dataCadastro: document.getElementById('dataCadastro'),
    dataValidade: document.getElementById('dataValidade'),
}

btnAdd.addEventListener('click', () =>{
    editMode = false;
    modalTitle.textContent = 'Adicionar Produto'
    cleanModal()
    modalProduto.show()
})

btnSave.addEventListener('click', () => {
    let produto = getModalProduto();

    if(!produto.codigoProduto || !produto.nome ) {
        return errorMessage.innerHTML = 'Preencha todos os campos'
    }if(!produto.valor || !produto.quantidadeEstoque) {
        return errorMessage.innerHTML = 'Preencha todos os campos'
    }
    

if(editMode) {
    attProdutoBackEnd(produto);
}else {
    addProdutoBackEnd(produto);
}

    
   
})

btnCancel.addEventListener('click', () => {
    modalProduto.hide();
})

function getModalProduto() {
    return new Produto({
       id: formModal.id.value,
       nome:formModal.nome.value,
       valor:formModal.valor.value,
       dataValidade: formModal.dataValidade.value,
       quantidadeEstoque: formModal.quantidadeEstoque.value,
       codigoProduto: formModal.codigoProduto.value,
       dataCadastro:(formModal.dataCadastro.value) ? new Date(formModal.dataCadastro.value).toISOString() : new Date().toISOString()
    })

}

function getProduto() {
    fetch(url, {
        method:'GET',
        headers: {
            'Authorization' : obterToken()
        }

    })
    .then(response => response.json())
    .then(produtos => {
        
        produtoStorage = produtos;
        createTable(produtos)
    })
    .catch()
}

function editEvent(id) {
    editMode = true;
    modalTitle.textContent = 'Editar Produto';
    let produto = produtoStorage.find(produto => produto.id == id);

    attModal(produto)
    modalProduto.show()
    

}

function attModal(produto) {
    formModal.id.value = produto.id
    formModal.codigoProduto.value = produto.codigoProduto
    formModal.nome.value = produto.nome
    formModal.valor.value = produto.valor
    formModal.quantidadeEstoque.value = produto.quantidadeEstoque
    formModal.dataValidade.value = produto.dataValidade;
    formModal.dataCadastro.value = produto.dataCadastro.substring(0,10)
}

function cleanModal() {
    formModal.id.value = ''
    formModal.codigoProduto.value = ''
    formModal.nome.value =''
    formModal.valor.value = ''
    formModal.quantidadeEstoque.value  =''
    formModal.dataValidade.value =''
    formModal.dataCadastro.value = ''
}


function deleteEvent(id) {

    let produto = produtoStorage.find(p => p.id == id);
    if(confirm('Deseja realmente excluir esse produto? ' +  produto.nome)) {
       deleteProdutoBackEnd(produto)
    }
    
}
function createHTML(produto)  {
    let tr = document.createElement('tr');
    let tdId = document.createElement('td');
    let tdName = document.createElement('td');
    let tdDataCadastro = document.createElement('td');
    let tdValidade = document.createElement('td');
    let tdEstoque = document.createElement('td');
    let tdCodigo = document.createElement('td');
    let tdEvents = document.createElement('td');
    let tdValor = document.createElement('td');

    tdId.textContent = produto.id;
    tdName.textContent = produto.nome;
    tdValor.textContent = produto.valor;
    tdEstoque.textContent = produto.quantidadeEstoque;
    
    tdValidade.textContent = produto.dataValidade;
    tdDataCadastro.textContent = new Date(produto.dataCadastro).toLocaleDateString();
   
 
    tdCodigo.textContent = produto.codigoProduto;
   
  
    

    tdEvents.innerHTML = `<i class='bi bi-pencil-fill m-2 sm-12'  onclick='editEvent(${produto.id})'></i> <i class='bi bi-trash m-2 sm-12'  onclick='deleteEvent(${produto.id})'></i>`

    tr.appendChild(tdId);
    tr.appendChild(tdCodigo);
    tr.appendChild(tdName);
    tr.appendChild(tdValor);
    tr.appendChild(tdEstoque)
    tr.appendChild(tdDataCadastro);
  
    tr.appendChild(tdValidade);
    tr.appendChild(tdEvents);

    listProduto.appendChild(tr)
}

function createTable(listProduct) {
    listProduto.textContent= "";
    
    listProduct.forEach(produto => {
       createHTML(produto)
    });
  
}


function addProdutoBackEnd(produto) {

    produto.dataCadastro = new Date().toISOString();

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': obterToken()
        },
        body: JSON.stringify(produto)
    })
    .then(response => response.json())
    .then(response => {
        let produtoApi = new Produto(response)
        produtoStorage.push(produtoApi);
        createTable(produtoStorage)
        modalProduto.hide();

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Produto cadastrado com sucesso!',
            showConfirmButton: false,
            timer: 2500
        });
    }
    )
       
    
    .catch(error => {
        console.log(error);
    })
}

function attProdutoBackEnd(produto){
    fetch(`${url}/${produto.id}`, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
            'Authorization': obterToken()
        },
        body: JSON.stringify(produto)
    })
    .then(response => response.json())
    .then(() => {
        attTableProduto(produto,false)
        modalProduto.hide();
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Produto atualizado com sucesso!',
            showConfirmButton: false,
            timer: 2500
        });
    }
    )
    
    .catch(error => {
        console.log(error);
    })
}


    function deleteProdutoBackEnd(produto) {
        fetch(`${url}/${produto.id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Authorization': obterToken()
            }
        })
        
        .then(() => {
            attTableProduto(produto,true)
            modalProduto.hide();

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Produto excluído com sucesso!',
                showConfirmButton: false,
                timer: 2500
            });

        }
        )
        
        
        
        .catch(error => {
            console.log(error);
        })
    }

    
function attTableProduto(produto, removeProduto) {
    let find = produtoStorage.findIndex((p) => p.id == produto.id);
     (removeProduto) ? produtoStorage.splice(find, 1) : produtoStorage.splice(1, find, produto);

createTable(produtoStorage);

  }



getProduto()
