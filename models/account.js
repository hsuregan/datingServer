var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

var Account = new Schema({
    username: String,
    active: Boolean,
    password: String
}, {collection: 'accounts'});

//'accounts' references the collection in Mongodb
//Account references the schema created above



Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
//module.exports = db;