const router = require("express").Router();

const ProdutoController = require("../controllers/produtoController");

const auth = require("../auth");

router.get("/", ProdutoController.getAll);
router.get("/:id", ProdutoController.getById);
router.post("/", ProdutoController.create);
router.put("/:id", ProdutoController.updateById);
router.delete("/:id", ProdutoController.deleteById);

module.exports = router;