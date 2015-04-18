var logger = new Logger('Client:DataForest:Forest');
// Comment out to use global logging level
Logger.setLevel('Client:DataForest:Forest', 'trace');
//Logger.setLevel('Client:DataForest:Forest', 'debug');
//Logger.setLevel('Client:DataForest:Forest', 'info');
//Logger.setLevel('Client:DataForest:Forest', 'warn');

//Maps routes to templates

//state machine
	//current step/prompt
		//1. Create idea node/cluster : IdeaNodeCreation
		//2. find best match : FindBestMatch
		//3. generalization : Generalization
			//both -> merge two nodes
				//exit do
			//neither -> artifical node creation
				//exit do
			//idea more general
			//best match more general
//currentNode; is root at beginning of every new node insertion
//ideaNode; node being inserted
//bestMatchNode; node with highest similarity to ideaNode


//ui things to add:
  //possibly undo button? very annoying to implement
	//X -- back button - dependent on tracking path
	//X -- modal asking for confirmation before inserting nodes?
	//X -- fix modals
	//X -- slide down input and label when new cluster is started
	//X -- fix so that "not named" is red whenever a new cluster is created and not yet named
	//X -- relabel tree area?
	//X -- improve general style
	//X -- possibly change some .animate()s to .hide()s as the animation can look strange

//Define which stage in tree traversal user is currently.
var States = {
	NODECREATION: {val: 0, name: "IdeaNodeCreation", 
		prompt: "Subtree Roots"},
	BESTMATCH: {val: 1, name: "FindBestMatch", 
		prompt: "Select most similar node to the node to be inserted (or select no node if none match)"},
	GENERALIZE: {val: 2, name: "Generalization", 
		prompt: "Do the nodes generalize each other in any way?"}
}
Object.freeze(States);

//Session.set("currentNode", "-1"); 
//Session.set("ideaNode", "0"); //node to be inserted
//Session.set("bestMatchNode", "-1"); //node most similar to node being inserted
//Session.set("currentState", States.NODECREATION);
//Session.set("swapped", false);
var path = [-1]; //tracks path starting from root. Used by back button.


/********************************************************************
* Attaches .sortable() to all lists when template is rendered.
*********************************************************************/
Template.Forest.rendered = function(){

	//$('ul.newstack').sortable({
		//receive : function(event, ui){
      //logger.trace("sortable recieved ui item: ");
      //var ideaID = $(ui.item[0]).attr('id');
			//var currClusID = createCluster(ui.item); //creates and inserts a new cluster, returns ID
      //Session.set("ideaNode", currClusID); //sets ID as idea node
//
      ////set up UI to add to cluster
      //$('#createnode').slideToggle();
      //$('#buildcluster').slideToggle();
      //$('#clusterlabel').addClass('unnamed');
      //$('#namecluster').val('');
      //ui.item.remove();
		//},
	//});
  
	$('#idealist').sortable({
		items: ">*:not(.sort-disabled)",
		connectWith:'ul.newstack, ul.stack',
		receive: function(event, ui){
      var myIdeaId = $(ui.item).attr('id');
      if(ui.sender.hasClass('stack')){
        processIdeaSender(ui, myIdeaId);
      } else {
        alert("unknown sender"); //no way for this to happen
        return false;
      }
      updateIdeas(myIdeaId, false);
    }
	});
  var prompt = Session.get("currentPrompt");
  var root = Nodes.findOne({type: 'root', promptID: prompt['_id']});
  Session.set("currentNode", root);
  Session.set("ideaNode", "0"); //node to be inserted
  Session.set("bestMatchNode", null); //node most similar to node being inserted
  Session.set("currentState", States.NODECREATION);
  Session.set("swapped", false);

	//$('ul.stack').sortable({
		//items: ">*:not(.sort-disabled)",
		//connectWith: '#idealist',
		//receive : function(event, ui){
			//var ideaId = $(ui.item).attr('id');
			//var clusterId = $(this).attr('id');
			//addToCluster(ideaId, clusterId);
		//},
	//});
}
Template.ForestIdea.onRendered(function() {
  $(this).draggable({
    revert: true,
    helper: 'clone',
    appendTo: ".forest",
    refreshPositions: true,
    start: function(e, ui) {
      logger.debug("Began dragging an idea");
      logger.trace(ui.helper[0]);
      var width = $(this).css('width');
      logger.trace(width);
    },
  });
  // Set the ID according to the _id of the node
  var id = "#" + this.data['_id']
  this.$(".forest-idea-item").attr("id", this.data['_id']);
  //logger.trace(this.$(".forest-idea-item"))
  $(id).data("node", this.data);

});

