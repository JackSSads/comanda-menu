const router = require("express").Router();

const CaixaController = require("../controllers/caixaController");

const auth = require("../auth");

router.get("/", CaixaController.getAll);
router.get("/:id", CaixaController.getById);
router.post("/", CaixaController.create);
router.put("/:id", CaixaController.updateById);
router.delete("/:id", CaixaController.deleteById);

module.exports = router;