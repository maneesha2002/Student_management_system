const Student = require("../models/Student");
const mongoose = require("mongoose");
const flash = require("connect-flash");

//home
exports.homepage = async (req, res) => {
  const messages = await req.flash("info");
  const locals = {
    title: "Class",
    description: "Class Student Management System",
  };
  let perPage = 10;
  let page = req.query.page || 1;

  try {
    const student = await Student.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
   
    const count = await Student.countDocuments({});

    res.render("index", {
      locals,
      student,
      current: page,
      pages: Math.ceil(count / perPage),
      messages,
    });
  } catch (error) {
    console.log(error);
  }
};



/**
 * GET /
 * New student Form
 */
exports.addStudent = async (req, res) => {
  const locals = {
    title: "Add New Student - Class",
    description: "Class Student Management System",
  };

  res.render("student/add", locals);
};

/**
 * POST /
 * create Student Form
 */
exports.postStudent = async (req, res) => {
  console.log(req.body);

  const newStudent = new Student({
    fullName: req.body.fullName,
    address: req.body.address,
    class: req.body.class,
    tel: req.body.tel,
    email: req.body.email,
  });

try {
  await Student.create(newStudent);
    await req.flash("info", "New Student has been added.");
  

  res.redirect('/');
} catch (error) {
  console.log(error);
}
};

/**
* GET /
 * Edit Student Data
 */
exports.edit = async (req, res) => {
  try {
    const student = await Student.findOne({ _id: req.params.id });

    const locals = {
      title: "Edit Student Data-Class",
      description: "Class Student Management System",
    };

    res.render("student/edit", {
      
      locals,
      student,
    }  );
  } catch (error) {
    console.log(error);
  }
};

/**
* GET /
 * update Student Data
 */
exports.editPost = async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.params.id, {
      fullName: req.body.fullName,
      address: req.body.address,
      class: req.body.class,
      tel: req.body.tel,
      email: req.body.email,
      updatedAt: Date.now(),
    });
     res.redirect(`/edit/${req.params.id}`);
      console.log("redirected");
    
  } catch (error) {
    console.log(error);
  }
};

/**
 * Delete /
 * Delete student Data
 */
exports.deletestudent = async (req, res) => {
  try {
    await Student.deleteOne({ _id: req.params.id });
    await req.flash("info", "Student Record Deleted Successfully.");
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

/**
 * Get /
 * Search student Data
 */
exports.searchstudent = async (req, res) => {
  const locals = {
    title: "Search student Data-Class",
    description: "Class Student Management System",
  };

  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const student = await Student.find({
      $or: [{ fullName: { $regex: new RegExp(searchNoSpecialChar, "i") } }],
    });

    res.render("search", {
      student,
      locals,
    });
  } catch (error) {
    console.log(error);
  }
};