Template.ForestCreateCluster.rendered = function() {
  $(".newstack").droppable({
    accept: '.forest-idea-item',
    tolerance: "pointer",
    drop: function(event, ui) {
      logger.debug("New idea dropped into IdeaNode");
      //logger.trace(JSON.stringify(this));
      logger.trace(ui.draggable[0]);
      logger.trace($(ui.draggable[0]).data("node"));
      var myIdeaId = $(ui.draggable[0]).attr('id');
      logger.debug("Recieved idea with nodeID: " + myIdeaId);
      var node = $("#" + myIdeaId).data("node");
      logger.trace(JSON.stringify(node));
      //var nodes = Nodes.find({'_id': data['_id']})
      //logger.debug("matching nodes: " + nodes.count());
      var parent = ui.helper.context.parentElement;
      logger.trace(parent);
      //creates and inserts a new cluster, returns ID
			var currCluster = ForestManager.createIdeaNode([node,]) 
      //sets ID as idea node
      Session.set("ideaNode", currCluster); 
      
      Blaze.renderWithData(
          Template.ForestNodeBuilder, 
          currCluster,
          $("#forest")[0],
          $("#tree-viz")[0]
      );
      $("#createnode").remove()
    }
  });
};

/********************************************************************
* Template Helpers
*********************************************************************/
Template.Forest.helpers({
  prompt: function() {
    return Session.get("currentPrompt").question;
  },
  //isGeneralize : function(){
  	//if(Session.get("currentState").val === 2)
  		//return true;
  	//return false;
  //}
});
Template.ForestIdeaList.helpers({
	ideaClusters : function(){
    var nodes =  Nodes.find({
        promptID: Session.get("currentPrompt")._id, 
        type: 'forest_precluster'
    }).fetch()
    var clusteredIDs = []
    for (var i=0; i<nodes.length; i++) {
      clusteredIDs = clusteredIDs.concat(nodes[i]['idea_node_ids']);
    }
    var otherNodes = Nodes.find({
        promptID: Session.get("currentPrompt")._id, 
        type: 'forest_idea',
        _id: {$nin: clusteredIDs}},
        {fields: {_id: 1}}
    ).fetch()
    nodes = nodes.concat({idea_node_ids: _.pluck(otherNodes, '_id')
    });
    return nodes
  },
	isClustered : function(){
    if(this.inCluster){
     	return false;
   	} else {
     	return true;
    }
  },
});

Template.PreforestIdeaCluster.helpers({
  ideas: function() {
    logger.trace("Preforest idea node list: " + JSON.stringify(this.idea_node_ids));
    var nodes =  Nodes.find({
        _id: {$in: this.idea_node_ids},
        is_clustered: false
    });
    logger.debug("Current node has " + nodes.count() + " unclustered ideas") 
    return nodes
  }, 
});
Template.ForestNodeBuilder.onRendered(function() {
  $("#buildcluster .form-group").droppable({
    accept: '.forest-idea-item',
    tolerance: "pointer",
    drop: function(event, ui) {
      var myIdeaId = $(ui.draggable[0]).attr('id');
      logger.debug("Recieved idea with nodeID: " + myIdeaId);
      var instance = $("#" + myIdeaId).data("node");
      logger.trace(JSON.stringify(instance));
      var currNode = Session.get("ideaNode");
      ForestManager.groupIdeas([instance], currNode);
    }

  });
  logger.debug("Setting data for new idea node" + JSON.stringify(Session.get("ideaNode")));
  $("#buildcluster .form-group").data("node", Session.get("ideaNode"));
});

