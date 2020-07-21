const mysql = require('../mysql');

exports.getPedidos = async (req, res, next) => {
    try {
        const query = `SELECT pedidos.id_pedido, produtos.id_produto, produtos.nome, produtos.preco, pedidos.quantidade 
                        FROM pedidos JOIN produtos 
                        ON pedidos.id_produto = produtos.id_produto;`;
        const result = await mysql.execute(query);
        const response = {
            quantidade: result.length,
            pedidos: result.map(r => {
                return {
                    id_pedido: r.id_pedido,
                    quantidade: r.quantidade,
                    produto: {
                        id_produto: r.id_produto,
                        nome: r.id_produto,
                        preco: r.preco
                    },
                    url_detalhes: process.env.URL_PEDIDOS + r.id_pedido,
                }
            }),
            request: {
                tipo: 'GET',
                descricao: 'Retorna todos os pedidos'
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error })
    }
};

exports.postPedidos = async (req, res, next) => {
    try {
        var query = `SELECT * FROM produtos WHERE id_produto = ?`;
        var result = await mysql.execute(query, [req.body.id_produto]);
        if (result.length == 0) { return res.status(404).send({ mensagem: 'Produto não encontrado' }) }
        query = `INSERT INTO pedidos (id_produto, quantidade) VALUES (?, ?)`;
        result = await mysql.execute(query, [req.body.id_produto, req.body.quantidade]);
        const response = {
            mensagem: 'Pedido inserido com sucesso',
            pedidoCriado: {
                id_pedido: result.id_pedido,
                id_produto: req.body.id_produto,
                quantidade: req.body.quantidade
            },
            request: {
                tipo: 'POST',
                descricao: 'Insere um pedido',
            }
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ error: error })
    }
};

exports.getUmPedido = async (req, res, next) => {
    try {
        const query = `SELECT * FROM pedidos WHERE id_pedido = ?;`;
        const result = await mysql.execute(query, [req.params.id_pedido]);
        if (result.length == 0) { return res.status(404).send({ mensagem: 'Pedido não encontrado' }) }
        const response = {
            pedido: {
                id_pedido: result[0].id_pedido,
                id_produto: result[0].id_produto,
                quantidade: result[0].quantidade
            },
            request: {
                tipo: 'GET',
                descricao: 'Retorna um pedido'
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error })
    }
};

exports.deletePedido = async (req, res, next) => {
    try {
        const query = `DELETE FROM pedidos WHERE id_pedido = ?;`;
        await mysql.execute(query, [req.body.id_pedido]);
        const response = {
            mensagem: 'Pedido removido com sucesso',
            request: {
                tipo: 'DELETE',
                descricao: 'Remove um pedido'
            }
        }
        return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error })
    }
};
