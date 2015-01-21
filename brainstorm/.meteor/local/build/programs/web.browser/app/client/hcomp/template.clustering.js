(function(){
Template.__checkName("MturkClusterIdeaItem");
Template["MturkClusterIdeaItem"] = new Template("Template.MturkClusterIdeaItem", (function() {
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
  }, "\n  ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("content"));
  }), " \n    ", HTML.SPAN({
    "class": "vote-box"
  }, " \n      ", HTML.Raw('<span class="up-vote vote glyphicon glyphicon-thumbs-up"></span>'), "\n      ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("voteNum"));
  }), "\n    "), "\n");
}));

Template.__checkName("MturkClusteringIdeaList");
Template["MturkClusteringIdeaList"] = new Template("Template.MturkClusteringIdeaList", (function() {
  var view = this;
  return [ Spacebars.include(view.lookupTemplate("HcompFilterBoxHeader")), HTML.Raw("\n\n  <!--Idea List-->\n  "), HTML.DIV({
    id: "idealistwrapper"
  }, "\n    ", HTML.Raw('<!-- <h3 id="idealistHeader">Idea List</h3> -->'), "\n    \n    ", HTML.DIV({
    "class": "idea-box-header"
  }, "\n      ", HTML.SPAN("\n        ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("numIdeas"));
  }), " Ideas\n      "), "\n    "), "\n\n    ", HTML.UL({
    id: "idealist",
    "class": "ideadeck cluster-idea-list"
  }, "\n      ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("ideas"));
  }, function() {
    return [ "\n        ", Spacebars.include(view.lookupTemplate("MturkClusterIdeaItem")), "\n      " ];
  }), "\n    "), "\n  ") ];
}));

Template.__checkName("MturkClusterList");
Template["MturkClusterList"] = new Template("Template.MturkClusterList", (function() {
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

Template.__checkName("MturkClusterarea");
Template["MturkClusterarea"] = new Template("Template.MturkClusterarea", (function() {
  var view = this;
  return [ HTML.Raw('<img src="/trash_can-512.png" class="cluster-trash-can">\n	'), Blaze.Each(function() {
    return Spacebars.call(view.lookup("clusters"));
  }, function() {
    return [ "\n		", Spacebars.include(view.lookupTemplate("MturkCluster")), "\n	" ];
  }) ];
}));

Template.__checkName("MturkCluster");
Template["MturkCluster"] = new Template("Template.MturkCluster", (function() {
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
    return [ "\n        ", Spacebars.include(view.lookupTemplate("MturkClusterIdeaItem")), "\n      " ];
  }), "\n    "), "\n");
}));

Template.__checkName("MturkClustering");
Template["MturkClustering"] = new Template("Template.MturkClustering", (function() {
  var view = this;
  return [ HTML.DIV({
    "class": "mturk-cluster-header row"
  }, "\n    ", HTML.DIV({
    "class": "col-sm-12"
  }, "\n      ", HTML.H1({
    id: "mturk-clusterprompt"
  }, "\n        ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("prompt"));
  }), "\n      "), "\n    "), "\n  "), "\n  ", HTML.DIV({
    "class": "mturk-cluster-interface row"
  }, "\n    ", HTML.DIV({
    id: "left-clustering",
    "class": "col-sm-3"
  }, "\n        ", Spacebars.include(view.lookupTemplate("MturkClusteringIdeaList")), "\n	  "), "\n    ", HTML.DIV({
    id: "middle-clustering",
    "class": "col-sm-2"
  }, "\n      ", Spacebars.include(view.lookupTemplate("MturkClusterList")), "\n	  "), "\n	  ", HTML.DIV({
    id: "right-clustering",
    "class": "col-sm-7"
  }, "\n      ", HTML.DIV({
    id: "clusterarea"
  }, "\n        ", Spacebars.include(view.lookupTemplate("MturkClusterarea")), "\n      "), "\n    "), "\n  ") ];
}));

})();
