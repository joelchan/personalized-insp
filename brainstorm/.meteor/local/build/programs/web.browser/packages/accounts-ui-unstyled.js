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
var Deps = Package.deps.Deps;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;
var Accounts = Package['accounts-base'].Accounts;
var _ = Package.underscore._;
var Template = Package.templating.Template;
var Session = Package.session.Session;
var UI = Package.ui.UI;
var Handlebars = Package.ui.Handlebars;
var HTML = Package.htmljs.HTML;
var Blaze = Package.blaze.Blaze;

/* Package-scope variables */
var passwordSignupFields, displayName, getLoginServices, hasPasswordService, dropdown, validateUsername, validateEmail, validatePassword;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-unstyled/accounts_ui.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Accounts.ui = {};                                                                                                      // 1
                                                                                                                       // 2
Accounts.ui._options = {                                                                                               // 3
  requestPermissions: {},                                                                                              // 4
  requestOfflineToken: {},                                                                                             // 5
  forceApprovalPrompt: {}                                                                                              // 6
};                                                                                                                     // 7
                                                                                                                       // 8
// XXX refactor duplicated code in this function                                                                       // 9
Accounts.ui.config = function(options) {                                                                               // 10
  // validate options keys                                                                                             // 11
  var VALID_KEYS = ['passwordSignupFields', 'requestPermissions', 'requestOfflineToken', 'forceApprovalPrompt'];       // 12
  _.each(_.keys(options), function (key) {                                                                             // 13
    if (!_.contains(VALID_KEYS, key))                                                                                  // 14
      throw new Error("Accounts.ui.config: Invalid key: " + key);                                                      // 15
  });                                                                                                                  // 16
                                                                                                                       // 17
  // deal with `passwordSignupFields`                                                                                  // 18
  if (options.passwordSignupFields) {                                                                                  // 19
    if (_.contains([                                                                                                   // 20
      "USERNAME_AND_EMAIL",                                                                                            // 21
      "USERNAME_AND_OPTIONAL_EMAIL",                                                                                   // 22
      "USERNAME_ONLY",                                                                                                 // 23
      "EMAIL_ONLY"                                                                                                     // 24
    ], options.passwordSignupFields)) {                                                                                // 25
      if (Accounts.ui._options.passwordSignupFields)                                                                   // 26
        throw new Error("Accounts.ui.config: Can't set `passwordSignupFields` more than once");                        // 27
      else                                                                                                             // 28
        Accounts.ui._options.passwordSignupFields = options.passwordSignupFields;                                      // 29
    } else {                                                                                                           // 30
      throw new Error("Accounts.ui.config: Invalid option for `passwordSignupFields`: " + options.passwordSignupFields);
    }                                                                                                                  // 32
  }                                                                                                                    // 33
                                                                                                                       // 34
  // deal with `requestPermissions`                                                                                    // 35
  if (options.requestPermissions) {                                                                                    // 36
    _.each(options.requestPermissions, function (scope, service) {                                                     // 37
      if (Accounts.ui._options.requestPermissions[service]) {                                                          // 38
        throw new Error("Accounts.ui.config: Can't set `requestPermissions` more than once for " + service);           // 39
      } else if (!(scope instanceof Array)) {                                                                          // 40
        throw new Error("Accounts.ui.config: Value for `requestPermissions` must be an array");                        // 41
      } else {                                                                                                         // 42
        Accounts.ui._options.requestPermissions[service] = scope;                                                      // 43
      }                                                                                                                // 44
    });                                                                                                                // 45
  }                                                                                                                    // 46
                                                                                                                       // 47
  // deal with `requestOfflineToken`                                                                                   // 48
  if (options.requestOfflineToken) {                                                                                   // 49
    _.each(options.requestOfflineToken, function (value, service) {                                                    // 50
      if (service !== 'google')                                                                                        // 51
        throw new Error("Accounts.ui.config: `requestOfflineToken` only supported for Google login at the moment.");   // 52
                                                                                                                       // 53
      if (Accounts.ui._options.requestOfflineToken[service]) {                                                         // 54
        throw new Error("Accounts.ui.config: Can't set `requestOfflineToken` more than once for " + service);          // 55
      } else {                                                                                                         // 56
        Accounts.ui._options.requestOfflineToken[service] = value;                                                     // 57
      }                                                                                                                // 58
    });                                                                                                                // 59
  }                                                                                                                    // 60
                                                                                                                       // 61
  // deal with `forceApprovalPrompt`                                                                                   // 62
  if (options.forceApprovalPrompt) {                                                                                   // 63
    _.each(options.forceApprovalPrompt, function (value, service) {                                                    // 64
      if (service !== 'google')                                                                                        // 65
        throw new Error("Accounts.ui.config: `forceApprovalPrompt` only supported for Google login at the moment.");   // 66
                                                                                                                       // 67
      if (Accounts.ui._options.forceApprovalPrompt[service]) {                                                         // 68
        throw new Error("Accounts.ui.config: Can't set `forceApprovalPrompt` more than once for " + service);          // 69
      } else {                                                                                                         // 70
        Accounts.ui._options.forceApprovalPrompt[service] = value;                                                     // 71
      }                                                                                                                // 72
    });                                                                                                                // 73
  }                                                                                                                    // 74
};                                                                                                                     // 75
                                                                                                                       // 76
passwordSignupFields = function () {                                                                                   // 77
  return Accounts.ui._options.passwordSignupFields || "EMAIL_ONLY";                                                    // 78
};                                                                                                                     // 79
                                                                                                                       // 80
                                                                                                                       // 81
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-unstyled/template.login_buttons.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__define__("loginButtons", (function() {                                                                      // 2
  var view = this;                                                                                                     // 3
  return HTML.DIV({                                                                                                    // 4
    id: "login-buttons",                                                                                               // 5
    "class": function() {                                                                                              // 6
      return [ "login-buttons-dropdown-align-", Spacebars.mustache(view.lookup("align")) ];                            // 7
    }                                                                                                                  // 8
  }, "\n    ", Blaze.If(function() {                                                                                   // 9
    return Spacebars.call(view.lookup("currentUser"));                                                                 // 10
  }, function() {                                                                                                      // 11
    return [ "\n      ", Blaze.If(function() {                                                                         // 12
      return Spacebars.call(view.lookup("loggingIn"));                                                                 // 13
    }, function() {                                                                                                    // 14
      return [ "\n        \n        ", Blaze.If(function() {                                                           // 15
        return Spacebars.call(view.lookup("dropdown"));                                                                // 16
      }, function() {                                                                                                  // 17
        return [ "\n          ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggingIn")), "\n        " ];     // 18
      }, function() {                                                                                                  // 19
        return [ "\n          ", HTML.DIV({                                                                            // 20
          "class": "login-buttons-with-only-one-button"                                                                // 21
        }, "\n            ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggingInSingleLoginButton")), "\n          "), "\n        " ];
      }), "\n      " ];                                                                                                // 23
    }, function() {                                                                                                    // 24
      return [ "\n        ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedIn")), "\n      " ];            // 25
    }), "\n    " ];                                                                                                    // 26
  }, function() {                                                                                                      // 27
    return [ "\n      ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedOut")), "\n    " ];                 // 28
  }), "\n  ");                                                                                                         // 29
}));                                                                                                                   // 30
                                                                                                                       // 31
Template.__define__("_loginButtonsLoggedIn", (function() {                                                             // 32
  var view = this;                                                                                                     // 33
  return Blaze.If(function() {                                                                                         // 34
    return Spacebars.call(view.lookup("dropdown"));                                                                    // 35
  }, function() {                                                                                                      // 36
    return [ "\n    ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedInDropdown")), "\n  " ];              // 37
  }, function() {                                                                                                      // 38
    return [ "\n    ", HTML.DIV({                                                                                      // 39
      "class": "login-buttons-with-only-one-button"                                                                    // 40
    }, "\n      ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedInSingleLogoutButton")), "\n    "), "\n  " ];
  });                                                                                                                  // 42
}));                                                                                                                   // 43
                                                                                                                       // 44
Template.__define__("_loginButtonsLoggedOut", (function() {                                                            // 45
  var view = this;                                                                                                     // 46
  return Blaze.If(function() {                                                                                         // 47
    return Spacebars.call(view.lookup("services"));                                                                    // 48
  }, function() {                                                                                                      // 49
    return [ " \n    ", Blaze.If(function() {                                                                          // 50
      return Spacebars.call(view.lookup("configurationLoaded"));                                                       // 51
    }, function() {                                                                                                    // 52
      return [ "\n      ", Blaze.If(function() {                                                                       // 53
        return Spacebars.call(view.lookup("dropdown"));                                                                // 54
      }, function() {                                                                                                  // 55
        return [ " \n        ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedOutDropdown")), "\n      " ];
      }, function() {                                                                                                  // 57
        return [ "\n        ", Spacebars.With(function() {                                                             // 58
          return Spacebars.call(view.lookup("singleService"));                                                         // 59
        }, function() {                                                                                                // 60
          return [ " \n          ", HTML.DIV({                                                                         // 61
            "class": "login-buttons-with-only-one-button"                                                              // 62
          }, "\n            ", Blaze.If(function() {                                                                   // 63
            return Spacebars.call(view.lookup("loggingIn"));                                                           // 64
          }, function() {                                                                                              // 65
            return [ "\n              ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggingInSingleLoginButton")), "\n            " ];
          }, function() {                                                                                              // 67
            return [ "\n              ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedOutSingleLoginButton")), "\n            " ];
          }), "\n          "), "\n        " ];                                                                         // 69
        }), "\n      " ];                                                                                              // 70
      }), "\n    " ];                                                                                                  // 71
    }), "\n  " ];                                                                                                      // 72
  }, function() {                                                                                                      // 73
    return [ "\n    ", HTML.DIV({                                                                                      // 74
      "class": "no-services"                                                                                           // 75
    }, "No login services configured"), "\n  " ];                                                                      // 76
  });                                                                                                                  // 77
}));                                                                                                                   // 78
                                                                                                                       // 79
Template.__define__("_loginButtonsMessages", (function() {                                                             // 80
  var view = this;                                                                                                     // 81
  return [ Blaze.If(function() {                                                                                       // 82
    return Spacebars.call(view.lookup("errorMessage"));                                                                // 83
  }, function() {                                                                                                      // 84
    return [ "\n    ", HTML.DIV({                                                                                      // 85
      "class": "message error-message"                                                                                 // 86
    }, Blaze.View(function() {                                                                                         // 87
      return Spacebars.mustache(view.lookup("errorMessage"));                                                          // 88
    })), "\n  " ];                                                                                                     // 89
  }), "\n  ", Blaze.If(function() {                                                                                    // 90
    return Spacebars.call(view.lookup("infoMessage"));                                                                 // 91
  }, function() {                                                                                                      // 92
    return [ "\n    ", HTML.DIV({                                                                                      // 93
      "class": "message info-message"                                                                                  // 94
    }, Blaze.View(function() {                                                                                         // 95
      return Spacebars.mustache(view.lookup("infoMessage"));                                                           // 96
    })), "\n  " ];                                                                                                     // 97
  }) ];                                                                                                                // 98
}));                                                                                                                   // 99
                                                                                                                       // 100
Template.__define__("_loginButtonsLoggingIn", (function() {                                                            // 101
  var view = this;                                                                                                     // 102
  return [ Spacebars.include(view.lookupTemplate("_loginButtonsLoggingInPadding")), HTML.Raw('\n  <div class="loading">&nbsp;</div>\n  '), Spacebars.include(view.lookupTemplate("_loginButtonsLoggingInPadding")) ];
}));                                                                                                                   // 104
                                                                                                                       // 105
