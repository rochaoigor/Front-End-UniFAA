const Produto = require('../model/Produto');
var idAtual = 2;

var listaDeProdutos = [
    new Produto({
        id:1,
        codigoProduto:"7892454785",
        nome:"Coca-Cola",
        quantidadeEstoque: 10,
        valor: 8.95,
        dataCadastro: new Date().toISOString(),
        dataValidade: "5/2023",
        observacao: "Produto original"
    }),
    new Produto({
        id:2,
        nome:"Massa Tomate Sache Fugini",
        codigoProduto:"7892454785",
        quantidadeEstoque: 50,
        valor: 1.99,
        dataValidade: '4/2023',
        dataCadastro: new Date().toISOString(),
        observacao: "Produto original"
    })
];

function obterTodos(){
    return listaDeProdutos;
}

function obterPorId(id){
    return listaDeProdutos.find(p => p.id == id);
}

function cadastrar(obj){
    var produto = new Produto(obj);
    idAtual++;
    produto.id = idAtual;
    listaDeProdutos.push(produto);

    return produto;
}

function atualizar(produto){
    var indice = listaDeProdutos.findIndex(p => p.id == produto.id);
    
    if(indice < 0){
        return;
    }

    listaDeProdutos.splice(indice, 1, produto);
    return produto;
}

function deletar(id){
    var indice = listaDeProdutos.findIndex(p => p.id == id);
    if(indice < 0){
        return;
    }

    // Deleta de dentro do array a posicição especifica
    listaDeProdutos.splice(indice, 1);
}


module.exports = {
    obterTodos,
    obterPorId,
    cadastrar,
    atualizar,
    deletar
}