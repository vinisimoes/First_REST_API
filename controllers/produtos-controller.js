const mysql = require('../mysql');

exports.getProdutos = async (req, res, next) => {
    try {
        const result = await mysql.execute("SELECT * FROM produtos;");
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
    } catch (error) {
        return res.status(500).send({ error: error })
    }
};

exports.postProduto = async (req, res, next) => {
    try {
        const query = "INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?, ?, ?);";
        const result = await mysql.execute(query, [req.body.nome, req.body.preco, req.file.path]);
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
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.getUmProduto = async (req, res, next) => {
    try {
        const query = "SELECT * FROM produtos WHERE id_produto = ?;";
        const result = await mysql.execute(query, [req.params.id_produto]);
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
    } catch (error) {
        return res.status(500).send({ error: error })
    }
};

exports.alteraProduto = async (req, res, next) => {
    try {
        const query = `UPDATE produtos
                            SET nome  = ?,
                                preco = ?,
                                imagem_produto = ?
                        WHERE id_produto = ?;`;
        await mysql.execute(query, [req.body.nome, req.body.preco, req.file.path, req.body.id_produto]);
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
    } catch (error) {
        return res.status(500).send({ error: error })
    }
};

exports.deleteProduto = async (req, res, next) => {
    try {
        const query = "DELETE FROM produtos WHERE id_produto = ?;";
        await mysql.execute(query, [req.body.id_produto]);
        const response = {
            mensagem: 'Produto removido com sucesso',
            request: {
                tipo: 'DELETE',
                descricao: 'Remove um produto'
            }
        }
        return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error })
    }
};