Template.ForestNodeBuilder.helpers({
  //return list of ideas contained by idea node
  ideaNodeIdeas : function(){
    logger.trace("Node Builder current idea node: " + JSON.stringify(this));
    return ForestManager.getInstanceIdeas(Session.get('ideaNode'));
  },
  ideaNodeName : function(){
  	var currNode = Session.get('ideaNode');
  	var currCluster = Nodes.findOne({_id: currNode['_id']});
    return Session.get('ideaNode'['label']);
  },
  ideaNode : function(){
  	return Session.get('ideaNode')['_id'];
  },
});

Template.ForestNodeBuilder.events({
  //update cluster name as user types
	// 'keyup #namecluster' : function(event, template){
    // logger.trace("Updating label of idea node");
    // logger.trace(event);
    // logger.trace($(event.target).parent().attr("id"));
    // var name = $(event.target).val();
    // logger.trace("Updating node to label: " + name);
    // var node = $(event.target).parent().data("node");
    // logger.trace(node);
    // Nodes.update({_id: node['_id']}, {$set: {label: name}});
  // },
  //click Finish
  'click button#finish' : function(){
    var label = $("#namecluster").val();
    //make sure a name has been provided
  	//if(label === undefined || label === "") { 
  		//alert("Please name cluster");
  		//return false;
  	//} else { 
  		//if current node has no children, insert idea node under current
  	  var compareNode = Nodes.findOne({_id: Session.get("ideaNode")['_id']});
      var currNode = Nodes.findOne({_id: Session.get("currentNode")._id});
  		if(ForestManager.getNodeChildren(currNode).length == 0) {
        ForestManager.insertToTree(currNode, compareNode);
        //Reset UI to initial
        Blaze.render(
            Template.ForestCreateCluster,
            $("#ideas")[0],
            $("#unclustered-ideas")[0]
        );
        $("#buildcluster").remove();
        resetState()
  		} else { //else continue to next state
  			Session.set("currentState", States.BESTMATCH);
  			$('#ideas').hide(function(){
          Blaze.renderWithData(
              Template.ForestNodeStatus, 
              currNode,
              $("#forest")[0],
              $("#tree-viz")[0]
          );
          Blaze.render(
              Template.ForestBestMatch,
              $("#forest")[0],
              $("#tree-viz")[0]
          );
  			});
        
        $("#buildcluster").remove();
  		}
  	//}
  },
});

Template.ForestNodeStatus.helpers({
  ideaNode : function(){
  	return Nodes.findOne({_id: Session.get('ideaNode')._id});
  },
  //return list of ideas contained by idea node
  // ideaNodeIdeas : function(){
    // return ForestManager.getInstanceIdeas(Session.get('ideaNode'))
  // },
  // ideaNodeName : function(){
  	// //var currNode = Session.get('ideaNode');
  	// //var currCluster = Nodes.findOne({_id: currNode._id});
    // return ForestManager.getNodeName(Session.get("ideaNode"));
  // },
  clusterChildren : function(){
    logger.debug("children of current cluster: " + JSON.stringify(this));
    return ForestManager.getNodeChildren(Session.get("currentNode"))
  },
  isBestMatch: function() {
    if (Session.get("currentState").val == 1) {
      return true;
    } else {
      return false;
    }
  },
  bestMatchNode: function() {
    return Session.get("bestMatchNode");
  },
  //clusterName : function(){
    //var node = Nodes.findOne({_id: this._id});
    //if (node.label) {
      //return node.label
    //} else {
      //return false
    //}
  //},
  //return list of ideas contained by best match node
  //bestMatchIdeas : function(){
  	//var currNodeID = Session.get('bestMatchNode');
  	//var currCluster = Clusters.findOne({_id: currNodeID});
		//if(currCluster !== undefined){
			//return currCluster.ideas;
		//}
  //},
  //bestMatchName : function(){
  	//var currNodeID = Session.get('bestMatchNode');
  	//var currCluster = Clusters.findOne({_id: currNodeID});
		//if(currCluster !== undefined && currCluster.name !== undefined){
      //$('#bmname').removeClass('text-danger');
			//return currCluster.name;
		//} else {
      //$('#bmname').addClass('text-danger');
      //return "No Match Picked";
    //}
  //},
  //bestMatchNode : function(){
  	//return Session.get('bestMatchNode');
  //},
});