Template.__define__("_loginButtonsLoggingInPadding", (function() {                                                     // 106
  var view = this;                                                                                                     // 107
  return Blaze.Unless(function() {                                                                                     // 108
    return Spacebars.call(view.lookup("dropdown"));                                                                    // 109
  }, function() {                                                                                                      // 110
    return [ "\n    \n    ", HTML.DIV({                                                                                // 111
      "class": "login-buttons-padding"                                                                                 // 112
    }, "\n      ", HTML.DIV({                                                                                          // 113
      "class": "login-button single-login-button",                                                                     // 114
      style: "visibility: hidden;",                                                                                    // 115
      id: "login-buttons-logout"                                                                                       // 116
    }, HTML.CharRef({                                                                                                  // 117
      html: "&nbsp;",                                                                                                  // 118
      str: " "                                                                                                         // 119
    })), "\n    "), "\n  " ];                                                                                          // 120
  }, function() {                                                                                                      // 121
    return [ "\n    \n    ", HTML.DIV({                                                                                // 122
      "class": "login-buttons-padding"                                                                                 // 123
    }), "\n  " ];                                                                                                      // 124
  });                                                                                                                  // 125
}));                                                                                                                   // 126
                                                                                                                       // 127
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-unstyled/template.login_buttons_single.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__define__("_loginButtonsLoggedOutSingleLoginButton", (function() {                                           // 2
  var view = this;                                                                                                     // 3
  return HTML.DIV({                                                                                                    // 4
    "class": "login-text-and-button"                                                                                   // 5
  }, "\n    ", HTML.DIV({                                                                                              // 6
    "class": function() {                                                                                              // 7
      return [ "login-button single-login-button ", Blaze.Unless(function() {                                          // 8
        return Spacebars.call(view.lookup("configured"));                                                              // 9
      }, function() {                                                                                                  // 10
        return "configure-button";                                                                                     // 11
      }) ];                                                                                                            // 12
    },                                                                                                                 // 13
    id: function() {                                                                                                   // 14
      return [ "login-buttons-", Spacebars.mustache(view.lookup("name")) ];                                            // 15
    }                                                                                                                  // 16
  }, "\n      ", HTML.DIV({                                                                                            // 17
    "class": "login-image",                                                                                            // 18
    id: function() {                                                                                                   // 19
      return [ "login-buttons-image-", Spacebars.mustache(view.lookup("name")) ];                                      // 20
    }                                                                                                                  // 21
  }), "\n      ", Blaze.If(function() {                                                                                // 22
    return Spacebars.call(view.lookup("configured"));                                                                  // 23
  }, function() {                                                                                                      // 24
    return [ "\n        ", HTML.SPAN({                                                                                 // 25
      "class": function() {                                                                                            // 26
        return [ "text-besides-image sign-in-text-", Spacebars.mustache(view.lookup("name")) ];                        // 27
      }                                                                                                                // 28
    }, "Sign in with ", Blaze.View(function() {                                                                        // 29
      return Spacebars.mustache(view.lookup("capitalizedName"));                                                       // 30
    })), "\n      " ];                                                                                                 // 31
  }, function() {                                                                                                      // 32
    return [ "\n        ", HTML.SPAN({                                                                                 // 33
      "class": function() {                                                                                            // 34
        return [ "text-besides-image configure-text-", Spacebars.mustache(view.lookup("name")) ];                      // 35
      }                                                                                                                // 36
    }, "Configure ", Blaze.View(function() {                                                                           // 37
      return Spacebars.mustache(view.lookup("capitalizedName"));                                                       // 38
    }), " Login"), "\n      " ];                                                                                       // 39
  }), "\n    "), "\n  ");                                                                                              // 40
}));                                                                                                                   // 41
                                                                                                                       // 42
Template.__define__("_loginButtonsLoggingInSingleLoginButton", (function() {                                           // 43
  var view = this;                                                                                                     // 44
  return HTML.DIV({                                                                                                    // 45
    "class": "login-text-and-button"                                                                                   // 46
  }, "\n    ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggingIn")), "\n  ");                              // 47
}));                                                                                                                   // 48
                                                                                                                       // 49
Template.__define__("_loginButtonsLoggedInSingleLogoutButton", (function() {                                           // 50
  var view = this;                                                                                                     // 51
  return HTML.DIV({                                                                                                    // 52
    "class": "login-text-and-button"                                                                                   // 53
  }, "\n    ", HTML.DIV({                                                                                              // 54
    "class": "login-display-name"                                                                                      // 55
  }, "\n      ", Blaze.View(function() {                                                                               // 56
    return Spacebars.mustache(view.lookup("displayName"));                                                             // 57
  }), "\n    "), HTML.Raw('\n    <div class="login-button single-login-button" id="login-buttons-logout">Sign Out</div>\n  '));
}));                                                                                                                   // 59
                                                                                                                       // 60
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-unstyled/template.login_buttons_dropdown.js                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__define__("_loginButtonsLoggedInDropdown", (function() {                                                     // 2
  var view = this;                                                                                                     // 3
  return HTML.DIV({                                                                                                    // 4
    "class": "login-link-and-dropdown-list"                                                                            // 5
  }, "\n    ", HTML.A({                                                                                                // 6
    "class": "login-link-text",                                                                                        // 7
    id: "login-name-link"                                                                                              // 8
  }, "\n      ", Blaze.View(function() {                                                                               // 9
    return Spacebars.mustache(view.lookup("displayName"));                                                             // 10
  }), " ▾\n    "), "\n\n    ", Blaze.If(function() {                                                                   // 11
    return Spacebars.call(view.lookup("dropdownVisible"));                                                             // 12
  }, function() {                                                                                                      // 13
    return [ "\n      ", HTML.DIV({                                                                                    // 14
      id: "login-dropdown-list",                                                                                       // 15
      "class": "accounts-dialog"                                                                                       // 16
    }, "\n        ", HTML.A({                                                                                          // 17
      "class": "login-close-text"                                                                                      // 18
    }, "Close"), "\n        ", HTML.DIV({                                                                              // 19
      "class": "login-close-text-clear"                                                                                // 20
    }), "\n\n        ", Blaze.If(function() {                                                                          // 21
      return Spacebars.call(view.lookup("inMessageOnlyFlow"));                                                         // 22
    }, function() {                                                                                                    // 23
      return [ "\n          ", Spacebars.include(view.lookupTemplate("_loginButtonsMessages")), "\n        " ];        // 24
    }, function() {                                                                                                    // 25
      return [ "\n          ", Blaze.If(function() {                                                                   // 26
        return Spacebars.call(view.lookup("inChangePasswordFlow"));                                                    // 27
      }, function() {                                                                                                  // 28
        return [ "\n            ", Spacebars.include(view.lookupTemplate("_loginButtonsChangePassword")), "\n          " ];
      }, function() {                                                                                                  // 30
        return [ "\n            ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedInDropdownActions")), "\n          " ];
      }), "\n        " ];                                                                                              // 32
    }), "\n      "), "\n    " ];                                                                                       // 33
  }), "\n  ");                                                                                                         // 34
}));                                                                                                                   // 35
                                                                                                                       // 36
Template.__define__("_loginButtonsLoggedInDropdownActions", (function() {                                              // 37
  var view = this;                                                                                                     // 38
  return [ Blaze.If(function() {                                                                                       // 39
    return Spacebars.call(view.lookup("allowChangingPassword"));                                                       // 40
  }, function() {                                                                                                      // 41
    return [ "\n    ", HTML.DIV({                                                                                      // 42
      "class": "login-button",                                                                                         // 43
      id: "login-buttons-open-change-password"                                                                         // 44
    }, "\n      Change password\n    "), "\n  " ];                                                                     // 45
  }), HTML.Raw('\n\n  <div class="login-button" id="login-buttons-logout">\n    Sign out\n  </div>\n\n  '), Spacebars.include(view.lookupTemplate("_loginButtonsMessages")) ];
}));                                                                                                                   // 47
                                                                                                                       // 48
Template.__define__("_loginButtonsLoggedOutDropdown", (function() {                                                    // 49
  var view = this;                                                                                                     // 50
  return HTML.DIV({                                                                                                    // 51
    "class": function() {                                                                                              // 52
      return [ "login-link-and-dropdown-list ", Spacebars.mustache(view.lookup("additionalClasses")) ];                // 53
    }                                                                                                                  // 54
  }, "\n    ", Blaze.If(function() {                                                                                   // 55
    return Spacebars.call(view.lookup("dropdownVisible"));                                                             // 56
  }, function() {                                                                                                      // 57
    return [ "\n      \n      ", HTML.A({                                                                              // 58
      "class": "login-link-text",                                                                                      // 59
      id: "login-sign-in-link"                                                                                         // 60
    }, "Sign in ▾"), "\n      ", HTML.DIV({                                                                            // 61
      id: "login-dropdown-list",                                                                                       // 62
      "class": "accounts-dialog"                                                                                       // 63
    }, "\n        ", HTML.A({                                                                                          // 64
      "class": "login-close-text"                                                                                      // 65
    }, "Close"), "\n        ", Blaze.If(function() {                                                                   // 66
      return Spacebars.call(view.lookup("loggingIn"));                                                                 // 67
    }, function() {                                                                                                    // 68
      return [ "\n          ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggingIn")), "\n        " ];       // 69
    }), "\n        ", HTML.DIV({                                                                                       // 70
      "class": "login-close-text-clear"                                                                                // 71
    }), "\n        ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedOutAllServices")), "\n      "), "\n    " ];
  }, function() {                                                                                                      // 73
    return [ "\n      ", Blaze.If(function() {                                                                         // 74
      return Spacebars.call(view.lookup("loggingIn"));                                                                 // 75
    }, function() {                                                                                                    // 76
      return [ "\n        \n        ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggingIn")), "\n      " ]; // 77
    }, function() {                                                                                                    // 78
      return [ "\n        ", HTML.A({                                                                                  // 79
        "class": "login-link-text",                                                                                    // 80
        id: "login-sign-in-link"                                                                                       // 81
      }, "Sign in ▾"), "\n      " ];                                                                                   // 82
    }), "\n    " ];                                                                                                    // 83
  }), "\n  ");                                                                                                         // 84
}));                                                                                                                   // 85
                                                                                                                       // 86
Template.__define__("_loginButtonsLoggedOutAllServices", (function() {                                                 // 87
  var view = this;                                                                                                     // 88
  return [ Blaze.Each(function() {                                                                                     // 89
    return Spacebars.call(view.lookup("services"));                                                                    // 90
  }, function() {                                                                                                      // 91
    return [ "\n    ", Blaze.If(function() {                                                                           // 92
      return Spacebars.call(view.lookup("isPasswordService"));                                                         // 93
    }, function() {                                                                                                    // 94
      return [ "\n      ", Blaze.If(function() {                                                                       // 95
        return Spacebars.call(view.lookup("hasOtherServices"));                                                        // 96
      }, function() {                                                                                                  // 97
        return [ " \n        ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedOutPasswordServiceSeparator")), "\n      " ];
      }), "\n      ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedOutPasswordService")), "\n    " ];     // 99
    }, function() {                                                                                                    // 100
      return [ "\n      ", Spacebars.include(view.lookupTemplate("_loginButtonsLoggedOutSingleLoginButton")), "\n    " ];
    }), "\n  " ];                                                                                                      // 102
  }), "\n\n  ", Blaze.Unless(function() {                                                                              // 103
    return Spacebars.call(view.lookup("hasPasswordService"));                                                          // 104
  }, function() {                                                                                                      // 105
    return [ "\n    ", Spacebars.include(view.lookupTemplate("_loginButtonsMessages")), "\n  " ];                      // 106
  }) ];                                                                                                                // 107
}));                                                                                                                   // 108
                                                                                                                       // 109
Template.__define__("_loginButtonsLoggedOutPasswordServiceSeparator", (function() {                                    // 110
  var view = this;                                                                                                     // 111
  return HTML.Raw('<div class="or">\n    <span class="hline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>\n    <span class="or-text">or</span>\n    <span class="hline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>\n  </div>');
}));                                                                                                                   // 113
                                                                                                                       // 114
