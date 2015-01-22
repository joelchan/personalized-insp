(function(){
Template.__checkName("tagIdea");
Template["tagIdea"] = new Template("Template.tagIdea", (function() {
  var view = this;
  return HTML.LI("\n    ", HTML.BUTTON({
    "class": "tag",
    style: function() {
      return [ "background: ", Spacebars.mustache(view.lookup("color")), ";" ];
    }
  }, "\n      ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("text"));
  }), "\n    "), "\n  ");
}));

Template.__checkName("circleColor");
Template["circleColor"] = new Template("Template.circleColor", (function() {
  var view = this;
  return HTML.DIV({
    "class": "circle",
    style: function() {
      return [ "background: ", Spacebars.mustache(view.lookup("color")), ";" ];
    }
  });
}));

Template.__checkName("taggedIdea");
Template["taggedIdea"] = new Template("Template.taggedIdea", (function() {
  var view = this;
  return HTML.DIV({
    "class": function() {
      return [ "idea clickable list-item ", Spacebars.mustache(view.lookup("done_class")) ];
    }
  }, "\n    ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("tags"));
  }, function() {
    return [ "\n      ", Spacebars.include(view.lookupTemplate("circleColor")), "\n    " ];
  }), "\n    ", HTML.DIV({
    "class": "idea-text"
  }, "\n      ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("text"));
  }), "\n    "), "\n  ");
}));

Template.__checkName("TaggingPage");
Template["TaggingPage"] = new Template("Template.TaggingPage", (function() {
  var view = this;
  return [ HTML.Raw("<!-- timer -->\n  "), HTML.DIV({
    "class": "row"
  }, "\n    ", HTML.DIV({
    "class": "prompt-box"
  }, "\n      ", HTML.H1({
    "class": "heading"
  }, "\n        ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("prompt"));
  }), "\n      "), "\n    "), "\n    ", HTML.Raw("<div>\n      <h2>Select items to tag</h2>\n    </div>"), "\n  "), "\n  ", HTML.DIV({
    "class": "row idea-list"
  }, "\n        ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("ideas1"));
  }, function() {
    return [ "\n          ", Spacebars.include(view.lookupTemplate("taggedIdea")), "\n        " ];
  }), "\n  "), HTML.Raw('\n  <div class="row">\n    <h3>Used Tags</h3>\n  </div>\n  '), HTML.DIV({
    "class": "row"
  }, "\n    ", HTML.UL({
    "class": "tags"
  }, "\n      ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("tags"));
  }, function() {
    return [ "\n        ", Spacebars.include(view.lookupTemplate("tagIdea")), "\n      " ];
  }), "\n    "), "\n  "), HTML.Raw('   \n \n  <div class="row">\n      <div class="col-lg-10">\n        <input type="text" id="nextTag" class="line" placeholder="Give a tag">\n      </div>\n      <div class="col-lg-2">\n          <button id="submitTag" class="submitTag btn-default btn-primary"> Enter </button>\n      </div>\n  </div>\n  <center>\n        <button id="nextPage" class="nextPage btn-xlarge2 btn-default btn-primary">Continue</button>\n  </center>') ];
}));

})();
