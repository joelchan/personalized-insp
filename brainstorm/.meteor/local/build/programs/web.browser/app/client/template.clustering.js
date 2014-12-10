(function(){
Template.__define__("ClusterIdeaItem", (function() {
  var view = this;
  return HTML.LI({
    id: function() {
      return [ "idea-", Spacebars.mustache(view.lookup("_id")) ];
    },
    "class": function() {
      return [ "idea-item ", Blaze.If(function() {
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

Template.__define__("IdeaList", (function() {
  var view = this;
  return [ HTML.Raw("<!--Idea List-->\n  "), HTML.DIV({
    id: "idealistwrapper"
  }, "\n    ", HTML.Raw('<h3 id="idealistHeader">Idea List</h3>'), "\n    ", HTML.UL({
    id: "idealist",
    "class": "ideadeck cluster-idea-list"
  }, "\n      ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("ideas"));
  }, function() {
    return [ "\n        ", Spacebars.include(view.lookupTemplate("ClusterIdeaItem")), "\n      " ];
  }), "\n    "), "\n  ") ];
}));

Template.__define__("ClusterList", (function() {
  var view = this;
  return HTML.DIV({
    "class": "cluster-list"
  }, HTML.Raw('\n    <h3>Theme List</h3>\n    <!-- <ul class="newcluster ui-sortable" id="node-drag-target"> -->\n      <!-- </ul> -->\n    <div class="newcluster" id="new-cluster"> \n      Drag idea here to create a new cluster\n    </div>\n    '), HTML.UL({
    id: "clusterlist",
    "class": "deck clusterdeck"
  }, "\n      ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("clusters"));
  }, function() {
    return [ "\n        ", HTML.LI({
      id: function() {
        return [ "ci-", Spacebars.mustache(view.lookup("_id")) ];
      },
      "class": "cluster-item"
    }, "\n          ", Blaze.View(function() {
      return Spacebars.mustache(view.lookup("name"));
    }), "\n        "), "\n      " ];
  }), "\n    "), "\n  ");
}));

Template.__define__("clusterarea", (function() {
  var view = this;
  return Blaze.Each(function() {
    return Spacebars.call(view.lookup("clusters"));
  }, function() {
    return [ "\n		", Spacebars.include(view.lookupTemplate("cluster")), "\n	" ];
  });
}));

Template.__define__("cluster", (function() {
  var view = this;
  return HTML.DIV({
    "class": "cluster",
    id: function() {
      return [ "cluster-", Spacebars.mustache(view.lookup("_id")) ];
    },
    style: function() {
      return [ "top:", Spacebars.mustache(Spacebars.dot(view.lookup("position"), "top")), "px; \n    left:", Spacebars.mustache(Spacebars.dot(view.lookup("position"), "left")), "px" ];
    }
  }, HTML.Raw('\n    <!-- <div class="cluster" id=cluster-{{_id}}> -->\n    '), HTML.DIV({
    "class": "form-group form-group-inline"
  }, "\n      ", HTML.I({
    "class": function() {
      return [ "fa fa-lg ", Blaze.If(function() {
        return Spacebars.call(view.lookup("isCollapsed"));
      }, function() {
        return "fa-chevron-circle-right";
      }, function() {
        return "fa-chevron-circle-down";
      }), " collapser" ];
    }
  }), "\n      ", HTML.LABEL({
    "class": "sort-disabled"
  }, "\n        ", HTML.SPAN({
    "class": function() {
      return [ "clusterlabel ", Spacebars.mustache(view.lookup("named")) ];
    }
  }, Blaze.View(function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("."), "name"));
  })), "\n      "), "\n    "), "\n    ", HTML.UL({
    "class": function() {
      return [ "clusterul cluster-idea-list ", Blaze.If(function() {
        return Spacebars.call(view.lookup("isCollapsed"));
      }, function() {
        return " hidden ";
      }, function() {
        return " show ";
      }) ];
    },
    id: function() {
      return [ "cluster-list-", Spacebars.mustache(view.lookup("_id")) ];
    }
  }, "\n      ", HTML.Raw('<input type="text" class="namecluster form-control input-sm sort-disabled" placeholder="Name this cluster">'), "\n      ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("clusterideas"));
  }, function() {
    return [ "\n        ", Spacebars.include(view.lookupTemplate("ClusterIdeaItem")), "\n      " ];
  }), "\n    "), "\n");
}));

Template.__define__("Clustering", (function() {
  var view = this;
  return [ HTML.DIV({
    "class": "cluster-header row"
  }, "\n    ", HTML.DIV({
    "class": "col-sm-12"
  }, "\n      ", HTML.H1({
    id: "clusterprompt"
  }, "\n        ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("prompt"));
  }), "\n      "), "\n    "), "\n  "), "\n  ", HTML.DIV({
    "class": "cluster-interface row"
  }, "\n	", Spacebars.include(view.lookupTemplate("chatdrawer")), " \n    ", HTML.DIV({
    id: "left-clustering",
    "class": "col-sm-3"
  }, "\n        ", Spacebars.include(view.lookupTemplate("IdeaList")), "\n	"), "\n    ", HTML.DIV({
    id: "middle-clustering",
    "class": "col-sm-2"
  }, "\n      ", Spacebars.include(view.lookupTemplate("ClusterList")), "\n	"), "\n	", HTML.DIV({
    id: "right-clustering",
    "class": "col-sm-7"
  }, "\n      ", HTML.Raw("<h3>Clusters</h3>"), "\n      ", HTML.DIV({
    id: "clusterarea"
  }, "\n        ", Spacebars.include(view.lookupTemplate("clusterarea")), "\n      "), "\n    "), "\n  ") ];
}));

})();