Template.__define__("_loginButtonsLoggedOutPasswordService", (function() {                                             // 115
  var view = this;                                                                                                     // 116
  return Blaze.If(function() {                                                                                         // 117
    return Spacebars.call(view.lookup("inForgotPasswordFlow"));                                                        // 118
  }, function() {                                                                                                      // 119
    return [ "\n    ", Spacebars.include(view.lookupTemplate("_forgotPasswordForm")), "\n  " ];                        // 120
  }, function() {                                                                                                      // 121
    return [ "\n    ", HTML.DIV({                                                                                      // 122
      "class": "login-form login-password-form"                                                                        // 123
    }, "\n      ", Blaze.Each(function() {                                                                             // 124
      return Spacebars.call(view.lookup("fields"));                                                                    // 125
    }, function() {                                                                                                    // 126
      return [ "\n        ", Spacebars.include(view.lookupTemplate("_loginButtonsFormField")), "\n      " ];           // 127
    }), "\n\n      ", Spacebars.include(view.lookupTemplate("_loginButtonsMessages")), "\n\n      ", HTML.DIV({        // 128
      "class": "login-button login-button-form-submit",                                                                // 129
      id: "login-buttons-password"                                                                                     // 130
    }, "\n        ", Blaze.If(function() {                                                                             // 131
      return Spacebars.call(view.lookup("inSignupFlow"));                                                              // 132
    }, function() {                                                                                                    // 133
      return "\n          Create account\n        ";                                                                   // 134
    }, function() {                                                                                                    // 135
      return "\n          Sign in\n        ";                                                                          // 136
    }), "\n      "), "\n\n      ", Blaze.If(function() {                                                               // 137
      return Spacebars.call(view.lookup("inLoginFlow"));                                                               // 138
    }, function() {                                                                                                    // 139
      return [ "\n        ", Blaze.If(function() {                                                                     // 140
        return Spacebars.call(view.lookup("showCreateAccountLink"));                                                   // 141
      }, function() {                                                                                                  // 142
        return [ "\n          ", HTML.DIV({                                                                            // 143
          "class": "additional-link-container"                                                                         // 144
        }, "\n            ", HTML.A({                                                                                  // 145
          id: "signup-link",                                                                                           // 146
          "class": "additional-link"                                                                                   // 147
        }, "Create account"), "\n          "), "\n        " ];                                                         // 148
      }), "\n\n        ", Blaze.If(function() {                                                                        // 149
        return Spacebars.call(view.lookup("showForgotPasswordLink"));                                                  // 150
      }, function() {                                                                                                  // 151
        return [ "\n          ", HTML.DIV({                                                                            // 152
          "class": "additional-link-container"                                                                         // 153
        }, "\n            ", HTML.A({                                                                                  // 154
          id: "forgot-password-link",                                                                                  // 155
          "class": "additional-link"                                                                                   // 156
        }, "Forgot password"), "\n          "), "\n        " ];                                                        // 157
      }), "\n      " ];                                                                                                // 158
    }), "\n\n      ", Blaze.If(function() {                                                                            // 159
      return Spacebars.call(view.lookup("inSignupFlow"));                                                              // 160
    }, function() {                                                                                                    // 161
      return [ "\n        ", Spacebars.include(view.lookupTemplate("_loginButtonsBackToLoginLink")), "\n      " ];     // 162
    }), "\n    "), "\n  " ];                                                                                           // 163
  });                                                                                                                  // 164
}));                                                                                                                   // 165
                                                                                                                       // 166
Template.__define__("_forgotPasswordForm", (function() {                                                               // 167
  var view = this;                                                                                                     // 168
  return HTML.DIV({                                                                                                    // 169
    "class": "login-form"                                                                                              // 170
  }, HTML.Raw('\n    <div id="forgot-password-email-label-and-input"> \n      <label id="forgot-password-email-label" for="forgot-password-email">Email</label>\n      <input id="forgot-password-email" type="email">\n    </div>\n\n    '), Spacebars.include(view.lookupTemplate("_loginButtonsMessages")), HTML.Raw('\n\n    <div class="login-button login-button-form-submit" id="login-buttons-forgot-password">\n      Reset password\n    </div>\n\n    '), Spacebars.include(view.lookupTemplate("_loginButtonsBackToLoginLink")), "\n  ");
}));                                                                                                                   // 172
                                                                                                                       // 173
Template.__define__("_loginButtonsBackToLoginLink", (function() {                                                      // 174
  var view = this;                                                                                                     // 175
  return HTML.Raw('<div class="additional-link-container">\n    <a id="back-to-login-link" class="additional-link">Sign in</a>\n  </div>');
}));                                                                                                                   // 177
                                                                                                                       // 178
Template.__define__("_loginButtonsFormField", (function() {                                                            // 179
  var view = this;                                                                                                     // 180
  return Blaze.If(function() {                                                                                         // 181
    return Spacebars.call(view.lookup("visible"));                                                                     // 182
  }, function() {                                                                                                      // 183
    return [ "\n    ", HTML.DIV({                                                                                      // 184
      id: function() {                                                                                                 // 185
        return [ "login-", Spacebars.mustache(view.lookup("fieldName")), "-label-and-input" ];                         // 186
      }                                                                                                                // 187
    }, "\n      ", HTML.LABEL({                                                                                        // 188
      id: function() {                                                                                                 // 189
        return [ "login-", Spacebars.mustache(view.lookup("fieldName")), "-label" ];                                   // 190
      },                                                                                                               // 191
      "for": function() {                                                                                              // 192
        return [ "login-", Spacebars.mustache(view.lookup("fieldName")) ];                                             // 193
      }                                                                                                                // 194
    }, "\n        ", Blaze.View(function() {                                                                           // 195
      return Spacebars.mustache(view.lookup("fieldLabel"));                                                            // 196
    }), "\n      "), "\n      ", HTML.INPUT({                                                                          // 197
      id: function() {                                                                                                 // 198
        return [ "login-", Spacebars.mustache(view.lookup("fieldName")) ];                                             // 199
      },                                                                                                               // 200
      type: function() {                                                                                               // 201
        return Spacebars.mustache(view.lookup("inputType"));                                                           // 202
      }                                                                                                                // 203
    }), "\n    "), "\n  " ];                                                                                           // 204
  });                                                                                                                  // 205
}));                                                                                                                   // 206
                                                                                                                       // 207
Template.__define__("_loginButtonsChangePassword", (function() {                                                       // 208
  var view = this;                                                                                                     // 209
  return [ Blaze.Each(function() {                                                                                     // 210
    return Spacebars.call(view.lookup("fields"));                                                                      // 211
  }, function() {                                                                                                      // 212
    return [ "\n    ", Spacebars.include(view.lookupTemplate("_loginButtonsFormField")), "\n  " ];                     // 213
  }), "\n\n  ", Spacebars.include(view.lookupTemplate("_loginButtonsMessages")), HTML.Raw('\n\n  <div class="login-button login-button-form-submit" id="login-buttons-do-change-password">\n    Change password\n  </div>') ];
}));                                                                                                                   // 215
                                                                                                                       // 216
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-unstyled/template.login_buttons_dialogs.js                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__body__.__contentParts.push(Blaze.View('body_content_'+Template.__body__.__contentParts.length, (function() {
  var view = this;                                                                                                     // 3
  return [ Spacebars.include(view.lookupTemplate("_resetPasswordDialog")), "\n  ", Spacebars.include(view.lookupTemplate("_justResetPasswordDialog")), "\n  ", Spacebars.include(view.lookupTemplate("_enrollAccountDialog")), "\n  ", Spacebars.include(view.lookupTemplate("_justVerifiedEmailDialog")), "\n  ", Spacebars.include(view.lookupTemplate("_configureLoginServiceDialog")), HTML.Raw("\n\n  <!-- if we're not showing a dropdown, we need some other place to show messages -->\n  "), Spacebars.include(view.lookupTemplate("_loginButtonsMessagesDialog")) ];
})));                                                                                                                  // 5
Meteor.startup(Template.__body__.__instantiate);                                                                       // 6
                                                                                                                       // 7
Template.__define__("_resetPasswordDialog", (function() {                                                              // 8
  var view = this;                                                                                                     // 9
  return Blaze.If(function() {                                                                                         // 10
    return Spacebars.call(view.lookup("inResetPasswordFlow"));                                                         // 11
  }, function() {                                                                                                      // 12
    return [ "\n    ", HTML.DIV({                                                                                      // 13
      "class": "hide-background"                                                                                       // 14
    }), "\n\n    ", HTML.DIV({                                                                                         // 15
      "class": "accounts-dialog accounts-centered-dialog"                                                              // 16
    }, "\n      ", HTML.LABEL({                                                                                        // 17
      id: "reset-password-new-password-label",                                                                         // 18
      "for": "reset-password-new-password"                                                                             // 19
    }, "\n        New password\n      "), "\n\n      ", HTML.DIV({                                                     // 20
      "class": "reset-password-new-password-wrapper"                                                                   // 21
    }, "\n        ", HTML.INPUT({                                                                                      // 22
      id: "reset-password-new-password",                                                                               // 23
      type: "password"                                                                                                 // 24
    }), "\n      "), "\n\n      ", Spacebars.include(view.lookupTemplate("_loginButtonsMessages")), "\n\n      ", HTML.DIV({
      "class": "login-button login-button-form-submit",                                                                // 26
      id: "login-buttons-reset-password-button"                                                                        // 27
    }, "\n        Set password\n      "), "\n\n      ", HTML.A({                                                       // 28
      "class": "accounts-close",                                                                                       // 29
      id: "login-buttons-cancel-reset-password"                                                                        // 30
    }, HTML.CharRef({                                                                                                  // 31
      html: "&times;",                                                                                                 // 32
      str: "×"                                                                                                         // 33
    })), "\n    "), "\n  " ];                                                                                          // 34
  });                                                                                                                  // 35
}));                                                                                                                   // 36
                                                                                                                       // 37
Template.__define__("_justResetPasswordDialog", (function() {                                                          // 38
  var view = this;                                                                                                     // 39
  return Blaze.If(function() {                                                                                         // 40
    return Spacebars.call(view.lookup("visible"));                                                                     // 41
  }, function() {                                                                                                      // 42
    return [ "\n    ", HTML.DIV({                                                                                      // 43
      "class": "accounts-dialog accounts-centered-dialog"                                                              // 44
    }, "\n      Password reset.\n      You are now logged in as ", Blaze.View(function() {                             // 45
      return Spacebars.mustache(view.lookup("displayName"));                                                           // 46
    }), ".\n      ", HTML.DIV({                                                                                        // 47
      "class": "login-button",                                                                                         // 48
      id: "just-verified-dismiss-button"                                                                               // 49
    }, "Dismiss"), "\n    "), "\n  " ];                                                                                // 50
  });                                                                                                                  // 51
}));                                                                                                                   // 52
                                                                                                                       // 53
Template.__define__("_enrollAccountDialog", (function() {                                                              // 54
  var view = this;                                                                                                     // 55
  return Blaze.If(function() {                                                                                         // 56
    return Spacebars.call(view.lookup("inEnrollAccountFlow"));                                                         // 57
  }, function() {                                                                                                      // 58
    return [ "\n    ", HTML.DIV({                                                                                      // 59
      "class": "hide-background"                                                                                       // 60
    }), "\n\n    ", HTML.DIV({                                                                                         // 61
      "class": "accounts-dialog accounts-centered-dialog"                                                              // 62
    }, "\n      ", HTML.LABEL({                                                                                        // 63
      id: "enroll-account-password-label",                                                                             // 64
      "for": "enroll-account-password"                                                                                 // 65
    }, "\n        Choose a password\n      "), "\n\n      ", HTML.DIV({                                                // 66
      "class": "enroll-account-password-wrapper"                                                                       // 67
    }, "\n        ", HTML.INPUT({                                                                                      // 68
      id: "enroll-account-password",                                                                                   // 69
      type: "password"                                                                                                 // 70
    }), "\n      "), "\n\n      ", Spacebars.include(view.lookupTemplate("_loginButtonsMessages")), "\n\n      ", HTML.DIV({
      "class": "login-button login-button-form-submit",                                                                // 72
      id: "login-buttons-enroll-account-button"                                                                        // 73
    }, "\n        Create account\n      "), "\n\n      ", HTML.A({                                                     // 74
      "class": "accounts-close",                                                                                       // 75
      id: "login-buttons-cancel-enroll-account"                                                                        // 76
    }, HTML.CharRef({                                                                                                  // 77
      html: "&times;",                                                                                                 // 78
      str: "×"                                                                                                         // 79
    })), "\n    "), "\n  " ];                                                                                          // 80
  });                                                                                                                  // 81
}));                                                                                                                   // 82
                                                                                                                       // 83
Template.__define__("_justVerifiedEmailDialog", (function() {                                                          // 84
  var view = this;                                                                                                     // 85
  return Blaze.If(function() {                                                                                         // 86
    return Spacebars.call(view.lookup("visible"));                                                                     // 87
  }, function() {                                                                                                      // 88
    return [ "\n    ", HTML.DIV({                                                                                      // 89
      "class": "accounts-dialog accounts-centered-dialog"                                                              // 90
    }, "\n      Email verified.\n      You are now logged in as ", Blaze.View(function() {                             // 91
      return Spacebars.mustache(view.lookup("displayName"));                                                           // 92
    }), ".\n      ", HTML.DIV({                                                                                        // 93
      "class": "login-button",                                                                                         // 94
      id: "just-verified-dismiss-button"                                                                               // 95
    }, "Dismiss"), "\n    "), "\n  " ];                                                                                // 96
  });                                                                                                                  // 97
}));                                                                                                                   // 98
                                                                                                                       // 99
