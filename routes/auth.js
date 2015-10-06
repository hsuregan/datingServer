var jwt = require('jwt-simple');
var Account = require('../models/account');

 
var auth = {
 
  login: function(req, res) {
 
    var username = req.body.username || '';
    var password = req.body.password || '';
 
    if (username == '' || password == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
 
    // Fire a query to your DB and check if the credentials are valid
    //synchronize thread
    //var dbUserObj = auth.validate(username, password);

    Account.findOne({"username": username}, function(err, userObject){
      if(userObject['active'] == true) {
        res.status(200);
        res.json({
          "status": 200,
          "message": "This account it logged on somewhere else."
        })
      }

      userObject['active'] = true;
      userObject.save();
      if(!userObject){
          res.status(401);
          res.json({
            "status": 401,
            "message": "Invalid credentials"
          });
          return;
      }

      if(userObject) {
        res.json(genToken(userObject));
      }

      //return user;
    });

//this logic is removed
    // if (!dbUserObj) { // If authentication fails, we send a 401 back
    //   res.status(401);
    //   res.json({
    //     "status": 401,
    //     "message": "Invalid credentials"
    //   });
    //   return;
    // }
 
    // if (dbUserObj) {
    //   // If authentication is success, we will generate a token
    //   // and dispatch it to the client
 
    //   res.json(genToken(dbUserObj));
    // }
 
  },


  validate: function(username, password) {
    // spoofing the DB response for simplicity
    var dbUserObj = { // spoofing a userobject from the DB. 
      name: 'arvind',
      role: 'admin',
      username: 'arvind@myapp.com'
    };


    //my implementation
    Account.findOne({"username": username}, function(err, userObject){
      //dbUserObj['active'] = true;
      //dbUserObj.save();
      var user = {
        username: userObject["username"],
      }
      console.log("user: " + user);

      return user;
    });


 
    //return null;
  },
 
  validateUser: function(username) {
    // spoofing the DB response for simplicity
    var dbUserObj = { // spoofing a userobject from the DB. 
      name: 'arvind',
      role: 'admin',
      username: 'arvind@myapp.com'
    };
 
    return dbUserObj;
  },

}
 
// private method
function genToken(user) {
  var expires = expiresIn(7); // 7 days
  var token = jwt.encode({
    exp: expires
  }, require('../config/secret')());
 
  return {
    token: token,
    expires: expires,
    user: user
  };
}
 
function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}
 
module.exports = auth;