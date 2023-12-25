const router = require("express").Router();

const UserController = require("../controllers/userController");

const auth = require("../auth");

router.get("/", UserController.getAll);
router.get("/:id", UserController.getById);
router.post("/", UserController.create);
router.put("/:id", UserController.updateById);
router.delete("/:id", UserController.deleteById);

module.exports = router;