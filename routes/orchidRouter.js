var express = require("express");
var router = express.Router();
const orchidController = require("../controller/orchidController");
const { ensureAuthenticated, adminAuthenticated } = require("../config/auth");

router.route("/").get(orchidController.index)
    .post(adminAuthenticated, orchidController.createOrchid);
router.route("/:id").get(orchidController.detail)
    .delete(ensureAuthenticated, adminAuthenticated, orchidController.deleteOrchid)
    .put(ensureAuthenticated, adminAuthenticated, orchidController.editOrchid);

module.exports = router;
