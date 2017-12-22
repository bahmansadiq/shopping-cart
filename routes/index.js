var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product');

/* GET home page. */
router.get('/', function (req, res, next) {
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', {title: 'Shopping Cart', products: productChunks});
    });
});


router.get('/add-to-cart/:id', function(req, res, next){
  var productId=req.params.id;
  var cart= new Cart(req.session.cart ? req.session.cart:{});
  Product.findById(productId, function(err, product){
    if(err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart=cart;
    console.log(req.session.cart);
    res.redirect('/');
  })

});

router.get('/shopping-cart', function(req, res, next){
      if(!req.session.cart){
        return res.render('shop/shopping-cart', {products: null});
      }
      var cart=  new Cart(req.session.cart);
      res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', function(req, res, next){
      if(!req.session.cart){
        return res.redirect('/shopping-cart');
      }
      var cart=  new Cart(req.session.cart);
      var errMsg = req.flash('error')[0];
      res.render('shop/checkout', {total: cart.totalPrice});
});

router.post('/checkout', function(req, res, next){

      if(!req.session.cart){
        return res.redirect('/shopping-cart');
      }
  var cart=  new Cart(req.session.cart);
  // Set your secret key: remember to change this to your live secret key in production
  // See your keys here: https://dashboard.stripe.com/account/apikeys
  var stripe = require("stripe")(
     "sk_test_LQOR0h0iNuj9SGq3IfG1UsCH"
    );

  // Token is created using Checkout or Elements!
  // Get the payment token ID submitted by the form:
  var token = request.body.stripeToken; // Using Express

  // Charge the user's card:
  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "usd",
    description: "Charge for test :-) Example ",
    source: token,
  }, function(err, charge) {
      if(err){
        req.flash('error', err.message);
        return res.redirect('/checkout');
      }

      req.flash('success', 'Successfully bought the product!');
      req.cart=null;
      req.redirect('/');
});

});
module.exports = router;
