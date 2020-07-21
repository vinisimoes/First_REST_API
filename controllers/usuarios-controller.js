const mysql = require('../mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.cadastrarUsuario = async (req, res, next) => {
    try {
        var query = `SELECT * FROM usuarios WHERE email = ?;`;
        var result = await mysql.execute(query, [req.body.email]);
        if (result.length > 0) { return res.status(409).send({ mensagem: 'Usuário já cadastrado' }) }
        bcrypt.hash(req.body.senha, 10, async (errBcrypt, hash) => {
            if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
            query = `INSERT INTO usuarios (email, senha) VALUES (?, ?);`;
            result = await mysql.execute(query, [req.body.email, hash]);
            const response = {
                usuarioCriado: {
                    id_usuario: result.insertId,
                    email: req.body.email
                },
                request: {
                    tipo: 'POST',
                    descricao: 'Usuário criado com sucesso'
                }
            }
            return res.status(201).send(response);
        });
    } catch (error) {
        return res.status(500).send({ error: error })
    }
};

exports.loginUsuario = async (req, res, next) => {
    try {
        const query = `SELECT * FROM usuarios WHERE email = ?;`;
        const result = await mysql.execute(query, [req.body.email]);
        if (result.length == 0) { return res.status(401).send({ mensagem: 'Falha na autenticação' }) }
        bcrypt.compare(req.body.senha, result[0].senha, (err, resultado) => {
            if (err) { return res.status(401).send({ mensagem: 'Falha na autenticação' }) }
            if (result) {
                const token = jwt.sign({
                    id_usuario: result[0].id_usuario,
                    email: result[0].email
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
        });
    } catch (error) {
        return res.status(500).send({ error: error })
    }
};


// exports.loginUsuario = (req, res, next) => {
//     mysql.getConnection((error, conn) => {
//         if (error) { return res.status(500).send({ error: error }) }

//         conn.query(
//             `SELECT * FROM usuarios WHERE email = ?`,
//             [req.body.email],
//             (error, results, fields) => {
//                 conn.release();

//                 if (error) { return res.status(500).send({ error: error }) }

//                 if (results.length == 0) { return res.status(401).send({ mensagem: 'Falha na autenticação' }) }
                
//                 bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
//                     if (err) { return res.status(401).send({ mensagem: 'Falha na autenticação' }) }

//                     if (result) {
//                         const token = jwt.sign({
//                             id_usuario: results[0].id_usuario,
//                             email: results[0].email
//                         },
//                             process.env.JWT_KEY,
//                             {
//                                 expiresIn: "1h"
//                             }
//                         );
                                               
//                         return res.status(200).send({
//                             mensagem: 'Autenticado com sucesso',
//                             token: token
//                         })
//                     }
                    
//                     return res.status(401).send({ mensagem: 'Falha na autenticação' });
//                 })
//             }
//         );
//     });
// };