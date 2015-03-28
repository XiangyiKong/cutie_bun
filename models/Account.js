module.exports = function(config, mongoose, nodemailer) {
  var crypto = require('crypto');
  
  var AccountSchema = new mongoose.Schema ({
    email:    { type: String, unique: true },
    password: { type: String },
    name: {
      first: { type: String },
      last:  { type: String }
    },
    birthday: {
      day:   { type: Number, min: 1, max: 31, required: false },
      month: { type: Number, min: 1, max: 12, required: false },
      year:  { type: Number }
    },
    photoUrl:  { type: String },
    biography: { type: String }
  });
  
  var Account = mongoose.model('Account', AccountSchema);
  
  var registerCallback = function(err) {
    if(err) {
      return console.log(err);
    };
    return console.log('Account was created');
  };
  
  // Update the account's password with a newly encrypted password,
  var changePassword = function(accountId, newpassword) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(newpassword);
    var hashedPassword = shaSum.digest('hex');
    // $set, change a single value in the account rather than the entire document.
    // $upsert to false: query will only work on a document that exists in the database: no new account created
    Account.update({_id:accountId}, {$set: {password:hashedPassword}}, {upsert: false}, 
      function changePasswordCallback(err) {
        console.log('Change password done for account' + accountId);
      });
  };
  
  var forgotPassword = function(email, resetPasswordUrl, callback) {
    var user = Account.findOne({email:email}, function findAccount(err, doc)
    {
      if(err) {
        //Email is not a valid user
        callback(false);
      } else {
        var smtTransport = nodemailer.createTransport('SMTP', config.mail);
        resetPasswordUrl += '?account =' + doc._id;
        smtpTransport.sendMail ({
          //TODO: edit the mail addr
          from: 'family@gmail.com',
          to: doc.email,
          subject: 'Reset password'
          text: 'Click here to reset your password: ' + resetPasswordUrl
        }, function forgotPasswordResult(err) {
            if(err) {
              callback(false);
            } else {
              callback(ture);
            }
        });
      }
    });
  }; 
  
  // Node crypto library to convert the plain text password into an encrypted hash using the SHAI algo
  var login = function(email, password, callback) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(password);
    Account.findOne({email; email, password:shaSum.digest('hex')}, function(err,doc) {
      // If not found, doc returns Null
      callback(null != doc);
    });
  };
  
  var register = function(email, password, firstName, lastName) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(password);
    
    console.log('Registering ' + email);
    var user = new Account ({
      email: email,
      name: {
        first: firstName,
        last: lastName
      },
      password:shaSum.digest('hex');
    });
    user.save(registerCallback);
    console.log('Save command was sent');
  }
  
  return {
    register: register,
    forgotPassword: forgotPassword,
    changePassword: changePassword,
    login: login,
    Account: Account
  }
}
    