Template.ForestNodeStatus.events({
  'click .forest-idea-node' : function(event){
    logger.debug("clicked on a cluster");
    logger.trace(this)
    logger.trace(event.currentTarget)
    logger.trace(event);
    var id = '#' + this['_id']
    var parent = $(id).parent()
    var target = $(event.target)
    logger.trace(parent)
    if ($(parent).hasClass("stack") && !$(event.target).hasClass("fa")) {
      logger.debug("clicked on selectable cluster");
      if ($(id).hasClass("selected-node")) {
        $(id).toggleClass("selected-node");
        Session.set("bestMatchNode", null);
      } else {
        //Clear all selected clusters
        $(".selected-node").not(id).toggleClass("selected-node");
        //Mark clicked cluster as selected
        $(id).toggleClass("selected-node");
        //Set selected cluster node as the current best match
        Session.set("bestMatchNode", this);
      }
    } else {
      logger.debug("clicked on non-selectable cluster");
    }
  },
  'dblclick .forest-idea-node' : function(event){
    /* select best match */
    logger.debug("double clicked on a cluster");
    logger.trace(this)
    logger.trace(event.currentTarget)
  	//don't do anyhting if not in best match state
  	//if(Session.get("currentState").val !== 1) {
      //logger.debug("not looking for best match, so ignoreing");
  		//return false;
    //}
    //var id = '#' + this['_id']
    //var parent = $(id).parent()
    //logger.trace(parent)
    //if ($(parent).hasClass("stack")) {
      //logger.debug("clicked on selectable cluster");
      //$(".selected-node").not(id).toggleClass("selected-node");
      //$(id).toggleClass("selected-node");
      //Session.set("bestMatchNode", this);
    //} else {
      //logger.debug("clicked on non-selectable cluster");
    //}
  	//path.push(this.toString());
		/* //if current node has no children, add idea node as child of current node, exit do */
  	/* if(Clusters.findOne({_id : Session.get("currentNode")}).children.length === 0){ */
  		/* addChild(this.toString()); */
  		/* exitDo(); */
  	/* } else { */
  		/* //move to next state */
  		/* $('#tree').hide(function(){ */
        /* Blaze.render( */
          /* Template.ForestGeneralize, */
          /* $("#forest")[0] */
        /* ) */
  		/* }); */
  		/* Session.set("currentState", States.GENERALIZE); */
  	/* } */
  },


});
Template.ForestBestMatch.helpers({
  userPrompt : function(){
    if (Session.get("currentState") == undefined) {
      return States.NODECREATION.prompt;
    } else {
  	  return Session.get("currentState").prompt;
    }
  },
  // myName : function(){
  	// var cluster = Clusters.findOne({_id: this.toString()});
  	// if(cluster === undefined) 
  		// return false;
  	// return cluster.name;
  // },
  // clusterIdeas : function(){
  	// var cluster = Clusters.findOne({_id: this.toString()});
  	// if(cluster === undefined) 
  		// return false;
  	// return cluster.ideas;
  // },
  // clusterChildren : function(){
  	// var cluster = Clusters.findOne(this.toString());
    // if(cluster === undefined)
    	// return false;
    // else return cluster.children;
  // },
  isBestMatch : function(){
  	if(Session.get("currentState").val === 1)
  		return true;
  	return false;
  },
  // bestMatchChildren : function(){
  	// var currNodeID = Session.get('bestMatchNode');
  	// //console.log(currNodeID);
  	// var currCluster = Clusters.findOne({_id: currNodeID});
  	// //console.log(currCluster);
  	// if(currCluster === undefined){ 
  		// //console.log("best match children undefined");
  		// return false;
  	// }
		// return currCluster.children;
  // },
});

