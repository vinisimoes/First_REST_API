const express = require('express');
const router = express.Router();

const UsuariosController = require('../controllers/usuarios-controller');

// CADASTRO DE UM USUARIO
router.post('/cadastro', UsuariosController.cadastrarUsuario);

// LOGIN DE USUARIO
router.post('/login', UsuariosController.loginUsuario);

module.exports = router;