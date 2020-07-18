const express = require('express');
const router = express.Router();

// RETORNA TODOS OS PRODUTOS
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Retorna todos os produtos'
    });
});

// INSERE UM PRODUTO
router.post('/', (req, res, next) => {
    const produto = {
        nome: req.body.nome,
        preco: req.body.preco
    }  

    res.status(201).send({
        mensagem: 'O produto foi criado',
        produtoCriado: produto
    });    
});

// RETORNA OS DADOS DE UM PRODUTO 
router.get('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto;
    var msg;

    if (id === 'especial') {
        msg = 'Você descobriu o produto especial';
    } else {
        msg = 'Retorna os dados de um produto';
    }

    res.status(200).send({
        mensagem: msg,
        id: id
    });    

});

// ALTERA UM PRODUTO
router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Produto alterado'
    });    
});

// EXCLUI UM PRODUTO
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Produto excluído'
    }); 
});

module.exports = router;