Template.__define__("_configureLoginServiceDialog", (function() {                                                      // 100
  var view = this;                                                                                                     // 101
  return Blaze.If(function() {                                                                                         // 102
    return Spacebars.call(view.lookup("visible"));                                                                     // 103
  }, function() {                                                                                                      // 104
    return [ "\n    ", HTML.DIV({                                                                                      // 105
      id: "configure-login-service-dialog",                                                                            // 106
      "class": "accounts-dialog accounts-centered-dialog"                                                              // 107
    }, "\n      ", Spacebars.include(view.lookupTemplate("configurationSteps")), "\n\n      ", HTML.P("\n        Now, copy over some details.\n      "), "\n      ", HTML.P("\n        ", HTML.TABLE("\n          ", HTML.COLGROUP("\n            ", HTML.COL({
      span: "1",                                                                                                       // 109
      "class": "configuration_labels"                                                                                  // 110
    }), "\n            ", HTML.COL({                                                                                   // 111
      span: "1",                                                                                                       // 112
      "class": "configuration_inputs"                                                                                  // 113
    }), "\n          "), "\n          ", Blaze.Each(function() {                                                       // 114
      return Spacebars.call(view.lookup("configurationFields"));                                                       // 115
    }, function() {                                                                                                    // 116
      return [ "\n            ", HTML.TR("\n              ", HTML.TD("\n                ", HTML.LABEL({                // 117
        "for": function() {                                                                                            // 118
          return [ "configure-login-service-dialog-", Spacebars.mustache(view.lookup("property")) ];                   // 119
        }                                                                                                              // 120
      }, Blaze.View(function() {                                                                                       // 121
        return Spacebars.mustache(view.lookup("label"));                                                               // 122
      })), "\n              "), "\n              ", HTML.TD("\n                ", HTML.INPUT({                         // 123
        id: function() {                                                                                               // 124
          return [ "configure-login-service-dialog-", Spacebars.mustache(view.lookup("property")) ];                   // 125
        },                                                                                                             // 126
        type: "text"                                                                                                   // 127
      }), "\n              "), "\n            "), "\n          " ];                                                    // 128
    }), "\n        "), "\n      "), "\n      ", HTML.DIV({                                                             // 129
      "class": "new-section"                                                                                           // 130
    }, "\n        ", HTML.DIV({                                                                                        // 131
      "class": "login-button configure-login-service-dismiss-button"                                                   // 132
    }, "\n          I'll do this later\n        "), "\n        ", HTML.A({                                             // 133
      "class": "accounts-close configure-login-service-dismiss-button"                                                 // 134
    }, HTML.CharRef({                                                                                                  // 135
      html: "&times;",                                                                                                 // 136
      str: "×"                                                                                                         // 137
    })), "\n\n        ", HTML.DIV({                                                                                    // 138
      "class": function() {                                                                                            // 139
        return [ "login-button login-button-configure ", Blaze.If(function() {                                         // 140
          return Spacebars.call(view.lookup("saveDisabled"));                                                          // 141
        }, function() {                                                                                                // 142
          return "login-button-disabled";                                                                              // 143
        }) ];                                                                                                          // 144
      },                                                                                                               // 145
      id: "configure-login-service-dialog-save-configuration"                                                          // 146
    }, "\n          Save Configuration\n        "), "\n      "), "\n    "), "\n  " ];                                  // 147
  });                                                                                                                  // 148
}));                                                                                                                   // 149
                                                                                                                       // 150
Template.__define__("_loginButtonsMessagesDialog", (function() {                                                       // 151
  var view = this;                                                                                                     // 152
  return Blaze.If(function() {                                                                                         // 153
    return Spacebars.call(view.lookup("visible"));                                                                     // 154
  }, function() {                                                                                                      // 155
    return [ "\n    ", HTML.DIV({                                                                                      // 156
      "class": "accounts-dialog accounts-centered-dialog",                                                             // 157
      id: "login-buttons-message-dialog"                                                                               // 158
    }, "\n      ", Spacebars.include(view.lookupTemplate("_loginButtonsMessages")), "\n      ", HTML.DIV({             // 159
      "class": "login-button",                                                                                         // 160
      id: "messages-dialog-dismiss-button"                                                                             // 161
    }, "Dismiss"), "\n    "), "\n  " ];                                                                                // 162
  });                                                                                                                  // 163
}));                                                                                                                   // 164
                                                                                                                       // 165
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-unstyled/login_buttons_session.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var VALID_KEYS = [                                                                                                     // 1
  'dropdownVisible',                                                                                                   // 2
                                                                                                                       // 3
  // XXX consider replacing these with one key that has an enum for values.                                            // 4
  'inSignupFlow',                                                                                                      // 5
  'inForgotPasswordFlow',                                                                                              // 6
  'inChangePasswordFlow',                                                                                              // 7
  'inMessageOnlyFlow',                                                                                                 // 8
                                                                                                                       // 9
  'errorMessage',                                                                                                      // 10
  'infoMessage',                                                                                                       // 11
                                                                                                                       // 12
  // dialogs with messages (info and error)                                                                            // 13
  'resetPasswordToken',                                                                                                // 14
  'enrollAccountToken',                                                                                                // 15
  'justVerifiedEmail',                                                                                                 // 16
  'justResetPassword',                                                                                                 // 17
                                                                                                                       // 18
  'configureLoginServiceDialogVisible',                                                                                // 19
  'configureLoginServiceDialogServiceName',                                                                            // 20
  'configureLoginServiceDialogSaveDisabled'                                                                            // 21
];                                                                                                                     // 22
                                                                                                                       // 23
var validateKey = function (key) {                                                                                     // 24
  if (!_.contains(VALID_KEYS, key))                                                                                    // 25
    throw new Error("Invalid key in loginButtonsSession: " + key);                                                     // 26
};                                                                                                                     // 27
                                                                                                                       // 28
var KEY_PREFIX = "Meteor.loginButtons.";                                                                               // 29
                                                                                                                       // 30
// XXX This should probably be package scope rather than exported                                                      // 31
// (there was even a comment to that effect here from before we had                                                    // 32
// namespacing) but accounts-ui-viewer uses it, so leave it as is for                                                  // 33
// now                                                                                                                 // 34
Accounts._loginButtonsSession = {                                                                                      // 35
  set: function(key, value) {                                                                                          // 36
    validateKey(key);                                                                                                  // 37
    if (_.contains(['errorMessage', 'infoMessage'], key))                                                              // 38
      throw new Error("Don't set errorMessage or infoMessage directly. Instead, use errorMessage() or infoMessage().");
                                                                                                                       // 40
    this._set(key, value);                                                                                             // 41
  },                                                                                                                   // 42
                                                                                                                       // 43
  _set: function(key, value) {                                                                                         // 44
    Session.set(KEY_PREFIX + key, value);                                                                              // 45
  },                                                                                                                   // 46
                                                                                                                       // 47
  get: function(key) {                                                                                                 // 48
    validateKey(key);                                                                                                  // 49
    return Session.get(KEY_PREFIX + key);                                                                              // 50
  },                                                                                                                   // 51
                                                                                                                       // 52
  closeDropdown: function () {                                                                                         // 53
    this.set('inSignupFlow', false);                                                                                   // 54
    this.set('inForgotPasswordFlow', false);                                                                           // 55
    this.set('inChangePasswordFlow', false);                                                                           // 56
    this.set('inMessageOnlyFlow', false);                                                                              // 57
    this.set('dropdownVisible', false);                                                                                // 58
    this.resetMessages();                                                                                              // 59
  },                                                                                                                   // 60
                                                                                                                       // 61
  infoMessage: function(message) {                                                                                     // 62
    this._set("errorMessage", null);                                                                                   // 63
    this._set("infoMessage", message);                                                                                 // 64
    this.ensureMessageVisible();                                                                                       // 65
  },                                                                                                                   // 66
                                                                                                                       // 67
  errorMessage: function(message) {                                                                                    // 68
    this._set("errorMessage", message);                                                                                // 69
    this._set("infoMessage", null);                                                                                    // 70
    this.ensureMessageVisible();                                                                                       // 71
  },                                                                                                                   // 72
                                                                                                                       // 73
  // is there a visible dialog that shows messages (info and error)                                                    // 74
  isMessageDialogVisible: function () {                                                                                // 75
    return this.get('resetPasswordToken') ||                                                                           // 76
      this.get('enrollAccountToken') ||                                                                                // 77
      this.get('justVerifiedEmail');                                                                                   // 78
  },                                                                                                                   // 79
                                                                                                                       // 80
  // ensure that somethings displaying a message (info or error) is                                                    // 81
  // visible.  if a dialog with messages is open, do nothing;                                                          // 82
  // otherwise open the dropdown.                                                                                      // 83
  //                                                                                                                   // 84
  // notably this doesn't matter when only displaying a single login                                                   // 85
  // button since then we have an explicit message dialog                                                              // 86
  // (_loginButtonsMessageDialog), and dropdownVisible is ignored in                                                   // 87
  // this case.                                                                                                        // 88
  ensureMessageVisible: function () {                                                                                  // 89
    if (!this.isMessageDialogVisible())                                                                                // 90
      this.set("dropdownVisible", true);                                                                               // 91
  },                                                                                                                   // 92
                                                                                                                       // 93
  resetMessages: function () {                                                                                         // 94
    this._set("errorMessage", null);                                                                                   // 95
    this._set("infoMessage", null);                                                                                    // 96
  },                                                                                                                   // 97
                                                                                                                       // 98
  configureService: function (name) {                                                                                  // 99
    this.set('configureLoginServiceDialogVisible', true);                                                              // 100
    this.set('configureLoginServiceDialogServiceName', name);                                                          // 101
    this.set('configureLoginServiceDialogSaveDisabled', true);                                                         // 102
  }                                                                                                                    // 103
};                                                                                                                     // 104
                                                                                                                       // 105
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-unstyled/login_buttons.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// for convenience                                                                                                     // 1
var loginButtonsSession = Accounts._loginButtonsSession;                                                               // 2
                                                                                                                       // 3
// shared between dropdown and single mode                                                                             // 4
Template.loginButtons.events({                                                                                         // 5
  'click #login-buttons-logout': function() {                                                                          // 6
    Meteor.logout(function () {                                                                                        // 7
      loginButtonsSession.closeDropdown();                                                                             // 8
    });                                                                                                                // 9
  }                                                                                                                    // 10
});                                                                                                                    // 11
                                                                                                                       // 12
UI.registerHelper('loginButtons', function () {                                                                        // 13
  throw new Error("Use {{> loginButtons}} instead of {{loginButtons}}");                                               // 14
});                                                                                                                    // 15
                                                                                                                       // 16
//                                                                                                                     // 17
// helpers                                                                                                             // 18
//                                                                                                                     // 19
                                                                                                                       // 20
displayName = function () {                                                                                            // 21
  var user = Meteor.user();                                                                                            // 22
  if (!user)                                                                                                           // 23
    return '';                                                                                                         // 24
                                                                                                                       // 25
  if (user.profile && user.profile.name)                                                                               // 26
    return user.profile.name;                                                                                          // 27
  if (user.username)                                                                                                   // 28
    return user.username;                                                                                              // 29
  if (user.emails && user.emails[0] && user.emails[0].address)                                                         // 30
    return user.emails[0].address;                                                                                     // 31
                                                                                                                       // 32
  return '';                                                                                                           // 33
};                                                                                                                     // 34
                                                                                                                       // 35
