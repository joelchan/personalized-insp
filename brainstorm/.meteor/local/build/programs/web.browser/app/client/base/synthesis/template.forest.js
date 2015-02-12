(function(){
Template.__checkName("Forest");
Template["Forest"] = new Template("Template.Forest", (function() {
  var view = this;
  return [ HTML.Raw('<h1 class="page-header" id="clusterprompt">Alternate uses for a whatchamacallit</h1>\n	'), HTML.DIV({
    "class": "container-fluid forest"
  }, "\n		", HTML.DIV({
    "class": "row"
  }, "\n			", HTML.Raw("<!--IdeaList and Node Starter-->"), "\n		  ", HTML.DIV({
    id: "ideas"
  }, "\n			", HTML.DIV({
    "class": "col-md-3"
  }, "\n				", HTML.Raw('<div id="createnode"><h3>Create a New Cluster</h3>\n					<ul class="newstack" id="node-drag-target">\n					Drag idea here to create a new cluster\n					</ul>\n				</div>'), "\n				", HTML.Raw("<h3>Idea List</h3>"), "\n				", HTML.UL({
    id: "idealist",
    "class": "deck"
  }, "\n					", HTML.Raw('<li class="sort-disabled"></li>'), "\n					", Blaze.Each(function() {
    return Spacebars.call(view.lookup("ideas"));
  }, function() {
    return [ "\n						", Blaze.If(function() {
      return Spacebars.call(view.lookup("isClustered"));
    }, function() {
      return [ "\n						", HTML.LI({
        id: function() {
          return Spacebars.mustache(view.lookup("_id"));
        },
        "class": "idea-item"
      }, Blaze.View(function() {
        return Spacebars.mustache(view.lookup("content"));
      })), "\n						" ];
    }), "\n					" ];
  }), "\n				"), "\n			"), "\n			", HTML.Raw("<!--End-->"), "\n\n			", HTML.Raw("<!--Node Builder-->"), "\n			", HTML.DIV({
    id: "buildcluster",
    "class": "col-md-3"
  }, "\n				", HTML.Raw("<h3>Add to Cluster</h3>"), "\n				", HTML.UL({
    id: function() {
      return Spacebars.mustache(view.lookup("ideaNode"));
    },
    "class": "stack"
  }, "\n					", HTML.DIV({
    "class": "form-group"
  }, "\n						", HTML.LABEL({
    "class": "sort-disabled"
  }, "Cluster Name:\n							", HTML.SPAN({
    id: "clusterlabel",
    "class": "sort-disabled"
  }, Blaze.View(function() {
    return Spacebars.mustache(view.lookup("ideaNodeName"));
  })), "\n						"), "\n						", HTML.Raw('<input type="text" class="clusternodename form-control input-sm sort-disabled" id="namecluster" placeholder="Name this cluster">'), "\n					"), "\n					", Blaze.Each(function() {
    return Spacebars.call(view.lookup("ideaNodeIdeas"));
  }, function() {
    return [ "\n						", HTML.LI({
      id: function() {
        return Spacebars.mustache(view.lookup("_id"));
      },
      "class": "idea-item"
    }, Blaze.View(function() {
      return Spacebars.mustache(view.lookup("content"));
    })), "\n					" ];
  }), "\n				"), "\n				", HTML.Raw('<button id="finish" class="btn btn-large btn-primary">Finished</button>'), "\n			"), "\n			", HTML.Raw("<!--End-->"), "\n		  "), "\n\n			", HTML.Raw("<!--Idea Node and Best Match Node Status-->"), "\n			", HTML.DIV({
    id: "nodestatus",
    "class": "col-md-6"
  }, "\n				", HTML.Raw("<h3>Working Nodes</h3>"), "\n				", HTML.Raw("<h4>Node to be Inserted</h4>"), "\n				", HTML.UL({
    id: function() {
      return Spacebars.mustache(view.lookup("ideaNode"));
    },
    "class": "ideanode donestack"
  }, "\n					", HTML.Raw('<i class="fa fa-angle-double-down sort-disabled"></i>'), "\n					", HTML.LABEL({
    "class": "sort-disabled"
  }, "\n						", HTML.SPAN({
    "class": "named sort-disabled"
  }, Blaze.View(function() {
    return Spacebars.mustache(view.lookup("ideaNodeName"));
  })), "\n					"), "\n					", Blaze.Each(function() {
    return Spacebars.call(view.lookup("ideaNodeIdeas"));
  }, function() {
    return [ "\n						", HTML.LI({
      id: function() {
        return Spacebars.mustache(view.lookup("_id"));
      },
      "class": "idea-item"
    }, Blaze.View(function() {
      return Spacebars.mustache(view.lookup("content"));
    })), "\n					" ];
  }), "\n					", Blaze.Each(function() {
    return Spacebars.call(view.lookup("clusterChildren"));
  }, function() {
    return [ "\n						", HTML.LI({
      id: function() {
        return Spacebars.mustache(view.lookup("."));
      },
      "class": "cluster-item"
    }, Blaze.View(function() {
      return Spacebars.mustache(view.lookup("clusterName"));
    })), "\n					" ];
  }), "\n				"), "\n				", HTML.Raw("<h4>Best Match Node</h4>"), "\n				", HTML.UL({
    id: function() {
      return Spacebars.mustache(view.lookup("bestMatchNode"));
    },
    "class": "bestmatch donestack"
  }, "\n					", HTML.Raw('<i class="fa fa-angle-double-down sort-disabled"></i>'), "\n					", HTML.LABEL({
    "class": "sort-disabled"
  }, "\n						", HTML.SPAN({
    id: "bmname",
    "class": "sort-disabled"
  }, Blaze.View(function() {
    return Spacebars.mustache(view.lookup("bestMatchName"));
  })), "\n					"), "\n					", Blaze.Each(function() {
    return Spacebars.call(view.lookup("bestMatchIdeas"));
  }, function() {
    return [ "\n						", HTML.LI({
      id: function() {
        return Spacebars.mustache(view.lookup("_id"));
      },
      "class": "idea-item"
    }, Blaze.View(function() {
      return Spacebars.mustache(view.lookup("content"));
    })), "\n					" ];
  }), "\n					", Blaze.Each(function() {
    return Spacebars.call(view.lookup("clusterchildren"));
  }, function() {
    return [ "\n						", HTML.LI({
      id: function() {
        return Spacebars.mustache(view.lookup("."));
      },
      "class": "cluster-item"
    }, Blaze.View(function() {
      return Spacebars.mustache(view.lookup("clustername"));
    })), "\n					" ];
  }), "\n				"), "\n			"), "\n			", HTML.Raw("<!--End-->"), "\n\n			", HTML.Raw("<!--Children of Best Match Node-->"), "\n			", HTML.DIV({
    id: "tree",
    "class": "col-md-6"
  }, "\n				", HTML.H3(Blaze.View(function() {
    return Spacebars.mustache(view.lookup("userPrompt"));
  })), "\n				", Blaze.Each(function() {
    return Spacebars.call(view.lookup("bestMatchChildren"));
  }, function() {
    return [ "\n					", HTML.UL({
      "class": "donestack ",
      id: function() {
        return Spacebars.mustache(view.lookup("."));
      }
    }, "\n						", HTML.I({
      "class": "fa fa-angle-double-down sort-disabled"
    }), "\n						", HTML.LABEL({
      "class": "sort-disabled"
    }, Blaze.View(function() {
      return Spacebars.mustache(view.lookup("myName"));
    })), "\n						", Blaze.Each(function() {
      return Spacebars.call(view.lookup("clusterIdeas"));
    }, function() {
      return [ "\n							", HTML.LI({
        id: function() {
          return Spacebars.mustache(view.lookup("_id"));
        },
        "class": "idea-item"
      }, Blaze.View(function() {
        return Spacebars.mustache(view.lookup("content"));
      })), "\n						" ];
    }), "\n						", Blaze.Each(function() {
      return Spacebars.call(view.lookup("clusterChildren"));
    }, function() {
      return [ "\n							", HTML.LI({
        id: function() {
          return Spacebars.mustache(view.lookup("."));
        },
        "class": "cluster-item"
      }, Blaze.View(function() {
        return Spacebars.mustache(view.lookup("clusterName"));
      })), "\n						" ];
    }), "\n						"), "\n				" ];
  }), "\n				", Blaze.If(function() {
    return Spacebars.call(view.lookup("isBestMatch"));
  }, function() {
    return [ "\n					", HTML.BUTTON({
      id: "bmback",
      "class": "btn btn-large btn-default"
    }, "Back"), "\n					", HTML.A({
      href: "#",
      id: "nomatch",
      "class": "btn btn-large btn-primary",
      "data-toggle": "modal",
      "data-target": "#confirmModal"
    }, "No Good Matches"), "\n				" ];
  }), "\n			"), "\n			", HTML.Raw("<!--End-->"), "\n\n			", HTML.Raw("<!--Generalization Option Buttons-->"), "\n			", HTML.DIV({
    id: "generalize",
    "class": "col-md-6"
  }, "\n				", HTML.H3(Blaze.View(function() {
    return Spacebars.mustache(view.lookup("userPrompt"));
  })), "\n				", HTML.Raw('<a href="#" id="both" class="btn btn-large btn-primary" data-toggle="modal" data-target="#confirmModal">Merge</a>'), "\n				", HTML.Raw("<p>If both nodes generalize each other, click 'Merge'. This creates one node out of the idea node and the best match node at the location of the best match node. The new name will be [Name of Best Match]+[Name of Node to be Inserted].</p>"), "\n				", HTML.Raw('<a href="#" id="neither" class="btn btn-large btn-primary" data-toggle="modal" data-target="#nameModal">Create Artificial Node</a>'), "\n				", HTML.Raw("<p>If the nodes are related, but neither generalizes the other, click 'Create Artificial Node'. This will become the parent of both nodes, and you will be asked to provide a name that captures the missing semantic content</p>"), "\n				", HTML.Raw('<button id="ideanode" class="btn btn-large btn-primary">Idea node is parent</button>'), "\n				", HTML.Raw("<p>If the idea node is more general than the best match node, click 'Idea Node is Parent'. This sets the idea node as the parent of the best match node.</p>"), "\n				", HTML.Raw('<button id="bestnode" class="btn btn-large btn-primary">Best Match Node is Parent</button>'), "\n				", HTML.Raw("<p>If the idea node is more general than the best match node, click 'Best Match Node is Parent'. This sets the the best match node as the parent of the idea node.</p>"), "\n				", HTML.Raw('<button id="genback" class="btn btn-large btn-default">Back</button>'), "\n			"), "\n			", HTML.Raw("<!--End-->"), "\n		"), "\n	"), HTML.Raw('\n	<!--End Container-->\n\n	<!--Artificial Node Naming Modal-->\n	<div class="modal fade" id="nameModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\n    	<div class="modal-dialog">\n        	<div class="modal-content"> \n          		<div class="modal-header">\n            		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n           			<h4 class="modal-title" id="myModalLabel">Name Artificial Node</h4>\n           		</div>\n           		<div class="modal-body">\n              		<div class="input-group">\n              			<span class="input-group-addon">Name of Articial Node</span>\n              			<input type="text" class="form-control" id="artificial-name">\n              		</div>\n              		<h4>Be sure to try and capture the semantic content of both clusters with your new name. There is no maximum length.</h4>\n              		<div id="nameWarning"></div>\n              	</div>\n           		<div class="modal-footer">\n               		<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n             		<button type="button" class="btn btn-primary" id="save-name" data-dismiss="modal">Make Node</button>\n       			</div>\n    		</div>\n  		</div>\n	</div>\n	<!--End-->\n\n	<!--Confirm Action Modal-->\n	<div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\n    	<div class="modal-dialog">\n        	<div class="modal-content"> \n          		<div class="modal-header">\n            		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n	       			<h4 class="modal-title" id="myModalLabel">Confirm</h4>\n    	  		</div>\n     		 	<div class="modal-body">\n        			<h3>Are you sure?</h3>\n	      		</div>\n    	  		<div class="modal-footer">\n        			<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>\n        			<button id="yes" type="button" class="btn btn-primary" data-dismiss="modal">Yes, I\'m Sure</button>\n	      		</div>\n    		</div>\n  		</div>\n	</div>') ];
}));

})();
