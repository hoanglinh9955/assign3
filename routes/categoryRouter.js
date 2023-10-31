var express = require("express");
var router = express.Router();
const categoryController = require("../controller/categoryController");
const { ensureAuthenticated, adminAuthenticated } = require("../config/auth");

router.route("/").get(adminAuthenticated, categoryController.index)
    .post(adminAuthenticated, categoryController.createcategory);
router.route("/:id")  
    .get(adminAuthenticated, categoryController.detail)  
    .delete(adminAuthenticated, categoryController.deletecategory)
    // .put(adminAuthenticated, categoryController.editcategory);

module.exports = router;