// returns an array of the login services used by this app. each                                                       // 36
// element of the array is an object (eg {name: 'facebook'}), since                                                    // 37
// that makes it useful in combination with handlebars {{#each}}.                                                      // 38
//                                                                                                                     // 39
// don't cache the output of this function: if called during startup (before                                           // 40
// oauth packages load) it might not include them all.                                                                 // 41
//                                                                                                                     // 42
// NOTE: It is very important to have this return password last                                                        // 43
// because of the way we render the different providers in                                                             // 44
// login_buttons_dropdown.html                                                                                         // 45
getLoginServices = function () {                                                                                       // 46
  var self = this;                                                                                                     // 47
                                                                                                                       // 48
  // First look for OAuth services.                                                                                    // 49
  var services = Package['accounts-oauth'] ? Accounts.oauth.serviceNames() : [];                                       // 50
                                                                                                                       // 51
  // Be equally kind to all login services. This also preserves                                                        // 52
  // backwards-compatibility. (But maybe order should be                                                               // 53
  // configurable?)                                                                                                    // 54
  services.sort();                                                                                                     // 55
                                                                                                                       // 56
  // Add password, if it's there; it must come last.                                                                   // 57
  if (hasPasswordService())                                                                                            // 58
    services.push('password');                                                                                         // 59
                                                                                                                       // 60
  return _.map(services, function(name) {                                                                              // 61
    return {name: name};                                                                                               // 62
  });                                                                                                                  // 63
};                                                                                                                     // 64
                                                                                                                       // 65
hasPasswordService = function () {                                                                                     // 66
  return !!Package['accounts-password'];                                                                               // 67
};                                                                                                                     // 68
                                                                                                                       // 69
dropdown = function () {                                                                                               // 70
  return hasPasswordService() || getLoginServices().length > 1;                                                        // 71
};                                                                                                                     // 72
                                                                                                                       // 73
// XXX improve these. should this be in accounts-password instead?                                                     // 74
//                                                                                                                     // 75
// XXX these will become configurable, and will be validated on                                                        // 76
// the server as well.                                                                                                 // 77
validateUsername = function (username) {                                                                               // 78
  if (username.length >= 3) {                                                                                          // 79
    return true;                                                                                                       // 80
  } else {                                                                                                             // 81
    loginButtonsSession.errorMessage("Username must be at least 3 characters long");                                   // 82
    return false;                                                                                                      // 83
  }                                                                                                                    // 84
};                                                                                                                     // 85
validateEmail = function (email) {                                                                                     // 86
  if (passwordSignupFields() === "USERNAME_AND_OPTIONAL_EMAIL" && email === '')                                        // 87
    return true;                                                                                                       // 88
                                                                                                                       // 89
  if (email.indexOf('@') !== -1) {                                                                                     // 90
    return true;                                                                                                       // 91
  } else {                                                                                                             // 92
    loginButtonsSession.errorMessage("Invalid email");                                                                 // 93
    return false;                                                                                                      // 94
  }                                                                                                                    // 95
};                                                                                                                     // 96
validatePassword = function (password) {                                                                               // 97
  if (password.length >= 6) {                                                                                          // 98
    return true;                                                                                                       // 99
  } else {                                                                                                             // 100
    loginButtonsSession.errorMessage("Password must be at least 6 characters long");                                   // 101
    return false;                                                                                                      // 102
  }                                                                                                                    // 103
};                                                                                                                     // 104
                                                                                                                       // 105
//                                                                                                                     // 106
// loginButtonLoggedOut template                                                                                       // 107
//                                                                                                                     // 108
                                                                                                                       // 109
Template._loginButtonsLoggedOut.dropdown = dropdown;                                                                   // 110
                                                                                                                       // 111
Template._loginButtonsLoggedOut.services = getLoginServices;                                                           // 112
                                                                                                                       // 113
Template._loginButtonsLoggedOut.singleService = function () {                                                          // 114
  var services = getLoginServices();                                                                                   // 115
  if (services.length !== 1)                                                                                           // 116
    throw new Error(                                                                                                   // 117
      "Shouldn't be rendering this template with more than one configured service");                                   // 118
  return services[0];                                                                                                  // 119
};                                                                                                                     // 120
                                                                                                                       // 121
Template._loginButtonsLoggedOut.configurationLoaded = function () {                                                    // 122
  return Accounts.loginServicesConfigured();                                                                           // 123
};                                                                                                                     // 124
                                                                                                                       // 125
                                                                                                                       // 126
//                                                                                                                     // 127
// loginButtonsLoggedIn template                                                                                       // 128
//                                                                                                                     // 129
                                                                                                                       // 130
// decide whether we should show a dropdown rather than a row of                                                       // 131
// buttons                                                                                                             // 132
Template._loginButtonsLoggedIn.dropdown = dropdown;                                                                    // 133
                                                                                                                       // 134
                                                                                                                       // 135
                                                                                                                       // 136
//                                                                                                                     // 137
// loginButtonsLoggedInSingleLogoutButton template                                                                     // 138
//                                                                                                                     // 139
                                                                                                                       // 140
Template._loginButtonsLoggedInSingleLogoutButton.displayName = displayName;                                            // 141
                                                                                                                       // 142
                                                                                                                       // 143
                                                                                                                       // 144
//                                                                                                                     // 145
// loginButtonsMessage template                                                                                        // 146
//                                                                                                                     // 147
                                                                                                                       // 148
Template._loginButtonsMessages.errorMessage = function () {                                                            // 149
  return loginButtonsSession.get('errorMessage');                                                                      // 150
};                                                                                                                     // 151
                                                                                                                       // 152
Template._loginButtonsMessages.infoMessage = function () {                                                             // 153
  return loginButtonsSession.get('infoMessage');                                                                       // 154
};                                                                                                                     // 155
                                                                                                                       // 156
                                                                                                                       // 157
//                                                                                                                     // 158
// loginButtonsLoggingInPadding template                                                                               // 159
//                                                                                                                     // 160
                                                                                                                       // 161
Template._loginButtonsLoggingInPadding.dropdown = dropdown;                                                            // 162
                                                                                                                       // 163
                                                                                                                       // 164
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-unstyled/login_buttons_single.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// for convenience                                                                                                     // 1
var loginButtonsSession = Accounts._loginButtonsSession;                                                               // 2
                                                                                                                       // 3
Template._loginButtonsLoggedOutSingleLoginButton.events({                                                              // 4
  'click .login-button': function () {                                                                                 // 5
    var serviceName = this.name;                                                                                       // 6
    loginButtonsSession.resetMessages();                                                                               // 7
    var callback = function (err) {                                                                                    // 8
      if (!err) {                                                                                                      // 9
        loginButtonsSession.closeDropdown();                                                                           // 10
      } else if (err instanceof Accounts.LoginCancelledError) {                                                        // 11
        // do nothing                                                                                                  // 12
      } else if (err instanceof ServiceConfiguration.ConfigError) {                                                    // 13
        loginButtonsSession.configureService(serviceName);                                                             // 14
      } else {                                                                                                         // 15
        loginButtonsSession.errorMessage(err.reason || "Unknown error");                                               // 16
      }                                                                                                                // 17
    };                                                                                                                 // 18
                                                                                                                       // 19
    // XXX Service providers should be able to specify their                                                           // 20
    // `Meteor.loginWithX` method name.                                                                                // 21
    var loginWithService = Meteor["loginWith" +                                                                        // 22
                                  (serviceName === 'meteor-developer' ?                                                // 23
                                   'MeteorDeveloperAccount' :                                                          // 24
                                   capitalize(serviceName))];                                                          // 25
                                                                                                                       // 26
    var options = {}; // use default scope unless specified                                                            // 27
    if (Accounts.ui._options.requestPermissions[serviceName])                                                          // 28
      options.requestPermissions = Accounts.ui._options.requestPermissions[serviceName];                               // 29
    if (Accounts.ui._options.requestOfflineToken[serviceName])                                                         // 30
      options.requestOfflineToken = Accounts.ui._options.requestOfflineToken[serviceName];                             // 31
    if (Accounts.ui._options.forceApprovalPrompt[serviceName])                                                         // 32
      options.forceApprovalPrompt = Accounts.ui._options.forceApprovalPrompt[serviceName];                             // 33
                                                                                                                       // 34
    loginWithService(options, callback);                                                                               // 35
  }                                                                                                                    // 36
});                                                                                                                    // 37
                                                                                                                       // 38
Template._loginButtonsLoggedOutSingleLoginButton.configured = function () {                                            // 39
  return !!ServiceConfiguration.configurations.findOne({service: this.name});                                          // 40
};                                                                                                                     // 41
                                                                                                                       // 42
Template._loginButtonsLoggedOutSingleLoginButton.capitalizedName = function () {                                       // 43
  if (this.name === 'github')                                                                                          // 44
    // XXX we should allow service packages to set their capitalized name                                              // 45
    return 'GitHub';                                                                                                   // 46
  else if (this.name === 'meteor-developer')                                                                           // 47
    return 'Meteor';                                                                                                   // 48
  else                                                                                                                 // 49
    return capitalize(this.name);                                                                                      // 50
};                                                                                                                     // 51
                                                                                                                       // 52
// XXX from http://epeli.github.com/underscore.string/lib/underscore.string.js                                         // 53
var capitalize = function(str){                                                                                        // 54
  str = str == null ? '' : String(str);                                                                                // 55
  return str.charAt(0).toUpperCase() + str.slice(1);                                                                   // 56
};                                                                                                                     // 57
                                                                                                                       // 58
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-unstyled/login_buttons_dropdown.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// for convenience                                                                                                     // 1
var loginButtonsSession = Accounts._loginButtonsSession;                                                               // 2
                                                                                                                       // 3
// events shared between loginButtonsLoggedOutDropdown and                                                             // 4
// loginButtonsLoggedInDropdown                                                                                        // 5
Template.loginButtons.events({                                                                                         // 6
  'click #login-name-link, click #login-sign-in-link': function () {                                                   // 7
    loginButtonsSession.set('dropdownVisible', true);                                                                  // 8
    Deps.flush();                                                                                                      // 9
    correctDropdownZIndexes();                                                                                         // 10
  },                                                                                                                   // 11
  'click .login-close-text': function () {                                                                             // 12
    loginButtonsSession.closeDropdown();                                                                               // 13
  }                                                                                                                    // 14
});                                                                                                                    // 15
                                                                                                                       // 16
                                                                                                                       // 17
//                                                                                                                     // 18
// loginButtonsLoggedInDropdown template and related                                                                   // 19
//                                                                                                                     // 20
                                                                                                                       // 21
Template._loginButtonsLoggedInDropdown.events({                                                                        // 22
  'click #login-buttons-open-change-password': function() {                                                            // 23
    loginButtonsSession.resetMessages();                                                                               // 24
    loginButtonsSession.set('inChangePasswordFlow', true);                                                             // 25
  }                                                                                                                    // 26
});                                                                                                                    // 27
                                                                                                                       // 28
Template._loginButtonsLoggedInDropdown.displayName = displayName;                                                      // 29
                                                                                                                       // 30
Template._loginButtonsLoggedInDropdown.inChangePasswordFlow = function () {                                            // 31
  return loginButtonsSession.get('inChangePasswordFlow');                                                              // 32
};                                                                                                                     // 33
                                                                                                                       // 34
Template._loginButtonsLoggedInDropdown.inMessageOnlyFlow = function () {                                               // 35
  return loginButtonsSession.get('inMessageOnlyFlow');                                                                 // 36
};                                                                                                                     // 37
                                                                                                                       // 38
Template._loginButtonsLoggedInDropdown.dropdownVisible = function () {                                                 // 39
  return loginButtonsSession.get('dropdownVisible');                                                                   // 40
};                                                                                                                     // 41
                                                                                                                       // 42
Template._loginButtonsLoggedInDropdownActions.allowChangingPassword = function () {                                    // 43
  // it would be more correct to check whether the user has a password set,                                            // 44
  // but in order to do that we'd have to send more data down to the client,                                           // 45
  // and it'd be preferable not to send down the entire service.password document.                                     // 46
  //                                                                                                                   // 47
  // instead we use the heuristic: if the user has a username or email set.                                            // 48
  var user = Meteor.user();                                                                                            // 49
  return user.username || (user.emails && user.emails[0] && user.emails[0].address);                                   // 50
};                                                                                                                     // 51
                                                                                                                       // 52
                                                                                                                       // 53
//                                                                                                                     // 54
// loginButtonsLoggedOutDropdown template and related                                                                  // 55
//                                                                                                                     // 56
                                                                                                                       // 57
