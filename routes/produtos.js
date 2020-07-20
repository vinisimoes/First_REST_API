const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads/');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// RETORNA TODOS OS PRODUTOS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            'SELECT * FROM produtos',
            (error, result, fields) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    quantidade: result.length,
                    produtos: result.map(produto => {
                        return {
                            id_produto: produto.id_produto,
                            nome: produto.nome,
                            preco: produto.preco,
                            imagem_produto: produto.imagem_produto,
                            url_detalhes: process.env.URL_PRODUTOS + produto.id_produto,
                        }
                    }),
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os produtos'
                    }
                }
                return res.status(200).send(response);
            }
        )
    });
});

// INSERE UM PRODUTO
router.post('/', upload.single('imagem_produto'), (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            'INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?, ?, ?)',
            [req.body.nome, req.body.preco, req.file.path],
            (error, result, fields) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensagem: 'Produto inserido com sucesso',
                    produtoCriado: {
                        id_produto: result.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        imagem_produto: req.file.path
                    },
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um produto',
                    }
                }

                return res.status(201).send(response);
            }
        );
    });
});

// RETORNA OS DADOS DE UM PRODUTO 
router.get('/:id_produto', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            'SELECT * FROM produtos WHERE id_produto = ?',
            [req.params.id_produto],
            (error, result, fields) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) }

                if (result.length == 0) { return res.status(404).send({ mensagem: 'Produto não encontrado' }) }
                    
                const response = {
                    produto: {
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        imagem_produto: result[0].imagem_produto
                    },
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna um produto'
                    }
                }

                return res.status(200).send(response);
            }
        )
    });
});

// ALTERA UM PRODUTO
router.patch('/', upload.single('imagem_produto'), (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `UPDATE produtos
                SET nome  = ?,
                    preco = ?,
                    imagem_produto = ?
            WHERE id_produto = ?`,
            [req.body.nome, req.body.preco, req.file.path, req.body.id_produto],
            (error, result, fields) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensagem: 'Produto alterado com sucesso',
                    produtoAlterado: {
                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        imagem_produto: req.file.path
                    },
                    request: {
                        tipo: 'PATCH',
                        descricao: 'Altera um produto',
                        url_detalhes: process.env.URL_PRODUTOS + req.body.id_produto
                    }
                }

                return res.status(202).send(response);
            }
        )
    });
});

// EXCLUI UM PRODUTO
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `DELETE FROM produtos WHERE id_produto = ?`,
            [req.body.id_produto],
            (error, result, fields) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensagem: 'Produto removido com sucesso',
                    request: {
                        tipo: 'DELETE',
                        descricao: 'Remove um produto'
                    }
                }

                return res.status(202).send(response);
            }
        )
    });
});

module.exports = router;