const router = require("express").Router();

const ComandaController = require("../controllers/comandaController");

const auth = require("../auth");

router.get("/", ComandaController.getAll);
router.get("/:id", ComandaController.getById);
router.post("/", ComandaController.create);
router.put("/:id", ComandaController.updateById);
router.delete("/", ComandaController.deleteAll);
router.delete("/:id", ComandaController.deleteById);

module.exports = router;