Template._loginButtonsLoggedOutDropdown.events({                                                                       // 58
  'click #login-buttons-password': function () {                                                                       // 59
    loginOrSignup();                                                                                                   // 60
  },                                                                                                                   // 61
                                                                                                                       // 62
  'keypress #forgot-password-email': function (event) {                                                                // 63
    if (event.keyCode === 13)                                                                                          // 64
      forgotPassword();                                                                                                // 65
  },                                                                                                                   // 66
                                                                                                                       // 67
  'click #login-buttons-forgot-password': function () {                                                                // 68
    forgotPassword();                                                                                                  // 69
  },                                                                                                                   // 70
                                                                                                                       // 71
  'click #signup-link': function () {                                                                                  // 72
    loginButtonsSession.resetMessages();                                                                               // 73
                                                                                                                       // 74
    // store values of fields before swtiching to the signup form                                                      // 75
    var username = trimmedElementValueById('login-username');                                                          // 76
    var email = trimmedElementValueById('login-email');                                                                // 77
    var usernameOrEmail = trimmedElementValueById('login-username-or-email');                                          // 78
    // notably not trimmed. a password could (?) start or end with a space                                             // 79
    var password = elementValueById('login-password');                                                                 // 80
                                                                                                                       // 81
    loginButtonsSession.set('inSignupFlow', true);                                                                     // 82
    loginButtonsSession.set('inForgotPasswordFlow', false);                                                            // 83
    // force the ui to update so that we have the approprate fields to fill in                                         // 84
    Deps.flush();                                                                                                      // 85
                                                                                                                       // 86
    // update new fields with appropriate defaults                                                                     // 87
    if (username !== null)                                                                                             // 88
      document.getElementById('login-username').value = username;                                                      // 89
    else if (email !== null)                                                                                           // 90
      document.getElementById('login-email').value = email;                                                            // 91
    else if (usernameOrEmail !== null)                                                                                 // 92
      if (usernameOrEmail.indexOf('@') === -1)                                                                         // 93
        document.getElementById('login-username').value = usernameOrEmail;                                             // 94
    else                                                                                                               // 95
      document.getElementById('login-email').value = usernameOrEmail;                                                  // 96
                                                                                                                       // 97
    if (password !== null)                                                                                             // 98
      document.getElementById('login-password').value = password;                                                      // 99
                                                                                                                       // 100
    // Force redrawing the `login-dropdown-list` element because of                                                    // 101
    // a bizarre Chrome bug in which part of the DIV is not redrawn                                                    // 102
    // in case you had tried to unsuccessfully log in before                                                           // 103
    // switching to the signup form.                                                                                   // 104
    //                                                                                                                 // 105
    // Found tip on how to force a redraw on                                                                           // 106
    // http://stackoverflow.com/questions/3485365/how-can-i-force-webkit-to-redraw-repaint-to-propagate-style-changes/3485654#3485654
    var redraw = document.getElementById('login-dropdown-list');                                                       // 108
    redraw.style.display = 'none';                                                                                     // 109
    redraw.offsetHeight; // it seems that this line does nothing but is necessary for the redraw to work               // 110
    redraw.style.display = 'block';                                                                                    // 111
  },                                                                                                                   // 112
  'click #forgot-password-link': function () {                                                                         // 113
    loginButtonsSession.resetMessages();                                                                               // 114
                                                                                                                       // 115
    // store values of fields before swtiching to the signup form                                                      // 116
    var email = trimmedElementValueById('login-email');                                                                // 117
    var usernameOrEmail = trimmedElementValueById('login-username-or-email');                                          // 118
                                                                                                                       // 119
    loginButtonsSession.set('inSignupFlow', false);                                                                    // 120
    loginButtonsSession.set('inForgotPasswordFlow', true);                                                             // 121
    // force the ui to update so that we have the approprate fields to fill in                                         // 122
    Deps.flush();                                                                                                      // 123
                                                                                                                       // 124
    // update new fields with appropriate defaults                                                                     // 125
    if (email !== null)                                                                                                // 126
      document.getElementById('forgot-password-email').value = email;                                                  // 127
    else if (usernameOrEmail !== null)                                                                                 // 128
      if (usernameOrEmail.indexOf('@') !== -1)                                                                         // 129
        document.getElementById('forgot-password-email').value = usernameOrEmail;                                      // 130
                                                                                                                       // 131
  },                                                                                                                   // 132
  'click #back-to-login-link': function () {                                                                           // 133
    loginButtonsSession.resetMessages();                                                                               // 134
                                                                                                                       // 135
    var username = trimmedElementValueById('login-username');                                                          // 136
    var email = trimmedElementValueById('login-email')                                                                 // 137
          || trimmedElementValueById('forgot-password-email'); // Ughh. Standardize on names?                          // 138
    // notably not trimmed. a password could (?) start or end with a space                                             // 139
    var password = elementValueById('login-password');                                                                 // 140
                                                                                                                       // 141
    loginButtonsSession.set('inSignupFlow', false);                                                                    // 142
    loginButtonsSession.set('inForgotPasswordFlow', false);                                                            // 143
    // force the ui to update so that we have the approprate fields to fill in                                         // 144
    Deps.flush();                                                                                                      // 145
                                                                                                                       // 146
    if (document.getElementById('login-username'))                                                                     // 147
      document.getElementById('login-username').value = username;                                                      // 148
    if (document.getElementById('login-email'))                                                                        // 149
      document.getElementById('login-email').value = email;                                                            // 150
                                                                                                                       // 151
    if (document.getElementById('login-username-or-email'))                                                            // 152
      document.getElementById('login-username-or-email').value = email || username;                                    // 153
                                                                                                                       // 154
    if (password !== null)                                                                                             // 155
      document.getElementById('login-password').value = password;                                                      // 156
  },                                                                                                                   // 157
  'keypress #login-username, keypress #login-email, keypress #login-username-or-email, keypress #login-password, keypress #login-password-again': function (event) {
    if (event.keyCode === 13)                                                                                          // 159
      loginOrSignup();                                                                                                 // 160
  }                                                                                                                    // 161
});                                                                                                                    // 162
                                                                                                                       // 163
// additional classes that can be helpful in styling the dropdown                                                      // 164
Template._loginButtonsLoggedOutDropdown.additionalClasses = function () {                                              // 165
  if (!hasPasswordService()) {                                                                                         // 166
    return false;                                                                                                      // 167
  } else {                                                                                                             // 168
    if (loginButtonsSession.get('inSignupFlow')) {                                                                     // 169
      return 'login-form-create-account';                                                                              // 170
    } else if (loginButtonsSession.get('inForgotPasswordFlow')) {                                                      // 171
      return 'login-form-forgot-password';                                                                             // 172
    } else {                                                                                                           // 173
      return 'login-form-sign-in';                                                                                     // 174
    }                                                                                                                  // 175
  }                                                                                                                    // 176
};                                                                                                                     // 177
                                                                                                                       // 178
Template._loginButtonsLoggedOutDropdown.dropdownVisible = function () {                                                // 179
  return loginButtonsSession.get('dropdownVisible');                                                                   // 180
};                                                                                                                     // 181
                                                                                                                       // 182
Template._loginButtonsLoggedOutDropdown.hasPasswordService = hasPasswordService;                                       // 183
                                                                                                                       // 184
// return all login services, with password last                                                                       // 185
Template._loginButtonsLoggedOutAllServices.services = getLoginServices;                                                // 186
                                                                                                                       // 187
Template._loginButtonsLoggedOutAllServices.isPasswordService = function () {                                           // 188
  return this.name === 'password';                                                                                     // 189
};                                                                                                                     // 190
                                                                                                                       // 191
Template._loginButtonsLoggedOutAllServices.hasOtherServices = function () {                                            // 192
  return getLoginServices().length > 1;                                                                                // 193
};                                                                                                                     // 194
                                                                                                                       // 195
Template._loginButtonsLoggedOutAllServices.hasPasswordService =                                                        // 196
  hasPasswordService;                                                                                                  // 197
                                                                                                                       // 198
Template._loginButtonsLoggedOutPasswordService.fields = function () {                                                  // 199
  var loginFields = [                                                                                                  // 200
    {fieldName: 'username-or-email', fieldLabel: 'Username or Email',                                                  // 201
     visible: function () {                                                                                            // 202
       return _.contains(                                                                                              // 203
         ["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL"],                                                        // 204
         passwordSignupFields());                                                                                      // 205
     }},                                                                                                               // 206
    {fieldName: 'username', fieldLabel: 'Username',                                                                    // 207
     visible: function () {                                                                                            // 208
       return passwordSignupFields() === "USERNAME_ONLY";                                                              // 209
     }},                                                                                                               // 210
    {fieldName: 'email', fieldLabel: 'Email', inputType: 'email',                                                      // 211
     visible: function () {                                                                                            // 212
       return passwordSignupFields() === "EMAIL_ONLY";                                                                 // 213
     }},                                                                                                               // 214
    {fieldName: 'password', fieldLabel: 'Password', inputType: 'password',                                             // 215
     visible: function () {                                                                                            // 216
       return true;                                                                                                    // 217
     }}                                                                                                                // 218
  ];                                                                                                                   // 219
                                                                                                                       // 220
  var signupFields = [                                                                                                 // 221
    {fieldName: 'username', fieldLabel: 'Username',                                                                    // 222
     visible: function () {                                                                                            // 223
       return _.contains(                                                                                              // 224
         ["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_ONLY"],                                       // 225
         passwordSignupFields());                                                                                      // 226
     }},                                                                                                               // 227
    {fieldName: 'email', fieldLabel: 'Email', inputType: 'email',                                                      // 228
     visible: function () {                                                                                            // 229
       return _.contains(                                                                                              // 230
         ["USERNAME_AND_EMAIL", "EMAIL_ONLY"],                                                                         // 231
         passwordSignupFields());                                                                                      // 232
     }},                                                                                                               // 233
    {fieldName: 'email', fieldLabel: 'Email (optional)', inputType: 'email',                                           // 234
     visible: function () {                                                                                            // 235
       return passwordSignupFields() === "USERNAME_AND_OPTIONAL_EMAIL";                                                // 236
     }},                                                                                                               // 237
    {fieldName: 'password', fieldLabel: 'Password', inputType: 'password',                                             // 238
     visible: function () {                                                                                            // 239
       return true;                                                                                                    // 240
     }},                                                                                                               // 241
    {fieldName: 'password-again', fieldLabel: 'Password (again)',                                                      // 242
     inputType: 'password',                                                                                            // 243
     visible: function () {                                                                                            // 244
       // No need to make users double-enter their password if                                                         // 245
       // they'll necessarily have an email set, since they can use                                                    // 246
       // the "forgot password" flow.                                                                                  // 247
       return _.contains(                                                                                              // 248
         ["USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_ONLY"],                                                             // 249
         passwordSignupFields());                                                                                      // 250
     }}                                                                                                                // 251
  ];                                                                                                                   // 252
                                                                                                                       // 253
  return loginButtonsSession.get('inSignupFlow') ? signupFields : loginFields;                                         // 254
};                                                                                                                     // 255
                                                                                                                       // 256
Template._loginButtonsLoggedOutPasswordService.inForgotPasswordFlow = function () {                                    // 257
  return loginButtonsSession.get('inForgotPasswordFlow');                                                              // 258
};                                                                                                                     // 259
                                                                                                                       // 260
Template._loginButtonsLoggedOutPasswordService.inLoginFlow = function () {                                             // 261
  return !loginButtonsSession.get('inSignupFlow') && !loginButtonsSession.get('inForgotPasswordFlow');                 // 262
};                                                                                                                     // 263
                                                                                                                       // 264
Template._loginButtonsLoggedOutPasswordService.inSignupFlow = function () {                                            // 265
  return loginButtonsSession.get('inSignupFlow');                                                                      // 266
};                                                                                                                     // 267
                                                                                                                       // 268
Template._loginButtonsLoggedOutPasswordService.showCreateAccountLink = function () {                                   // 269
  return !Accounts._options.forbidClientAccountCreation;                                                               // 270
};                                                                                                                     // 271
                                                                                                                       // 272
