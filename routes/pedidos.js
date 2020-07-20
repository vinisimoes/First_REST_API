const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// RETORNA TODOS OS PEDIDOS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `SELECT pedidos.id_pedido, produtos.id_produto, produtos.nome, produtos.preco, pedidos.quantidade 
            FROM pedidos JOIN produtos 
            ON pedidos.id_produto = produtos.id_produto;`,
            (error, result, fields) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) }

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
            }
        )
    });
});

// INSERE UM PEDIDO
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            'SELECT * FROM produtos WHERE id_produto = ?',
            [req.body.id_produto],
            (error, result, fields) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                if (result.length == 0) {
                    conn.release();
                    return res.status(404).send({ mensagem: 'Produto não encontrado' })
                }

                conn.query(
                    'INSERT INTO pedidos (id_produto, quantidade) VALUES (?, ?)',
                    [req.body.id_produto, req.body.quantidade],
                    (error, result, fields) => {
                        conn.release();
        
                        if (error) { return res.status(500).send({ error: error }) }
        
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
                    }
                );
        });
    });
});

// RETORNA OS DADOS DE UM PEDIDO 
router.get('/:id_pedido', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            'SELECT * FROM pedidos WHERE id_pedido = ?',
            [req.params.id_pedido],
            (error, result, fields) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) }

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
            }
        )
    });
});

// EXCLUI UM PEDIDO
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `DELETE FROM pedidos WHERE id_pedido = ?`,
            [req.body.id_pedido],
            (error, result, fields) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensagem: 'Pedido removido com sucesso',
                    request: {
                        tipo: 'DELETE',
                        descricao: 'Remove um pedido'
                    }
                }

                return res.status(202).send(response);
            }
        )
    });
});

module.exports = router;