Template.ForestBestMatch.events({
  'click #nextStep': function (event) {
    logger.debug("Clicked to continue to next step");
    var bestMatch = Session.get("bestMatchNode");
    // If no node is selected then insert node as child of currNode
    if (bestMatch == null) {
      logger.debug("Setting new node as child of current node: " + 
          JSON.stringify(Session.get("currentNode")));
      //Add node as child of current node
      ForestManager.insertToTree(
          Session.get("currentNode"),
          Session.get("ideaNode")
      );
      //Reset UI
      $("#nodestatus").remove();
      $("#best-match").remove();
      Blaze.render(
          Template.ForestCreateCluster,
          $("#ideas")[0],
          $("#unclustered-ideas")[0]
      )
      $("#ideas").slideToggle()
      resetState();
    } else {
      //Continue to generalization step
      Session.set("currentState", States.GENERALIZE);
      $("#best-match").remove();
      Blaze.render(
          Template.ForestGeneralize,
          $("#forest")[0],
          $("#tree-viz")[0]
      );

    }
  },
  'click #bmback': function (event) {
    logger.debug("Clicked to rewind to previous step");
    // Reset state back to node creation
    Session.set("currentState", States.NODECREATION);
    // Setting UI back to node builder state
    $("#best-match").remove();
    $("#nodestatus").remove();
    $("#ideas").show();
    Blaze.renderWithData(
        Template.ForestNodeBuilder, 
        Session.get("ideaNode"),
        $("#forest")[0],
        $("#tree-viz")[0]
    );
  },
});
Template.ForestGeneralize.helpers({
  userPrompt : function(){
    if (Session.get("currentState") == undefined) {
      return States.NODECREATION.prompt;
    } else {
  	  return Session.get("currentState").prompt;
    }
  },
  // myName : function(){
  	// var cluster = Clusters.findOne({_id: this.toString()});
  	// if(cluster === undefined) 
  		// return false;
  	// return cluster.name;
  // },
  // clusterIdeas : function(){
  	// var cluster = Clusters.findOne({_id: this.toString()});
  	// if(cluster === undefined) 
  		// return false;
  	// return cluster.ideas;
  // },
  // clusterChildren : function(){
  	// var cluster = Clusters.findOne(this.toString());
    // if(cluster === undefined)
    	// return false;
    // else return cluster.children;
  // },
  // isBestMatch : function(){
  	// if(Session.get("currentState").val === 1)
  		// return true;
  	// return false;
  // },
});
Template.ForestGeneralize.events({
  //click to merge
  'click #both' : function(event){
    logger.debug("Clicked to merge idea and tree nodes");
  	//get name and ideas form idea node
    //Grab both the new idea node and the selected node
  	var ideaNode = Nodes.findOne(
        {_id: Session.get("ideaNode")._id}
    );
  	var bestMatchNode = Nodes.findOne(
        {_id: Session.get("bestMatchNode")._id}
    );
    ForestManager.mergeNodes(bestMatchNode, ideaNode);
    //Reset to beginning
    $("#generalize").remove();
    $("#nodestatus").remove();
    $("#ideas").slideToggle()
    Blaze.render(
        Template.ForestCreateCluster,
        $("#ideas")[0],
        $("#unclustered-ideas")[0]
    );
    resetState();
    //Session.set("currentState", States.NODECREATION);
    //Session.set("ideaNode", null);
    //Session.set("bestMatchNode", null);
    //var root = Nodes.findOne(
        //{type: 'root', promptID: Session.get("currentPrompt")._id}
    //);
    //logger.trace(root)
    //Session.set("currentNode", root);
  	//exitDo();
  },

  //create artifical node
  'click #neither' : function(){
    logger.debug("Clicked to create articial parent for idea and tree nodes");
    $("#nameModal").modal('show')
  },

  //idea node more general than best match
  'click #idea-node-parent' : function(){
    logger.debug("Clicked to set tree node as parent to idea node");
    var ideaNode = Session.get("ideaNode")
    var bestMatch =  Session.get("bestMatchNode")
    ForestManager.swapNodes(ideaNode, bestMatch);

    // Swap State variables back to similarity comparison state and
    // traverse down tree with idea node as current node
  	Session.set("currentState", States.BESTMATCH);
  	Session.set("currentNode", ideaNode);
    Session.set("ideaNode", bestMatch);
    Session.set("bestMatchNode", null);
    // Transition UI back to similarity comparison
    $('#generalize').remove()
    Blaze.render(
        Template.ForestBestMatch,
        $("#forest")[0],
        $("#tree-viz")[0]
    );
  },

  //best match more general than idea node
  'click #best-node-parent' : function(){
    logger.debug("Clicked to set idea node as parent to tree node");
    var ideaNode = Session.get("ideaNode")
    var bestMatch =  Session.get("bestMatchNode")

    // Swap State variables back to similarity comparison state and
    // traverse down tree with best match node as current node
  	Session.set("currentState", States.BESTMATCH);
  	Session.set("currentNode", bestMatch);
    Session.set("bestMatchNode", null);
    // Transition UI back to similarity comparison
    $('#generalize').remove()
    Blaze.render(
        Template.ForestBestMatch,
        $("#forest")[0],
        $("#tree-viz")[0]
    );
  },

  //go back while in generalization stage of traversal
  'click button#genback' : function(){
  	Session.set("currentState", States.BESTMATCH);
  	Session.set("bestMatchNode", null);
    $('#generalize').remove();
    Blaze.render(
        Template.ForestBestMatch,
        $("#forest")[0],
        $("#tree-viz")[0]
    );
  },

})

