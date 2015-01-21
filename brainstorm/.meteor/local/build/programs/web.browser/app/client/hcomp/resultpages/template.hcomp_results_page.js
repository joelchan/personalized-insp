(function(){
Template.__checkName("themeIdeasItem");
Template["themeIdeasItem"] = new Template("Template.themeIdeasItem", (function() {
  var view = this;
  return HTML.LI({
    id: function() {
      return [ "idea-", Spacebars.mustache(view.lookup("_id")) ];
    },
    "class": function() {
      return [ "themeIdea-item ", Blaze.If(function() {
        return Spacebars.call(view.lookup("isNotInCluster"));
      }, function() {
        return " unsorted-idea ";
      }, function() {
        return " sorted-idea ";
      }) ];
    }
  }, "\n  ", HTML.I({
    "class": function() {
      return [ "gamechangestar fa fa-lg ", Blaze.If(function() {
        return Spacebars.call(view.lookup("gameChangerStatus"));
      }, function() {
        return " fa-star ";
      }, function() {
        return " fa-star-o ";
      }) ];
    }
  }, "\n  "), "\n  ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("content"));
  }), " \n");
}));

Template.__checkName("themeIdeasList");
Template["themeIdeasList"] = new Template("Template.themeIdeasList", (function() {
  var view = this;
  return HTML.DIV({
    id: "hcomp-themeIdeas-container"
  }, "\n    ", HTML.DIV({
    "class": "panel-group",
    id: "accordion"
  }, "\n      ", HTML.DIV({
    "class": "panel panel-default"
  }, "\n        ", HTML.DIV({
    "class": "panel-heading"
  }, "\n          ", HTML.H4({
    "class": "panel-title"
  }, "\n            ", HTML.A({
    "data-toggle": "collapse",
    "data-parent": "#accordion",
    href: function() {
      return [ "#", Spacebars.mustache(view.lookup("clusterID"), view.lookup(".")) ];
    }
  }, "\n            ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("themeName"), view.lookup("."));
  }), "\n              ", HTML.P(" Total ideas: ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("numThemeIdeas"), view.lookup("."));
  }), " "), "\n            "), "\n          "), "\n        "), "\n        ", HTML.DIV({
    id: function() {
      return Spacebars.mustache(view.lookup("clusterID"), view.lookup("."));
    },
    "class": "panel-collapse collapse"
  }, "\n          ", HTML.DIV({
    "class": "panel-body"
  }, "\n            ", HTML.UL({
    "class": "dropdownIdeaslist"
  }, "\n              ", Blaze.Each(function() {
    return Spacebars.dataMustache(view.lookup("themeIdeas"), view.lookup("."));
  }, function() {
    return [ "\n                ", Spacebars.include(view.lookupTemplate("themeIdeasItem")), "\n              " ];
  }), "\n            "), "\n          "), "\n        "), "\n      "), "\n    "), "\n  ");
}));

Template.__checkName("allIdeasItem");
Template["allIdeasItem"] = new Template("Template.allIdeasItem", (function() {
  var view = this;
  return HTML.LI({
    id: function() {
      return [ "idea-", Spacebars.mustache(view.lookup("_id")) ];
    },
    "class": function() {
      return [ "allIdea-item ", Blaze.If(function() {
        return Spacebars.call(view.lookup("isNotInCluster"));
      }, function() {
        return " unsorted-idea ";
      }, function() {
        return " sorted-idea ";
      }) ];
    }
  }, "\n  ", HTML.I({
    "class": function() {
      return [ "gamechangestar fa fa-lg ", Blaze.If(function() {
        return Spacebars.call(view.lookup("gameChangerStatus"));
      }, function() {
        return " fa-star ";
      }, function() {
        return " fa-star-o ";
      }) ];
    }
  }, "\n  "), "\n  ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("content"));
  }), " \n");
}));

Template.__checkName("allIdeasList");
Template["allIdeasList"] = new Template("Template.allIdeasList", (function() {
  var view = this;
  return HTML.DIV({
    id: "hcomp-allideas-container"
  }, "\n    ", HTML.P(" Total ideas: ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("numAllIdeas"));
  }), " "), "\n    ", Spacebars.include(view.lookupTemplate("HcompFilterBoxHeader")), "\n    ", HTML.UL({
    "class": "hcompIdeaslist"
  }, "\n      ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("ideas"));
  }, function() {
    return [ "\n        ", Spacebars.include(view.lookupTemplate("allIdeasItem")), "\n      " ];
  }), "\n    "), "\n  ");
}));

Template.__checkName("HcompResultsPage");
Template["HcompResultsPage"] = new Template("Template.HcompResultsPage", (function() {
  var view = this;
  return HTML.DIV({
    id: "hcompresultspage"
  }, "\n    ", HTML.DIV({
    "class": "col-xs-9 hcomp-align-top"
  }, "\n  		", HTML.DIV({
    "class": "title-container"
  }, "\n        ", HTML.H1(" ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("promptQuestion"));
  })), "\n        ", HTML.Raw("<h1>Brainstorm Results</h1>"), "\n        ", HTML.Raw("<p>Click on a theme to reveal ideas associated with it</p>"), "\n      "), "\n      ", HTML.DIV({
    id: "themeIdeas-column-container"
  }, "\n        ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("Clusters"));
  }, function() {
    return [ "\n          ", HTML.DIV({
      "class": "themeIdea-column"
    }, "\n            ", Spacebars.include(view.lookupTemplate("themeIdeasList")), "\n          "), "\n        " ];
  }), "\n      "), "\n    "), "\n    ", HTML.DIV({
    id: "idea-column-container",
    "class": "col-xs-3 hcomp-align-top"
  }, "\n      ", HTML.DIV({
    "class": "idea-column",
    id: "allIdeasColumn"
  }, "\n        ", HTML.Raw("<h3> All Ideas </h3>"), "\n          ", Spacebars.include(view.lookupTemplate("allIdeasList")), "\n      "), "\n    "), "\n	");
}));

})();
