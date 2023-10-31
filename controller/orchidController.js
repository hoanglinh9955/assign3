const Categories = require("../model/category");
const Comments = require("../model/comment");
const Orchid = require("../model/orchid");
const Users = require("../model/user");

class orchidController {
  index(req, res, next) {
    Categories.find({}).then((category) => {
      Orchid.find({})
        .populate("comments")
        .populate({ path: "category", select: "categoryName" })
        .sort({ updatedAt: -1 })
        .then((data) => {
          res.render("orchid/index", {
            title: "Orchids",
            orchidsData: data,
            categoryData: category,
          });
          return;
        });
    });
  }
  createOrchid(req, res, next) {
    const newData = {
      name: req.body.name,
      origin: req.body.origin,
      image: req.body.image,
      isNatural: req.body.isNatural ? true : false,
      category: req.body.category,
    };
  
    Orchid.findOne({ name: newData.name })
      .then((existingOrchid) => {
        if (existingOrchid) {
          // Duplicate orchid name found
          req.flash("error_msg", "An orchid with the same name already exists.");
          res.redirect("/orchids");
        } else {
          const orchid = new Orchid(newData);
          orchid
            .save()
            .then((data) => {
              console.log(data);
              req.flash("success_msg", "Added new orchid successfully!");
              res.redirect("/orchids");
            })
            .catch((error) => {
              console.error(error);
              req.flash("error_msg", "Failed to add new orchid.");
              res.redirect("/orchids");
            });
        }
      })
      .catch((error) => {
        console.error(error);
        req.flash("error_msg", "Failed to check duplicate orchid name.");
        res.redirect("/orchids");
      });
  }
  deleteOrchid(req, res, next) {
    Orchid.deleteOne({ _id: req.params.id }).then((data) => {
      if (data.acknowledged) {
        req.flash("success_msg", "Delete orchid successfully!");
        res.redirect("/orchids");
      }
    });
  }
  detail(req, res, next) {
    const id = req.params.id;
    Orchid.findById(id)
      .populate("comments")
      .populate({ path: "category", select: "categoryName" })
      .then((data) => {
        Categories.find({}, "categoryName")
          .then((categories) => {
            res.render("orchid/detail", {
              title: "Detail of orchid",
              orchidDetail: data,
              categories: categories
            });
          })
          .catch((error) => {
            console.log(error);
            next(error);
          });
      })
      .catch((error) => {
        console.log(error);
        next(error);
      });
  }

  editOrchid(req, res, next) {
    const id = req.params.id;
    const updatedData = {
      name: req.body.name,
      origin: req.body.origin,
      image: req.body.image,
      isNatural: req.body.isNatural ? true : false,
      category: req.body.category,
    };
  
    Orchid.findOne({ name: updatedData.name, _id: { $ne: id } })
      .then((existingOrchid) => {
        if (existingOrchid) {
          // Duplicate orchid found
          req.flash('error_msg', 'An orchid with the same name already exists.');
          res.redirect(`/orchids/${id}`);
        } else {
          Orchid.findByIdAndUpdate(id, updatedData)
            .then(() => {
              req.flash('success_msg', 'Orchid updated successfully!');
              res.redirect(`/orchids/${id}`);
            })
            .catch((error) => {
              console.error(error);
              req.flash('error_msg', 'Failed to update orchid.');
              res.redirect(`/orchids/${id}`);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        req.flash('error_msg', 'Failed to check duplicate orchid.');
        res.redirect(`/orchids/${id}`);
      });
  }
}
module.exports = new orchidController();
