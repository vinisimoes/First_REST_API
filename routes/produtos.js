const express = require('express');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login');

const ProdutosController = require('../controllers/produtos-controller');

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
router.get('/', ProdutosController.getProdutos);

// INSERE UM PRODUTO
router.post('/', login.obrigatorio, upload.single('imagem_produto'), ProdutosController.postProduto);

// RETORNA OS DADOS DE UM PRODUTO 
router.get('/:id_produto', ProdutosController.getUmProduto);

// ALTERA UM PRODUTO
router.patch('/', login.obrigatorio, upload.single('imagem_produto'), ProdutosController.alteraProduto);

// EXCLUI UM PRODUTO
router.delete('/', login.obrigatorio, ProdutosController.deleteProduto);

// RETORNA IMAGEM DE UM PRODUTO
router.get('/:id_produto/imagem', ProdutosController.getImagemProduto);

module.exports = router;