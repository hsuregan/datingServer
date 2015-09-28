var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();


router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

router.get('/register', function(req, res) {
    res.render('register', { });
});

//curl -H "Content-Type: application/json" -X POST -d '{"username":"reganhsu", "password":"ugh"}' http://localhost:3000/register
router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username, active : req.body.active }), req.body.password, function(err, account) {
        if (err) {
        	return res.send("Sorry.  That username already exists.  Try again!");
          //return res.render("register", {info: "Sorry. That username already exists. Try again."});
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
   	console.log("USERNAME:" + req["user"]["username"]);
   	var username = req["user"]["username"];
   	// Account.returnAccount(username, function(err, account) {
   	// 	console.log(account);
   	// });

//ask anumat about how to decifer this mongoose object..
   	Account.findOne({"username": username}, function(err, doc){
   	 	doc['active'] = true;
   	 	doc.save();
   	 	console.log(doc);
   	 	console.log("success!");
   	 	//res.sendStatus(200);


   	});

   	//Account.findOneAndUpdate(req["user"], {'active': true});

   	//var ugh = Account.findOne(req["user"]);


   	//console.log(ugh);

    res.sendStatus(200);

    //res.send("Success!");


    //res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;