var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
var path = require('path');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var Cart = require('./src/models/cart');
//mongoose.connect('mongodb://localhost/ecommerce');
var Product = require('./src/models/productModel');
var port = 5000;

var productRouter = require('./src/routes/productRoutes')();
var adminRouter = require('./src/routes/adminRoutes')();
var authRouter = require('./src/routes/authRoutes')();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret:'1234',
store:new MongoStore({mongooseConnection:mongoose.connection}),
cookie:{maxAge:180*60*1000}
}));

require('./src/config/passport')(app);



//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views','./src/views');
app.set('view engine','ejs');

app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;

  next();
});

app.use('/products',productRouter);
app.use('/admin',adminRouter);
app.use('/auth',authRouter);



app.get('/', function(req,res) {
  req.session.cart =new Cart(req.session.cart ? req.session.cart : {});
  Product.find(function(err,docs) {
    var productChunks=[];
    var chunkSize = 3;
    for(var i=0;i<docs.length;i+=chunkSize) {
    productChunks.push(docs.slice(i, i+chunkSize));
    }
        res.render('index', {products:productChunks});
  })

});

app.get('/add-to-cart/:id',function(req,res) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});


  Product.findById(productId, function(err, product) {
    if(err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/products');
  })
})

 app.get('/shopping-cart', function (req, res, next) {
    if (!req.session.cart) {
        return res.render('shopping-cart', {products: null});
    }
    var cart = new Cart(req.session.cart);
    res.render('shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

app.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

app.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});


app.get('/invalidPassword', function(req,res) {
  res.render('invalidPassword');
});

app.get('/admin', function(req,res) {
  res.render('admin');
});

app.get('/addProduct', function(req,res) {
  res.render('addProduct');
});

app.get('/editProduct', function(req,res) {
  res.render('editProduct');
});

app.get('/deleteProduct', function(req,res) {
  res.render('deleteProduct');
});



app.listen(port, function(err) {
  console.log('Listening on port 5000');
});