Template.ForestViz.helpers({
  rootNode: function() {
    var root = Nodes.findOne({type: 'root', 
        promptID: Session.get("currentPrompt")._id});
    logger.trace("Forest Viz root: " + JSON.stringify(root));
    return root
  },
  childNodes: function() {
    var children = ForestManager.getNodeChildren(this, {'label': 1});
    logger.trace("Forest Viz children of root: " + 
        JSON.stringify(children));
    return children
  },
});

Template.ForestTree.helpers({
  name: function() {
    var name = ForestManager.getNodeName(this); 
    logger.trace("Forest tree name: " + name);
    return name
  },
  childNodes: function() {
    var children = ForestManager.getNodeChildren(this, {'label': 1});
    logger.trace("Forest tree children: " + JSON.stringify(children));
    return children
  },
});

Template.ForestIdeaNode.onRendered(function() {
  logger.trace("Rendering idea node: ");
  logger.trace(this);
  var id = this.data['_id'];
  $("#" + id).data("node", this.data);
});

Template.ForestIdeaNode.helpers({
  name: function() {
    var name = ForestManager.getNodeName(this); 
    logger.trace("Forest tree name: " + name);
    return name
  },
  childNode: function() {
    return ForestManager.getInstanceIdeas(this);
  },
});

Template.ForestNodeName.events({
  'click #make-node': function(event) {
    logger.debug("clicked save-name to make node artificial node"); 
    //$("#nameModal").modal('hide');
  	//get name from user
      //var newName = $("#artificial-name").val();
      //console.log(newName);
      //if(newName === "" || newName === undefined){
        //$('#nameWarning').empty();
        //$('#nameWarning').append("<h4 class='text-danger'>Please provide a name.</h4>");
        //return false;
      //}
//
    	////clone best match
  	  //var bestMatch = Clusters.findOne({_id: Session.get("bestMatchNode")});
      //var clone = {
        //name: bestMatch.name,
  		  //children: bestMatch.children,
  		  //ideas: bestMatch.ideas
      //} //copy fields except id so a new id is generated on insert
      //var cloneId = Clusters.insert(clone);
//
      //Clusters.remove(Session.get("bestMatchNode"))
      ////update best match in collection such that is has name provided
      //Clusters.insert({
  		  //_id: Session.get("bestMatchNode"),
  		  //name: newName,
  		  //children: [Session.get("ideaNode"), cloneId]
    	//});
//
      //exitDo();

  	var ideaNode = Nodes.findOne(
        {_id: Session.get("ideaNode")._id}
    );
  	var bestMatchNode = Nodes.findOne(
        {_id: Session.get("bestMatchNode")._id}
    );
    var label = $("#artificial-name").val();
    logger.debug("Creating Artificial Node with label: " + label); 
    var an = ForestManager.createArtificialNode(bestMatchNode, ideaNode, label);
    ForestManager.insertToTree(Session.get("currentNode"), an);
    //ForestManager.insertToTree(an, ideaNode);
    //ForestManager.insertToTree(an, bestMatchNode);
    //Reset to beginning
    $("#nameModal").modal('hide');
    $("#generalize").remove();
    $("#nodestatus").remove();
    $("#ideas").slideToggle()
    Blaze.render(
      Template.ForestCreateCluster,
      $("#ideas")[0],
      $("#unclustered-ideas")[0]
    );
    resetState();

  },

});

