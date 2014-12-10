//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Accounts = Package['accounts-base'].Accounts;
var SRP = Package.srp.SRP;
var SHA256 = Package.sha.SHA256;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var DDP = Package.livedata.DDP;

(function () {

///////////////////////////////////////////////////////////////////////////////////
//                                                                               //
// packages/accounts-password/password_client.js                                 //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////
                                                                                 //
// Attempt to log in with a password.                                            // 1
//                                                                               // 2
// @param selector {String|Object} One of the following:                         // 3
//   - {username: (username)}                                                    // 4
//   - {email: (email)}                                                          // 5
//   - a string which may be a username or email, depending on whether           // 6
//     it contains "@".                                                          // 7
// @param password {String}                                                      // 8
// @param callback {Function(error|undefined)}                                   // 9
Meteor.loginWithPassword = function (selector, password, callback) {             // 10
  if (typeof selector === 'string')                                              // 11
    if (selector.indexOf('@') === -1)                                            // 12
      selector = {username: selector};                                           // 13
    else                                                                         // 14
      selector = {email: selector};                                              // 15
                                                                                 // 16
  Accounts.callLoginMethod({                                                     // 17
    methodArguments: [{                                                          // 18
      user: selector,                                                            // 19
      password: hashPassword(password)                                           // 20
    }],                                                                          // 21
    userCallback: function (error, result) {                                     // 22
      if (error && error.error === 400 &&                                        // 23
          error.reason === 'old password format') {                              // 24
        // The "reason" string should match the error thrown in the              // 25
        // password login handler in password_server.js.                         // 26
                                                                                 // 27
        // XXX COMPAT WITH 0.8.1.3                                               // 28
        // If this user's last login was with a previous version of              // 29
        // Meteor that used SRP, then the server throws this error to            // 30
        // indicate that we should try again. The error includes the             // 31
        // user's SRP identity. We provide a value derived from the              // 32
        // identity and the password to prove to the server that we know         // 33
        // the password without requiring a full SRP flow, as well as            // 34
        // SHA256(password), which the server bcrypts and stores in              // 35
        // place of the old SRP information for this user.                       // 36
        srpUpgradePath({                                                         // 37
          upgradeError: error,                                                   // 38
          userSelector: selector,                                                // 39
          plaintextPassword: password                                            // 40
        }, callback);                                                            // 41
      }                                                                          // 42
      else if (error) {                                                          // 43
        callback && callback(error);                                             // 44
      } else {                                                                   // 45
        callback && callback();                                                  // 46
      }                                                                          // 47
    }                                                                            // 48
  });                                                                            // 49
};                                                                               // 50
                                                                                 // 51
var hashPassword = function (password) {                                         // 52
  return {                                                                       // 53
    digest: SHA256(password),                                                    // 54
    algorithm: "sha-256"                                                         // 55
  };                                                                             // 56
};                                                                               // 57
                                                                                 // 58
// XXX COMPAT WITH 0.8.1.3                                                       // 59
// The server requested an upgrade from the old SRP password format,             // 60
// so supply the needed SRP identity to login. Options:                          // 61
//   - upgradeError: the error object that the server returned to tell           // 62
//     us to upgrade from SRP to bcrypt.                                         // 63
//   - userSelector: selector to retrieve the user object                        // 64
//   - plaintextPassword: the password as a string                               // 65
var srpUpgradePath = function (options, callback) {                              // 66
  var details;                                                                   // 67
  try {                                                                          // 68
    details = EJSON.parse(options.upgradeError.details);                         // 69
  } catch (e) {}                                                                 // 70
  if (!(details && details.format === 'srp')) {                                  // 71
    callback && callback(                                                        // 72
      new Meteor.Error(400, "Password is old. Please reset your " +              // 73
                       "password."));                                            // 74
  } else {                                                                       // 75
    Accounts.callLoginMethod({                                                   // 76
      methodArguments: [{                                                        // 77
        user: options.userSelector,                                              // 78
        srp: SHA256(details.identity + ":" + options.plaintextPassword),         // 79
        password: hashPassword(options.plaintextPassword)                        // 80
      }],                                                                        // 81
      userCallback: callback                                                     // 82
    });                                                                          // 83
  }                                                                              // 84
};                                                                               // 85
                                                                                 // 86
                                                                                 // 87
// Attempt to log in as a new user.                                              // 88
Accounts.createUser = function (options, callback) {                             // 89
  options = _.clone(options); // we'll be modifying options                      // 90
                                                                                 // 91
  if (typeof options.password !== 'string')                                      // 92
    throw new Error("Must set options.password");                                // 93
  if (!options.password) {                                                       // 94
    callback(new Meteor.Error(400, "Password may not be empty"));                // 95
    return;                                                                      // 96
  }                                                                              // 97
                                                                                 // 98
  // Replace password with the hashed password.                                  // 99
  options.password = hashPassword(options.password);                             // 100
                                                                                 // 101
  Accounts.callLoginMethod({                                                     // 102
    methodName: 'createUser',                                                    // 103
    methodArguments: [options],                                                  // 104
    userCallback: callback                                                       // 105
  });                                                                            // 106
};                                                                               // 107
                                                                                 // 108
                                                                                 // 109
                                                                                 // 110
// Change password. Must be logged in.                                           // 111
//                                                                               // 112
// @param oldPassword {String|null} By default servers no longer allow           // 113
//   changing password without the old password, but they could so we            // 114
//   support passing no password to the server and letting it decide.            // 115
// @param newPassword {String}                                                   // 116
// @param callback {Function(error|undefined)}                                   // 117
Accounts.changePassword = function (oldPassword, newPassword, callback) {        // 118
  if (!Meteor.user()) {                                                          // 119
    callback && callback(new Error("Must be logged in to change password."));    // 120
    return;                                                                      // 121
  }                                                                              // 122
                                                                                 // 123
  check(newPassword, String);                                                    // 124
  if (!newPassword) {                                                            // 125
    callback(new Meteor.Error(400, "Password may not be empty"));                // 126
    return;                                                                      // 127
  }                                                                              // 128
                                                                                 // 129
  Accounts.connection.apply(                                                     // 130
    'changePassword',                                                            // 131
    [oldPassword ? hashPassword(oldPassword) : null, hashPassword(newPassword)], // 132
    function (error, result) {                                                   // 133
      if (error || !result) {                                                    // 134
        if (error && error.error === 400 &&                                      // 135
            error.reason === 'old password format') {                            // 136
          // XXX COMPAT WITH 0.8.1.3                                             // 137
          // The server is telling us to upgrade from SRP to bcrypt, as          // 138
          // in Meteor.loginWithPassword.                                        // 139
          srpUpgradePath({                                                       // 140
            upgradeError: error,                                                 // 141
            userSelector: { id: Meteor.userId() },                               // 142
            plaintextPassword: oldPassword                                       // 143
          }, function (err) {                                                    // 144
            if (err) {                                                           // 145
              callback && callback(err);                                         // 146
            } else {                                                             // 147
              // Now that we've successfully migrated from srp to                // 148
              // bcrypt, try changing the password again.                        // 149
              Accounts.changePassword(oldPassword, newPassword, callback);       // 150
            }                                                                    // 151
          });                                                                    // 152
        } else {                                                                 // 153
          // A normal error, not an error telling us to upgrade to bcrypt        // 154
          callback && callback(                                                  // 155
            error || new Error("No result from changePassword."));               // 156
        }                                                                        // 157
      } else {                                                                   // 158
        callback && callback();                                                  // 159
      }                                                                          // 160
    }                                                                            // 161
  );                                                                             // 162
};                                                                               // 163
                                                                                 // 164
// Sends an email to a user with a link that can be used to reset                // 165
// their password                                                                // 166
//                                                                               // 167
// @param options {Object}                                                       // 168
//   - email: (email)                                                            // 169
// @param callback (optional) {Function(error|undefined)}                        // 170
Accounts.forgotPassword = function(options, callback) {                          // 171
  if (!options.email)                                                            // 172
    throw new Error("Must pass options.email");                                  // 173
  Accounts.connection.call("forgotPassword", options, callback);                 // 174
};                                                                               // 175
                                                                                 // 176
// Resets a password based on a token originally created by                      // 177
// Accounts.forgotPassword, and then logs in the matching user.                  // 178
//                                                                               // 179
// @param token {String}                                                         // 180
// @param newPassword {String}                                                   // 181
// @param callback (optional) {Function(error|undefined)}                        // 182
Accounts.resetPassword = function(token, newPassword, callback) {                // 183
  check(token, String);                                                          // 184
  check(newPassword, String);                                                    // 185
                                                                                 // 186
  if (!newPassword) {                                                            // 187
    callback(new Meteor.Error(400, "Password may not be empty"));                // 188
    return;                                                                      // 189
  }                                                                              // 190
                                                                                 // 191
  Accounts.callLoginMethod({                                                     // 192
    methodName: 'resetPassword',                                                 // 193
    methodArguments: [token, hashPassword(newPassword)],                         // 194
    userCallback: callback});                                                    // 195
};                                                                               // 196
                                                                                 // 197
// Verifies a user's email address based on a token originally                   // 198
// created by Accounts.sendVerificationEmail                                     // 199
//                                                                               // 200
// @param token {String}                                                         // 201
// @param callback (optional) {Function(error|undefined)}                        // 202
Accounts.verifyEmail = function(token, callback) {                               // 203
  if (!token)                                                                    // 204
    throw new Error("Need to pass token");                                       // 205
                                                                                 // 206
  Accounts.callLoginMethod({                                                     // 207
    methodName: 'verifyEmail',                                                   // 208
    methodArguments: [token],                                                    // 209
    userCallback: callback});                                                    // 210
};                                                                               // 211
                                                                                 // 212
///////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['accounts-password'] = {};

})();

//# sourceMappingURL=ac8c40c4c138f4f3e5e37ac0f28ebcd5d4949f31.map
