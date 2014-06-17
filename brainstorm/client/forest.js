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

var States = {
	NODECREATION: {val: 0, name: "IdeaNodeCreation", 
		prompt: "Create a new cluster"},
	BESTMATCH: {val: 1, name: "FindBestMatch", 
		prompt: "Find the best match among the current nodes" },
	GENERALIZE: {val: 2, name: "Generalization", 
		prompt: "Do the nodes generalize each other in any way?"}
}

Object.freeze(States);

//var activeCluster = false;
Session.set("currentNode", "1");
Session.set("ideaNode", "0");
Session.set("bestMatchNode", "1");
Session.set("currentState", States.NODECREATION);
console.log("switched to: "+Session.get("currentState").name);

Template.Forest.rendered = function(){

	$('ul.newstack').sortable({
		receive : function(event, ui){
			var currClusId = createCluster(ui.item);
      Session.set("ideaNode", currClusId);
      $('#createnode').slideToggle();
      ui.item.remove();
		},
	});

	$('#idealist').sortable({
		connectWith:'ul.newstack, ul.stack',
		receive: function(event, ui){
      var myIdeaId = $(ui.item).attr('id');
      if(ui.sender.hasClass('stack')){
        myIdea = processIdeaSender(ui, myIdeaId); 
      } else {
        alert("unknown sender"); //no way for this to happen
        return false;
      }
      updateIdeas(myIdeaId, false);
    }
	});

	$('ul.stack').sortable({
		connectWith: '#idealist',
		receive : function(event, ui){
			var ideaId = $(ui.item).attr('id');
			var clusterId = $(this).attr('id');
			addToCluster(ideaId, clusterId);
		},
	});
}

/********************************************************************
* Template Helpers
*********************************************************************/
Template.Forest.helpers({
	isClustered : function(){
    if(this.inCluster){
     	return false;
   	} else {
     	return true;
    }
  },

	ideas : function(){
   	return Ideas.find();
  },

  ideaNode : function(){
  	//console.log(Session.get('currentNode'));
  	return Session.get('ideaNode');
  },

  ideaNodeIdeas : function(){
  	var currNodeID = Session.get('ideaNode');
  	var currCluster = Clusters.findOne({_id: currNodeID});
		if(currCluster !== undefined){
			//console.log(currCluster.ideas);
			return currCluster.ideas;
		}
  },

  ideaNodeName : function(){
  	var currNodeID = Session.get('ideaNode');
  	var currCluster = Clusters.findOne({_id: currNodeID});
		if(currCluster !== undefined){
			return currCluster.name;
		}
  },

  bestMatchNode : function(){
  	console.log(Session.get('bestMatchNode'));
  	return Session.get('bestMatchNode');
  },

  bestMatchIdeas : function(){
  	var currNodeID = Session.get('bestMatchNode');
  	var currCluster = Clusters.findOne({_id: currNodeID});
		if(currCluster !== undefined){
			console.log(currCluster.ideas);
			return currCluster.ideas;
		}
  },

  bestMatchName : function(){
  	var currNodeID = Session.get('bestMatchNode');
  	var currCluster = Clusters.findOne({_id: currNodeID});
		if(currCluster !== undefined){
			return currCluster.name;
		}
  },

  myName : function(){
  	var cluster = Clusters.findOne({_id: this.toString()});
  	if(cluster === undefined) 
  		return false;
  	return cluster.name;
  },

  bestMatchChildren : function(){
  	var currNodeID = Session.get('bestMatchNode');
  	var currCluster = Clusters.findOne({_id: currNodeID});
  	if(currCluster === undefined){ 
  		console.log("best match children undefined");
  		return false;
  	}
		return currCluster.children;
  },

  clusterIdeas : function(){
  	var cluster = Clusters.findOne({_id: this.toString()});
  	if(cluster === undefined) 
  		return false;
  	return cluster.ideas;
  },

  userPrompt : function(){
  	return Session.get("currentState").prompt;
  },

  isBestMatch : function(){
  	if(Session.get("currentState").val === 1)
  		return true;
  	return false;
  },

  isGeneralize : function(){
  	if(Session.get("currentState").val === 2)
  		return true;
  	return false;
  }
});

