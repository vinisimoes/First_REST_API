const express = require('express');
const app = express();

// DEFINE QUE VAI USAR JSON
app.use(express.urlencoded({ extended: false })); // Apenas dados simples
app.use(express.json());

// CORS - DEFINE HEADERS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Qualquer origem pode acessar o recurso
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Origin, X-Requested-With, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT', 'GET', 'POST', 'PATCH', 'DELETE');
        return res.status(200).send({});
    }

    next();
});

const rotaProdutos = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');
const rotaUsuarios = require('./routes/usuarios');

app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaPedidos);
app.use('/usuarios', rotaUsuarios);

// QUANDO NAO ENCONTRA ROTA
app.use((req, res, next) => {
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;