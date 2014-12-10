(function(){
Template.__define__("chatdrawer", (function() {
  var view = this;
  return HTML.DIV(HTML.Raw('\n		<div id="chat-handle">\n			<i id="messageicon" class="fa fa-2x fa-comments-o menu-link"></i>\n		</div>\n		'), HTML.NAV({
    id: "chat-drawer",
    "class": "panel",
    role: "navigation"
  }, "\n    ", Spacebars.include(view.lookupTemplate("ChatMessages")), "\n      ", HTML.Raw('<!-- <div id="close-drawer-glyph" class="close-drawer-icon">\n        <a id="close-drawer-arrow" class="menu-link" href="">\n          <span class="glyphicon glyphicon-chevron-left"></span>\n        </a>\n        </div> -->'), "\n        ", Spacebars.include(view.lookupTemplate("ChatInput")), "\n		"), "\n	");
}));

Template.__define__("ChatMessages", (function() {
  var view = this;
  return HTML.DIV({
    "class": "messageview"
  }, "\n	", Blaze.Each(function() {
    return Spacebars.call(view.lookup("messages"));
  }, function() {
    return [ "\n		", HTML.DIV({
      "class": "chatmessage"
    }, "\n			", Blaze.Unless(function() {
      return Spacebars.call(view.lookup("helpRequest"));
    }, function() {
      return [ "\n				", HTML.SPAN({
        "class": function() {
          return [ "message-content ", Blaze.If(function() {
            return Spacebars.call(view.lookup("isSender"));
          }, function() {
            return " sender ";
          }) ];
        }
      }, "\n					", HTML.LABEL(Blaze.View(function() {
        return Spacebars.mustache(view.lookup("username"));
      }), ": "), "\n					", Blaze.View(function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("."), "message"));
      }), "\n				"), "\n			" ];
    }, function() {
      return [ "\n				", Blaze.Unless(function() {
        return Spacebars.call(Spacebars.dot(view.lookup("."), "handled"));
      }, function() {
        return [ "\n					", HTML.SPAN({
          "class": "message-content helprequest"
        }, "\n						", HTML.LABEL(Blaze.View(function() {
          return Spacebars.mustache(view.lookup("username"));
        }), " is requesting help! "), "\n					"), "\n            ", HTML.Comment(' <i><a href="">Help {{username}}</a></i> '), "\n				" ];
      }, function() {
        return [ "\n					", HTML.SPAN({
          "class": "message-content"
        }, "\n						", HTML.LABEL(Blaze.View(function() {
          return Spacebars.mustache(view.lookup("username"));
        }), " has been helped"), "\n					"), "\n				" ];
      }), "\n			" ];
    }), "\n		"), "\n      " ];
  }), "\n	");
}));

Template.__define__("ChatInput", (function() {
  var view = this;
  return HTML.Raw('<div id="write-message" class="input-group">\n	  <input id="chatinput" type="text" class="form-control">\n		<span class="input-group-btn">\n			<button id="sendchat" class="btn btn-success" type="button">Send</button>\n		</span>\n  </div><!-- /input-group -->');
}));

})();
