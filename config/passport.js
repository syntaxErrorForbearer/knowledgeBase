const LOCALSTRATEGY = require('passport-local').Strategy;
const USER = require('../models/user');
const CONFIG =  require('../config/database');
const BCRYPT = require('bcryptjs');


module.exports = (passport) => {
  // Local Strategy
  passport.use(new LOCALSTRATEGY((username, password, done)=>{
    // Match Username
    let query = {
      username:username
    }
    USER.findOne(query, (err, user) => {
      if(err) throw err;
      if(!user){
        return done(null, false, {message:'No user found'})
      }

      // Match password
      BCRYPT.compare(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        } else {
          return done(null, false, {message: 'Wrong password sugar.'});
        }
      });
    });
  }));

  passport.serializeUser(function(USER, done){
    console.log('serizaling!!!!!!!!!1')
    done(null, USER.id);
  });
  passport.deserializeUser(function(id, done){
    USER.findById(id, (err, USER) => {
      //console.log(`USER: ${USER}`);
      console.log(`deserializeUser`);
      done(err, USER);
    });
  });
}
