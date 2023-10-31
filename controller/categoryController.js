const Categories = require("../model/category");
const Comments = require("../model/comment");
const Orchid = require("../model/orchid");
const Users = require("../model/user");

class categoryController {
  index(req, res, next) {
    Categories.find({})
    .then((category) => {
        console.log(category)
     
          res.render("category/index", {
            title: "Category",
            categoryData: category,
          });
        });
  }
  createcategory(req, res, next) {
    const newData = {
      categoryName: req.body.categoryName,
    };
  
    Categories.findOne({ categoryName: newData.categoryName })
      .then((existingOrchid) => {
        if (existingOrchid) {
          // Duplicate orchid name found
          req.flash("error_msg", "An category with the same name already exists.");
          res.redirect("/category");
        } else {
          const category = new Categories(newData);
          category
            .save()
            .then((data) => {
              console.log(data);
              req.flash("success_msg", "Added new category successfully!");
              res.redirect("/category");
            })
            .catch((error) => {
              console.error(error);
              req.flash("error_msg", "Failed to add new category.");
              res.redirect("/category");
            });
        }
      })
      .catch((error) => {
        console.error(error);
        req.flash("error_msg", "Failed to check duplicate category name.");
        res.redirect("/category");
      });
  }
  deletecategory(req, res, next) {
    const categoryId = req.params.id;
  
    Orchid.findOne({ category: categoryId })
      .then((orchid) => {
        if (orchid) {
          // Orchid found using the category, cannot delete the category
          req.flash("error_msg", "Cannot delete the category. Orchids are associated with it.");
          res.redirect("/category");
        } else {
          Categories.deleteOne({ _id: categoryId })
            .then((data) => {
              console.log(data);
              if (data.acknowledged) {
                req.flash("success_msg", "Category deleted successfully!");
                res.redirect("/category");
              }
            })
            .catch((error) => {
              console.error(error);
              req.flash("error_msg", "An error occurred while deleting the category.");
              res.redirect("/category");
            });
        }
      })
      .catch((error) => {
        console.error(error);
        req.flash("error_msg", "An error occurred while checking for associated orchids.");
        res.redirect("/category");
      });
  }
  detail(req, res, next) {
    console.log(req.body)
    const id = req.params.id;
    console.log(id)
        Categories.findById(id)
          .then((data) => {
            console.log(data)
            res.render("category/detail", {
              title: "Detail of category",
              categoryDetail: data,
            });
          })
          .catch((error) => {
            console.log(error);
            next(error);
          })
     
  }

//   editOrchid(req, res, next) {
//     const id = req.params.id;
//     const updatedData = {
//       name: req.body.name,
//       origin: req.body.origin,
//       image: req.body.image,
//       isNatural: req.body.isNatural ? true : false,
//       category: req.body.category,
//     };
  
//     Orchid.findOne({ name: updatedData.name, _id: { $ne: id } })
//       .then((existingOrchid) => {
//         if (existingOrchid) {
//           // Duplicate orchid found
//           req.flash('error_msg', 'An orchid with the same name already exists.');
//           res.redirect(`/orchids/${id}`);
//         } else {
//           Orchid.findByIdAndUpdate(id, updatedData)
//             .then(() => {
//               req.flash('success_msg', 'Orchid updated successfully!');
//               res.redirect(`/orchids/${id}`);
//             })
//             .catch((error) => {
//               console.error(error);
//               req.flash('error_msg', 'Failed to update orchid.');
//               res.redirect(`/orchids/${id}`);
//             });
//         }
//       })
//       .catch((error) => {
//         console.error(error);
//         req.flash('error_msg', 'Failed to check duplicate orchid.');
//         res.redirect(`/orchids/${id}`);
//       });
//   }
}
module.exports = new categoryController();
