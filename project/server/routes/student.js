const express = require("express");
const router = express.Router();
const studentController = require("../controller/studentController");

//student routes

router.get("/", studentController.homepage);

router.get("/add", studentController.addStudent);
router.post("/add", studentController.postStudent);
router.get("/edit/:id",studentController.edit);
router.put("/edit/:id", studentController.editPost);
router.delete("/edit/:id", studentController.deletestudent);
router.post("/search", studentController.searchstudent);





module.exports = router;