var express = require('express');

var mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost/ecommerce');
var ObjectId = mongoose.Types.ObjectId;
//var db = mongoose.connection;
var db = mongoose.connect('mongodb://localhost/ecommerce');

var Product = require('../models/productModel');



var productRouter = express.Router();
var router = function() {
  // var products=[
  //
  //   		{
  //       name:"Learn Javascript in 30 days",
  //   		category:"books",
  //   		MRP:650,
  //   		seller:"ABC Publishers",
  //   		description:"practical guide to learn Javascript",
  //   		average_customer_rating:4.5,
  //       expected_delivery_date:"20-02-2018",
  //       image:"public/images/product0.jpg"
  //     },
  //
  //     {
  //     name:"Learn PHP in 30 days",
  //     category:"CD",
  //     MRP:900,
  //     seller:"DEF Publishers",
  //     description:"guide to learn PHP",
  //     average_customer_rating:3.8,
  //     expected_delivery_date:"25-02-2018",
  //     image:"public/images/product1.jpg"
  //   }
  //
  // ]

  productRouter.use(function(req,res,next) {
    if(!req.user) {
      res.render('notLoggedIn');
    }
    next();
  })

  productRouter.route('/')

    .get(function(req,res) {
      //var collection = db.collection('products');
      Product.find(function(err,results) {
        if(err) {
          res.status(500).send(err);
        }
        else {
        res.render('productListView', {products:results});
      }
      });


    });

//   productRouter.route('/:id')
//       .get(function(req,res) {
//         var id  = new ObjectId(req.params.id);
//         //console.log(typeof id);
//         var collection = db.collection('products');
//         collection.findOne({_id:id}, function(err,results) {
//           res.render('productView', {product:results});
//         });
//
//       });
//
//   return productRouter;
// }

productRouter.route('/:id')
    .get(function(req,res) {

      Product.findById(req.params.id, function(err,result) {
        res.render('productView', {product:result});
      });

    });

return productRouter;
}



module.exports = router;