Template._loginButtonsLoggedOutPasswordService.showForgotPasswordLink = function () {                                  // 273
  return _.contains(                                                                                                   // 274
    ["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "EMAIL_ONLY"],                                               // 275
    passwordSignupFields());                                                                                           // 276
};                                                                                                                     // 277
                                                                                                                       // 278
Template._loginButtonsFormField.inputType = function () {                                                              // 279
  return this.inputType || "text";                                                                                     // 280
};                                                                                                                     // 281
                                                                                                                       // 282
                                                                                                                       // 283
//                                                                                                                     // 284
// loginButtonsChangePassword template                                                                                 // 285
//                                                                                                                     // 286
                                                                                                                       // 287
Template._loginButtonsChangePassword.events({                                                                          // 288
  'keypress #login-old-password, keypress #login-password, keypress #login-password-again': function (event) {         // 289
    if (event.keyCode === 13)                                                                                          // 290
      changePassword();                                                                                                // 291
  },                                                                                                                   // 292
  'click #login-buttons-do-change-password': function () {                                                             // 293
    changePassword();                                                                                                  // 294
  }                                                                                                                    // 295
});                                                                                                                    // 296
                                                                                                                       // 297
Template._loginButtonsChangePassword.fields = function () {                                                            // 298
  return [                                                                                                             // 299
    {fieldName: 'old-password', fieldLabel: 'Current Password', inputType: 'password',                                 // 300
     visible: function () {                                                                                            // 301
       return true;                                                                                                    // 302
     }},                                                                                                               // 303
    {fieldName: 'password', fieldLabel: 'New Password', inputType: 'password',                                         // 304
     visible: function () {                                                                                            // 305
       return true;                                                                                                    // 306
     }},                                                                                                               // 307
    {fieldName: 'password-again', fieldLabel: 'New Password (again)',                                                  // 308
     inputType: 'password',                                                                                            // 309
     visible: function () {                                                                                            // 310
       // No need to make users double-enter their password if                                                         // 311
       // they'll necessarily have an email set, since they can use                                                    // 312
       // the "forgot password" flow.                                                                                  // 313
       return _.contains(                                                                                              // 314
         ["USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_ONLY"],                                                             // 315
         passwordSignupFields());                                                                                      // 316
     }}                                                                                                                // 317
  ];                                                                                                                   // 318
};                                                                                                                     // 319
                                                                                                                       // 320
                                                                                                                       // 321
//                                                                                                                     // 322
// helpers                                                                                                             // 323
//                                                                                                                     // 324
                                                                                                                       // 325
var elementValueById = function(id) {                                                                                  // 326
  var element = document.getElementById(id);                                                                           // 327
  if (!element)                                                                                                        // 328
    return null;                                                                                                       // 329
  else                                                                                                                 // 330
    return element.value;                                                                                              // 331
};                                                                                                                     // 332
                                                                                                                       // 333
var trimmedElementValueById = function(id) {                                                                           // 334
  var element = document.getElementById(id);                                                                           // 335
  if (!element)                                                                                                        // 336
    return null;                                                                                                       // 337
  else                                                                                                                 // 338
    return element.value.replace(/^\s*|\s*$/g, ""); // trim() doesn't work on IE8;                                     // 339
};                                                                                                                     // 340
                                                                                                                       // 341
var loginOrSignup = function () {                                                                                      // 342
  if (loginButtonsSession.get('inSignupFlow'))                                                                         // 343
    signup();                                                                                                          // 344
  else                                                                                                                 // 345
    login();                                                                                                           // 346
};                                                                                                                     // 347
                                                                                                                       // 348
var login = function () {                                                                                              // 349
  loginButtonsSession.resetMessages();                                                                                 // 350
                                                                                                                       // 351
  var username = trimmedElementValueById('login-username');                                                            // 352
  var email = trimmedElementValueById('login-email');                                                                  // 353
  var usernameOrEmail = trimmedElementValueById('login-username-or-email');                                            // 354
  // notably not trimmed. a password could (?) start or end with a space                                               // 355
  var password = elementValueById('login-password');                                                                   // 356
                                                                                                                       // 357
  var loginSelector;                                                                                                   // 358
  if (username !== null) {                                                                                             // 359
    if (!validateUsername(username))                                                                                   // 360
      return;                                                                                                          // 361
    else                                                                                                               // 362
      loginSelector = {username: username};                                                                            // 363
  } else if (email !== null) {                                                                                         // 364
    if (!validateEmail(email))                                                                                         // 365
      return;                                                                                                          // 366
    else                                                                                                               // 367
      loginSelector = {email: email};                                                                                  // 368
  } else if (usernameOrEmail !== null) {                                                                               // 369
    // XXX not sure how we should validate this. but this seems good enough (for now),                                 // 370
    // since an email must have at least 3 characters anyways                                                          // 371
    if (!validateUsername(usernameOrEmail))                                                                            // 372
      return;                                                                                                          // 373
    else                                                                                                               // 374
      loginSelector = usernameOrEmail;                                                                                 // 375
  } else {                                                                                                             // 376
    throw new Error("Unexpected -- no element to use as a login user selector");                                       // 377
  }                                                                                                                    // 378
                                                                                                                       // 379
  Meteor.loginWithPassword(loginSelector, password, function (error, result) {                                         // 380
    if (error) {                                                                                                       // 381
      loginButtonsSession.errorMessage(error.reason || "Unknown error");                                               // 382
    } else {                                                                                                           // 383
      loginButtonsSession.closeDropdown();                                                                             // 384
    }                                                                                                                  // 385
  });                                                                                                                  // 386
};                                                                                                                     // 387
                                                                                                                       // 388
var signup = function () {                                                                                             // 389
  loginButtonsSession.resetMessages();                                                                                 // 390
                                                                                                                       // 391
  var options = {}; // to be passed to Accounts.createUser                                                             // 392
                                                                                                                       // 393
  var username = trimmedElementValueById('login-username');                                                            // 394
  if (username !== null) {                                                                                             // 395
    if (!validateUsername(username))                                                                                   // 396
      return;                                                                                                          // 397
    else                                                                                                               // 398
      options.username = username;                                                                                     // 399
  }                                                                                                                    // 400
                                                                                                                       // 401
  var email = trimmedElementValueById('login-email');                                                                  // 402
  if (email !== null) {                                                                                                // 403
    if (!validateEmail(email))                                                                                         // 404
      return;                                                                                                          // 405
    else                                                                                                               // 406
      options.email = email;                                                                                           // 407
  }                                                                                                                    // 408
                                                                                                                       // 409
  // notably not trimmed. a password could (?) start or end with a space                                               // 410
  var password = elementValueById('login-password');                                                                   // 411
  if (!validatePassword(password))                                                                                     // 412
    return;                                                                                                            // 413
  else                                                                                                                 // 414
    options.password = password;                                                                                       // 415
                                                                                                                       // 416
  if (!matchPasswordAgainIfPresent())                                                                                  // 417
    return;                                                                                                            // 418
                                                                                                                       // 419
  Accounts.createUser(options, function (error) {                                                                      // 420
    if (error) {                                                                                                       // 421
      loginButtonsSession.errorMessage(error.reason || "Unknown error");                                               // 422
    } else {                                                                                                           // 423
      loginButtonsSession.closeDropdown();                                                                             // 424
    }                                                                                                                  // 425
  });                                                                                                                  // 426
};                                                                                                                     // 427
                                                                                                                       // 428
var forgotPassword = function () {                                                                                     // 429
  loginButtonsSession.resetMessages();                                                                                 // 430
                                                                                                                       // 431
  var email = trimmedElementValueById("forgot-password-email");                                                        // 432
  if (email.indexOf('@') !== -1) {                                                                                     // 433
    Accounts.forgotPassword({email: email}, function (error) {                                                         // 434
      if (error)                                                                                                       // 435
        loginButtonsSession.errorMessage(error.reason || "Unknown error");                                             // 436
      else                                                                                                             // 437
        loginButtonsSession.infoMessage("Email sent");                                                                 // 438
    });                                                                                                                // 439
  } else {                                                                                                             // 440
    loginButtonsSession.errorMessage("Invalid email");                                                                 // 441
  }                                                                                                                    // 442
};                                                                                                                     // 443
                                                                                                                       // 444
var changePassword = function () {                                                                                     // 445
  loginButtonsSession.resetMessages();                                                                                 // 446
                                                                                                                       // 447
  // notably not trimmed. a password could (?) start or end with a space                                               // 448
  var oldPassword = elementValueById('login-old-password');                                                            // 449
                                                                                                                       // 450
  // notably not trimmed. a password could (?) start or end with a space                                               // 451
  var password = elementValueById('login-password');                                                                   // 452
  if (!validatePassword(password))                                                                                     // 453
    return;                                                                                                            // 454
                                                                                                                       // 455
  if (!matchPasswordAgainIfPresent())                                                                                  // 456
    return;                                                                                                            // 457
                                                                                                                       // 458
  Accounts.changePassword(oldPassword, password, function (error) {                                                    // 459
    if (error) {                                                                                                       // 460
      loginButtonsSession.errorMessage(error.reason || "Unknown error");                                               // 461
    } else {                                                                                                           // 462
      loginButtonsSession.set('inChangePasswordFlow', false);                                                          // 463
      loginButtonsSession.set('inMessageOnlyFlow', true);                                                              // 464
      loginButtonsSession.infoMessage("Password changed");                                                             // 465
    }                                                                                                                  // 466
  });                                                                                                                  // 467
};                                                                                                                     // 468
                                                                                                                       // 469
var matchPasswordAgainIfPresent = function () {                                                                        // 470
  // notably not trimmed. a password could (?) start or end with a space                                               // 471
  var passwordAgain = elementValueById('login-password-again');                                                        // 472
  if (passwordAgain !== null) {                                                                                        // 473
    // notably not trimmed. a password could (?) start or end with a space                                             // 474
    var password = elementValueById('login-password');                                                                 // 475
    if (password !== passwordAgain) {                                                                                  // 476
      loginButtonsSession.errorMessage("Passwords don't match");                                                       // 477
      return false;                                                                                                    // 478
    }                                                                                                                  // 479
  }                                                                                                                    // 480
  return true;                                                                                                         // 481
};                                                                                                                     // 482
                                                                                                                       // 483
var correctDropdownZIndexes = function () {                                                                            // 484
  // IE <= 7 has a z-index bug that means we can't just give the                                                       // 485
  // dropdown a z-index and expect it to stack above the rest of                                                       // 486
  // the page even if nothing else has a z-index.  The nature of                                                       // 487
  // the bug is that all positioned elements are considered to                                                         // 488
  // have z-index:0 (not auto) and therefore start new stacking                                                        // 489
  // contexts, with ties broken by page order.                                                                         // 490
  //                                                                                                                   // 491
  // The fix, then is to give z-index:1 to all ancestors                                                               // 492
  // of the dropdown having z-index:0.                                                                                 // 493
  for(var n = document.getElementById('login-dropdown-list').parentNode;                                               // 494
      n.nodeName !== 'BODY';                                                                                           // 495
      n = n.parentNode)                                                                                                // 496
    if (n.style.zIndex === 0)                                                                                          // 497
      n.style.zIndex = 1;                                                                                              // 498
};                                                                                                                     // 499
                                                                                                                       // 500
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-ui-unstyled/login_buttons_dialogs.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// for convenience                                                                                                     // 1
var loginButtonsSession = Accounts._loginButtonsSession;                                                               // 2
                                                                                                                       // 3
                                                                                                                       // 4
//                                                                                                                     // 5
// populate the session so that the appropriate dialogs are                                                            // 6
// displayed by reading variables set by accounts-base, which parses                                                   // 7
// special URLs. since accounts-ui depends on accounts-base, we are                                                    // 8
// guaranteed to have these set at this point.                                                                         // 9
//                                                                                                                     // 10
                                                                                                                       // 11
if (Accounts._resetPasswordToken) {                                                                                    // 12
  loginButtonsSession.set('resetPasswordToken', Accounts._resetPasswordToken);                                         // 13
}                                                                                                                      // 14
                                                                                                                       // 15
if (Accounts._enrollAccountToken) {                                                                                    // 16
  loginButtonsSession.set('enrollAccountToken', Accounts._enrollAccountToken);                                         // 17
}                                                                                                                      // 18
                                                                                                                       // 19
// Needs to be in Meteor.startup because of a package loading order                                                    // 20
// issue. We can't be sure that accounts-password is loaded earlier                                                    // 21
// than accounts-ui so Accounts.verifyEmail might not be defined.                                                      // 22
Meteor.startup(function () {                                                                                           // 23
  if (Accounts._verifyEmailToken) {                                                                                    // 24
    Accounts.verifyEmail(Accounts._verifyEmailToken, function(error) {                                                 // 25
      Accounts._enableAutoLogin();                                                                                     // 26
      if (!error)                                                                                                      // 27
        loginButtonsSession.set('justVerifiedEmail', true);                                                            // 28
      // XXX show something if there was an error.                                                                     // 29
    });                                                                                                                // 30
  }                                                                                                                    // 31
});                                                                                                                    // 32
                                                                                                                       // 33
                                                                                                                       // 34
//                                                                                                                     // 35
// resetPasswordDialog template                                                                                        // 36
//                                                                                                                     // 37
                                                                                                                       // 38
Template._resetPasswordDialog.events({                                                                                 // 39
  'click #login-buttons-reset-password-button': function () {                                                          // 40
    resetPassword();                                                                                                   // 41
  },                                                                                                                   // 42
  'keypress #reset-password-new-password': function (event) {                                                          // 43
    if (event.keyCode === 13)                                                                                          // 44
      resetPassword();                                                                                                 // 45
  },                                                                                                                   // 46
  'click #login-buttons-cancel-reset-password': function () {                                                          // 47
    loginButtonsSession.set('resetPasswordToken', null);                                                               // 48
    Accounts._enableAutoLogin();                                                                                       // 49
  }                                                                                                                    // 50
});                                                                                                                    // 51
                                                                                                                       // 52
var resetPassword = function () {                                                                                      // 53
  loginButtonsSession.resetMessages();                                                                                 // 54
  var newPassword = document.getElementById('reset-password-new-password').value;                                      // 55
  if (!validatePassword(newPassword))                                                                                  // 56
    return;                                                                                                            // 57
                                                                                                                       // 58
  Accounts.resetPassword(                                                                                              // 59
    loginButtonsSession.get('resetPasswordToken'), newPassword,                                                        // 60
    function (error) {                                                                                                 // 61
      if (error) {                                                                                                     // 62
        loginButtonsSession.errorMessage(error.reason || "Unknown error");                                             // 63
      } else {                                                                                                         // 64
        loginButtonsSession.set('resetPasswordToken', null);                                                           // 65
        loginButtonsSession.set('justResetPassword', true);                                                            // 66
        Accounts._enableAutoLogin();                                                                                   // 67
      }                                                                                                                // 68
    });                                                                                                                // 69
};                                                                                                                     // 70
                                                                                                                       // 71
Template._resetPasswordDialog.inResetPasswordFlow = function () {                                                      // 72
  return loginButtonsSession.get('resetPasswordToken');                                                                // 73
};                                                                                                                     // 74
                                                                                                                       // 75
//                                                                                                                     // 76
// justResetPasswordDialog template                                                                                    // 77
//                                                                                                                     // 78
                                                                                                                       // 79
Template._justResetPasswordDialog.events({                                                                             // 80
  'click #just-verified-dismiss-button': function () {                                                                 // 81
    loginButtonsSession.set('justResetPassword', false);                                                               // 82
  }                                                                                                                    // 83
});                                                                                                                    // 84
                                                                                                                       // 85
Template._justResetPasswordDialog.visible = function () {                                                              // 86
  return loginButtonsSession.get('justResetPassword');                                                                 // 87
};                                                                                                                     // 88
                                                                                                                       // 89
Template._justResetPasswordDialog.displayName = displayName;                                                           // 90
                                                                                                                       // 91
                                                                                                                       // 92
                                                                                                                       // 93
//                                                                                                                     // 94
// enrollAccountDialog template                                                                                        // 95
//                                                                                                                     // 96
                                                                                                                       // 97
Template._enrollAccountDialog.events({                                                                                 // 98
  'click #login-buttons-enroll-account-button': function () {                                                          // 99
    enrollAccount();                                                                                                   // 100
  },                                                                                                                   // 101
  'keypress #enroll-account-password': function (event) {                                                              // 102
    if (event.keyCode === 13)                                                                                          // 103
      enrollAccount();                                                                                                 // 104
  },                                                                                                                   // 105
  'click #login-buttons-cancel-enroll-account': function () {                                                          // 106
    loginButtonsSession.set('enrollAccountToken', null);                                                               // 107
    Accounts._enableAutoLogin();                                                                                       // 108
  }                                                                                                                    // 109
});                                                                                                                    // 110
                                                                                                                       // 111
var enrollAccount = function () {                                                                                      // 112
  loginButtonsSession.resetMessages();                                                                                 // 113
  var password = document.getElementById('enroll-account-password').value;                                             // 114
  if (!validatePassword(password))                                                                                     // 115
    return;                                                                                                            // 116
                                                                                                                       // 117
  Accounts.resetPassword(                                                                                              // 118
    loginButtonsSession.get('enrollAccountToken'), password,                                                           // 119
    function (error) {                                                                                                 // 120
      if (error) {                                                                                                     // 121
        loginButtonsSession.errorMessage(error.reason || "Unknown error");                                             // 122
      } else {                                                                                                         // 123
        loginButtonsSession.set('enrollAccountToken', null);                                                           // 124
        Accounts._enableAutoLogin();                                                                                   // 125
      }                                                                                                                // 126
    });                                                                                                                // 127
};                                                                                                                     // 128
                                                                                                                       // 129
Template._enrollAccountDialog.inEnrollAccountFlow = function () {                                                      // 130
  return loginButtonsSession.get('enrollAccountToken');                                                                // 131
};                                                                                                                     // 132
                                                                                                                       // 133
                                                                                                                       // 134
//                                                                                                                     // 135
// justVerifiedEmailDialog template                                                                                    // 136
//                                                                                                                     // 137
                                                                                                                       // 138
Template._justVerifiedEmailDialog.events({                                                                             // 139
  'click #just-verified-dismiss-button': function () {                                                                 // 140
    loginButtonsSession.set('justVerifiedEmail', false);                                                               // 141
  }                                                                                                                    // 142
});                                                                                                                    // 143
                                                                                                                       // 144
Template._justVerifiedEmailDialog.visible = function () {                                                              // 145
  return loginButtonsSession.get('justVerifiedEmail');                                                                 // 146
};                                                                                                                     // 147
                                                                                                                       // 148
Template._justVerifiedEmailDialog.displayName = displayName;                                                           // 149
                                                                                                                       // 150
                                                                                                                       // 151
//                                                                                                                     // 152
// loginButtonsMessagesDialog template                                                                                 // 153
//                                                                                                                     // 154
                                                                                                                       // 155
Template._loginButtonsMessagesDialog.events({                                                                          // 156
  'click #messages-dialog-dismiss-button': function () {                                                               // 157
    loginButtonsSession.resetMessages();                                                                               // 158
  }                                                                                                                    // 159
});                                                                                                                    // 160
                                                                                                                       // 161
Template._loginButtonsMessagesDialog.visible = function () {                                                           // 162
  var hasMessage = loginButtonsSession.get('infoMessage') || loginButtonsSession.get('errorMessage');                  // 163
  return !dropdown() && hasMessage;                                                                                    // 164
};                                                                                                                     // 165
                                                                                                                       // 166
                                                                                                                       // 167
//                                                                                                                     // 168
// configureLoginServiceDialog template                                                                                // 169
//                                                                                                                     // 170
                                                                                                                       // 171
Template._configureLoginServiceDialog.events({                                                                         // 172
  'click .configure-login-service-dismiss-button': function () {                                                       // 173
    loginButtonsSession.set('configureLoginServiceDialogVisible', false);                                              // 174
  },                                                                                                                   // 175
  'click #configure-login-service-dialog-save-configuration': function () {                                            // 176
    if (loginButtonsSession.get('configureLoginServiceDialogVisible') &&                                               // 177
        ! loginButtonsSession.get('configureLoginServiceDialogSaveDisabled')) {                                        // 178
      // Prepare the configuration document for this login service                                                     // 179
      var serviceName = loginButtonsSession.get('configureLoginServiceDialogServiceName');                             // 180
      var configuration = {                                                                                            // 181
        service: serviceName                                                                                           // 182
      };                                                                                                               // 183
                                                                                                                       // 184
      // Fetch the value of each input field                                                                           // 185
      _.each(configurationFields(), function(field) {                                                                  // 186
        configuration[field.property] = document.getElementById(                                                       // 187
          'configure-login-service-dialog-' + field.property).value                                                    // 188
          .replace(/^\s*|\s*$/g, ""); // trim() doesnt work on IE8;                                                    // 189
      });                                                                                                              // 190
                                                                                                                       // 191
      // Configure this login service                                                                                  // 192
      Accounts.connection.call(                                                                                        // 193
        "configureLoginService", configuration, function (error, result) {                                             // 194
          if (error)                                                                                                   // 195
            Meteor._debug("Error configuring login service " + serviceName,                                            // 196
                          error);                                                                                      // 197
          else                                                                                                         // 198
            loginButtonsSession.set('configureLoginServiceDialogVisible',                                              // 199
                                    false);                                                                            // 200
        });                                                                                                            // 201
    }                                                                                                                  // 202
  },                                                                                                                   // 203
  // IE8 doesn't support the 'input' event, so we'll run this on the keyup as                                          // 204
  // well. (Keeping the 'input' event means that this also fires when you use                                          // 205
  // the mouse to change the contents of the field, eg 'Cut' menu item.)                                               // 206
  'input, keyup input': function (event) {                                                                             // 207
    // if the event fired on one of the configuration input fields,                                                    // 208
    // check whether we should enable the 'save configuration' button                                                  // 209
    if (event.target.id.indexOf('configure-login-service-dialog') === 0)                                               // 210
      updateSaveDisabled();                                                                                            // 211
  }                                                                                                                    // 212
});                                                                                                                    // 213
                                                                                                                       // 214
// check whether the 'save configuration' button should be enabled.                                                    // 215
// this is a really strange way to implement this and a Forms                                                          // 216
// Abstraction would make all of this reactive, and simpler.                                                           // 217
var updateSaveDisabled = function () {                                                                                 // 218
  var anyFieldEmpty = _.any(configurationFields(), function(field) {                                                   // 219
    return document.getElementById(                                                                                    // 220
      'configure-login-service-dialog-' + field.property).value === '';                                                // 221
  });                                                                                                                  // 222
                                                                                                                       // 223
  loginButtonsSession.set('configureLoginServiceDialogSaveDisabled', anyFieldEmpty);                                   // 224
};                                                                                                                     // 225
                                                                                                                       // 226
// Returns the appropriate template for this login service.  This                                                      // 227
// template should be defined in the service's package                                                                 // 228
var configureLoginServiceDialogTemplateForService = function () {                                                      // 229
  var serviceName = loginButtonsSession.get('configureLoginServiceDialogServiceName');                                 // 230
  // XXX Service providers should be able to specify their configuration                                               // 231
  // template name.                                                                                                    // 232
  return Template['configureLoginServiceDialogFor' +                                                                   // 233
                  (serviceName === 'meteor-developer' ?                                                                // 234
                   'MeteorDeveloper' :                                                                                 // 235
                   capitalize(serviceName))];                                                                          // 236
};                                                                                                                     // 237
                                                                                                                       // 238
var configurationFields = function () {                                                                                // 239
  var template = configureLoginServiceDialogTemplateForService();                                                      // 240
  return template.fields();                                                                                            // 241
};                                                                                                                     // 242
                                                                                                                       // 243
Template._configureLoginServiceDialog.configurationFields = function () {                                              // 244
  return configurationFields();                                                                                        // 245
};                                                                                                                     // 246
                                                                                                                       // 247
Template._configureLoginServiceDialog.visible = function () {                                                          // 248
  return loginButtonsSession.get('configureLoginServiceDialogVisible');                                                // 249
};                                                                                                                     // 250
                                                                                                                       // 251
Template._configureLoginServiceDialog.configurationSteps = function () {                                               // 252
  // renders the appropriate template                                                                                  // 253
  return configureLoginServiceDialogTemplateForService();                                                              // 254
};                                                                                                                     // 255
                                                                                                                       // 256
Template._configureLoginServiceDialog.saveDisabled = function () {                                                     // 257
  return loginButtonsSession.get('configureLoginServiceDialogSaveDisabled');                                           // 258
};                                                                                                                     // 259
                                                                                                                       // 260
// XXX from http://epeli.github.com/underscore.string/lib/underscore.string.js                                         // 261
var capitalize = function(str){                                                                                        // 262
  str = str == null ? '' : String(str);                                                                                // 263
  return str.charAt(0).toUpperCase() + str.slice(1);                                                                   // 264
};                                                                                                                     // 265
                                                                                                                       // 266
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['accounts-ui-unstyled'] = {};

})();

//# sourceMappingURL=48da338c261bfab27e83092b969d4c6d02e3e110.map