/********************************************************************
* Template Events
*********************************************************************/
Template.Forest.events({
	'keyup .clustername' : function(event, template){
    var $myCluster = $(event.target).parent();
    $myCluster.children().children('span').removeClass("unnamed");

    Clusters.update({_id:$myCluster.attr('id')},
      {$set: {name: $(event.target).val()}
    });
  },

  'click button#finish' : function(){
  	var cluster = Clusters.findOne({_id: Session.get("ideaNode")});
  	if(cluster.name === undefined || cluster.name ==="" 
        || cluster.name ==="Not named yet"){
  		alert("Please name cluster");
  		return false;
  	} else { //if current node has no children, insert idea node under current
  		var currNodeID = Session.get("currentNode");
  		if(Clusters.findOne({_id: currNodeID}).children.length === 0){
  			addChild(currNodeID);
  			exitDo(); //go back to start of idea node creation
  		} else { //else continue to next state
  			Session.set("currentState", States.BESTMATCH);
  			console.log("switched to: " + Session.get("currentState").name);

  			$('#ideas').animate({width: 'toggle'}, function(){
  				$('#nodestatus').animate({width: 'toggle'});
  			});

  		}
  	}
  },

  'click button#nomatch' : function(){
  	addChild(Session.get("currentNode"));
  	exitDo();
  },

  'click .glyphicon' : function(){
    if($(event.target).hasClass('glyphicon-collapse-up')){
      $(event.target).switchClass('glyphicon-collapse-up', 
      	'glyphicon-collapse-down');
    } else {
      $(event.target).switchClass('glyphicon-collapse-down', 
      	'glyphicon-collapse-up');
    }
    $(event.target).parent().children('li').slideToggle("fast");
    return false;
  },

  //select best match
  'dblclick .child' : function(){
  	//don't do anyhting if not in best match state
  	if(Session.get("currentState").val !== 1) 
  		return false;

  	Session.set("bestMatchNode", this.toString());

		//if current node has no children, add idea node as child of current node, exit do
  	if(Clusters.findOne({_id : Session.get("currentNode")}).children.length === 0){
  		addChild(this.toString());
  		exitDo();
  	} else {
  		//move to next state
  		$('#tree').animate({width: 'toggle'}, function(){
  			$('#generalize').animate({width: 'toggle'});
  			});
  		Session.set("currentState", States.GENERALIZE);
  	}
  },

  //click to merge
  'click button#both' : function(){
  	//get name and ideas form idea node
  	var ideaNode = Clusters.findOne(Session.get("ideaNode"));

  	//update best match node by pushing its ideas and name to best match
  	var bestMatchNode = Clusters.findOne(Session.get("bestMatchNode"));;
  	Clusters.update({_id: Session.get("bestMatchNode")}, 
  		{$addToSet: {ideas: ideaNode.ideas}});

  	var newName = bestMatchNode.name + " + " + ideaNode.name;
  	Clusters.update({_id: Session.get("bestMatchNode")}, 
  		{$set: {name: newName}});

  	Clusters.remove(Session.get("ideaNode"));

  	$('#generalize').animate({width: 'toggle'}, function(){
  			$('#tree').animate({width: 'toggle'});
  		});

  	exitDo();
  }
});

/********************************************************************
* Convenience funtions
*********************************************************************/
function addToCluster(ideaId, clusterId){
	var idea = Ideas.findOne({_id: ideaId});
	Clusters.update({_id: clusterId}, {$push: {ideas: idea}});
	updateIdeas(ideaId, true);
}

function addChild(nodeID){
	Clusters.update({_id: nodeID}, 
  				{$addToSet: 
  					{children: Session.get("ideaNode")
  				}
  			});
}

//modified from cluster.js
function createCluster(item) {
  var ideaId = item.attr('id');
  var ideas = [Ideas.findOne({_id: ideaId})];
  var cluster = new Cluster(ideas);
  var id = Clusters.insert(cluster);
  updateIdeas(ideaId, true);
  return id;
}

//imported from cluster.js
function updateIdeas(ideaId, inCluster){
  Ideas.update({_id: ideaId}, 
    {$set:
      {inCluster: inCluster}
  });
}

function exitDo(){
	if(Session.get("currentState").val !== 0){
		$('#ideas').animate({width: 'toggle'}, function(){
  		$('#nodestatus').animate({width: 'toggle'});
  	});
	}
	$('#createnode').slideToggle();
	Session.set("currentNode", "1");
	Session.set("ideaNode", "0");
	Session.set("bestMatchNode", "1");
	Session.set("currentState", States.NODECREATION);
}

//imported form clusters.js
function processIdeaSender(ui, ideaId){
  var myIdea;
  var senderId = $(ui.sender).attr('id');
  var sender = Clusters.findOne({_id: senderId});//remove that idea from sending cluster
    
  //find all ideas in clusters idea list with matching id (should be one)>need error check here
  myIdea = $.grep(sender.ideas, function(idea){
    return idea._id === ideaId;
  })[0];

  Clusters.update({_id: senderId},
    {$pull:
      {ideas: {_id: ideaId}}
  });

  //if sending cluster now has no ideas, get rid of it
  var ideasLength = Clusters.findOne({_id: senderId}).ideas.length;
  if(ideasLength === 0){
    Clusters.remove(senderId);
    $('#createnode').slideToggle();
  }
  return myIdea;
}