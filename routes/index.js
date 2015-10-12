var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var auth = require('../routes/auth');
var router = express.Router();

//////////
//STORE TOKEN IN THE DB 
/////



router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});


//curl -H "Content-Type: application/json" -X POST -d '{"username":"reganhsu", "password":"ugh"}' http://localhost:3000/register
router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username, active : req.body.active }), req.body.password, function(err, account) {
        if (err) {
        	return res.send("Sorry.  That username already exists.  Try again!");
          //return res.render("register", {info: "Sorry. That username already exists. Try again."});
        }

        passport.authenticate('local')(req, res, function () {
          res.json(account);
            //res.post('/login1', passport.authenticate('local'), auth.login)
            //res.redirect('/');
        });
    });
});

//curl -d '{"username":"hsuregan5", "password": "ugh"}' -H 'Content-type: application/json' http://localhost:3000/login1
//THIS ONE
router.post('/login1', passport.authenticate('local'), auth.login);

//Ignore
router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});


//ignore 
router.post('/login', passport.authenticate('local'), function(req, res) {
   	var username = req["user"]["username"];
   	console.log("USER ACCESS: " + req["user"]);

   	Account.findOne({"username": username}, function(err, doc){ 
  	 	doc['active'] = true;
   	 	doc.save();
      if(!doc) {
        res.sendStatus(200);
      }
      
      if(doc) {
        return doc;
      }

   	});

//    res.sendStatus(200);
});

router.post('/logout', function(req, res){
	console.log(req);
  var username = req.body.username;
	console.log(username);

	Account.findOne({"username": username}, function(err, doc){
   	 	doc['active'] = false;
   	 	doc.save();
      res.sendStatus(200);
  });

	//res.logout();
})

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;