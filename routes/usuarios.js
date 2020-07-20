const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// CADASTRO DE UM USUARIO
router.post('/cadastro', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `SELECT * FROM usuarios WHERE email = ?`,
            [req.body.email],
            (error, results, fields) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) }

                if (results.length > 0) {
                    return res.status(409).send({mensagem: 'Usuário já cadastrado'})
                } else {
                    bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                        if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
                        
                        conn.query(
                            `INSERT INTO usuarios (email, senha) VALUES (?, ?)`, 
                            [req.body.email, hash],
                            (error, results, fields) => {
                                conn.release();
            
                                if (error) { return res.status(500).send({ error: error }) }
            
                                const response = {
                                    usuarioCriado: {
                                        id_usuario: results.insertId,
                                        email: req.body.email
                                    },
                                    request: {
                                        tipo: 'POST',
                                        descricao: 'Usuário criado com sucesso'
                                    }
                                }
            
                                return res.status(201).send(response);
                        })
                    });
                }
            }
        );

        
    });
});

// LOGIN DE USUARIO
router.post('/login', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `SELECT * FROM usuarios WHERE email = ?`,
            [req.body.email],
            (error, results, fields) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) }

                if (results.length == 0) { return res.status(401).send({ mensagem: 'Falha na autenticação' }) }
                
                bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
                    if (err) { return res.status(401).send({ mensagem: 'Falha na autenticação' }) }

                    if (result) {
                        const token = jwt.sign({
                            id_usuario: results[0].id_usuario,
                            email: results[0].email
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                        );
                                               
                        return res.status(200).send({
                            mensagem: 'Autenticado com sucesso',
                            token: token
                        })
                    }
                    
                    return res.status(401).send({ mensagem: 'Falha na autenticação' });
                })
            }
        );
    });
});

module.exports = router;