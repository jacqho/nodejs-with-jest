const express = require("express");
const controller = require("../controllers/homeowner");
const validator = require("../validators/homeowner");

const router = express.Router();

router.post('/', validator.create, controller.create);
router.put('/', validator.update, controller.update);
router.get('/search', validator.getBy, controller.getBy);
router.get('/all', validator.getAll, controller.getAll);
router.get('/id', validator.getById, controller.getById);
router.delete('/', validator.remove, controller.remove);

module.exports = router;