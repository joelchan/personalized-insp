(function(){
Template.__checkName("taggableIdea");
Template["taggableIdea"] = new Template("Template.taggableIdea", (function() {
  var view = this;
  return HTML.DIV({
    "class": "idea-block draggable ui-widget-content"
  }, "\n	  ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("text"));
  }), "\n  ");
}));

Template.__checkName("JoinIdeasPage");
Template["JoinIdeasPage"] = new Template("Template.JoinIdeasPage", (function() {
  var view = this;
  return [ HTML.DIV({
    "class": "row"
  }, "\n    ", HTML.DIV({
    "class": "prompt-box"
  }, "\n      ", HTML.H1({
    "class": "heading"
  }, "\n        ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("prompt"));
  }), "\n      "), "\n    "), "\n    ", HTML.Raw("<div>\n      <h2>Select items to tag</h2>\n    </div>"), "\n  "), "\n\n  ", HTML.DIV({
    "class": "row"
  }, "\n	  ", HTML.DIV({
    "class": "idea-list container"
  }, "\n	    	", Blaze.Each(function() {
    return Spacebars.call(view.lookup("ideas"));
  }, function() {
    return [ "\n		      ", Spacebars.include(view.lookupTemplate("taggableIdea")), "\n	      " ];
  }), "\n	  "), "\n  "), HTML.Raw('\n    \n  <div class="row">\n    <div class="col-lg-10">\n      <input type="text" id="nextTag" class="line" placeholder="Give a tag">\n    </div>\n    <div class="col-lg-2">\n        <button id="submitTag" class="submitTag btn-default btn-primary"> Enter </button>\n    </div>\n  </div>\n\n    <center>\n      <button id="nextPage" class="nextPage btn-xlarge2 btn-default btn-primary">\n        Continue\n      </button>\n    </center>') ];
}));

})();