/********************************************************************
* Template Events
*********************************************************************/
Template.Forest.events({

  //collapse and expand clusters
  'click .fa' : function(){
    //toggle the arrow from down to right
    if($(event.target).hasClass('fa-angle-double-down')){
      $(event.target).switchClass('fa-angle-double-down', 
      	'fa-angle-double-right', 10);
    } else {
      $(event.target).switchClass('fa-angle-double-right', 
      	'fa-angle-double-down', 10);
    }
    //$(event.target).parent().children('li').slideToggle("fast");
    return false;
  },


  //go back while in best match stage of traversal
  'click button#bmback' : function(){
  	if(Session.get("swapped")){
  		swapNodes();
  		Session.set("swapped",false);
  	}

  	if(path.length > 1){
  		Session.set("currentState", States.GENERALIZE);
  		$('#tree').hide(function(){
        Blaze.render(
          Template.ForestGeneralize,
          $('#forest')[0]
        )
  		});
  	} else {
  		Session.set("currentState", States.NODECREATION);
      $('#nodestatus').remove()
  		$('#ideas').slideToggle();
  	}
  },
});

Template.ForestIdeaNode.events({
  
  'dblclick .forest-idea-node' : function(event){
    /* select best match */
    logger.debug("double clicked on a cluster");
    logger.trace(this)
    logger.trace(event.currentTarget)
  	//don't do anyhting if not in best match state
  	if(Session.get("currentState").val !== 1) {
      logger.debug("not looking for best match, so ignoreing");
  		return false;
    }
    var id = '#' + this['_id']
    var parent = $(id).parent()
    logger.trace(parent)
    if ($(parent).hasClass("stack")) {
      logger.debug("clicked on selectable cluster");
      $(".selected-node").not(id).toggleClass("selected-node");
      $(id).toggleClass("selected-node");
      Session.set("bestMatchNode", this);
    } else {
      logger.debug("clicked on non-selectable cluster");
    }
  	path.push(this.toString());
		//if current node has no children, add idea node as child of current node, exit do
  	if(Clusters.findOne({_id : Session.get("currentNode")}).children.length === 0) {
      logger.debug("Adding idea node to child of current")
  		/* addChild(this.toString()); */
  		/* exitDo(); */
  	/* } else { */
  		/* //move to next state */
  		/* $('#tree').hide(function(){ */
        /* Blaze.render( */
          /* Template.ForestGeneralize, */
          /* $("#forest")[0] */
        /* ) */
  		/* }); */
  		/* Session.set("currentState", States.GENERALIZE); */
  	}
  },

  'click .forest-idea-node .fa': function(event) {
    logger.debug("Clicked on collapse/expand of idea list");
    var id = '#list-' + this['_id'];
    logger.debug("looking at cluster with id: " + id);
    $(id).collapse('toggle'); 
  },
});


/********************************************************************
* Convenience funtions
*********************************************************************/
function resetState() {
  //Reset to beginning
  Session.set("currentState", States.NODECREATION);
  Session.set("ideaNode", null);
  Session.set("bestMatchNode", null);
  var root = Nodes.findOne(
      {type: 'root', promptID: Session.get("currentPrompt")._id}
  );
  logger.trace(root)
  Session.set("currentNode", root);
}
