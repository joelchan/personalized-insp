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
	//back button - dependent on tracking path
	//X//modal asking for confirmation before inserting nodes?
		//issue with file load order???
	//fix artnodecreation modal
	//possibly undo button? very annoying to implement
	//X//slide down input and label when new cluster is started
	//X//fix so that "not named" is red whenever a new cluster is created and not yet named
	//relabel tree area?
	//improve general style
	//possibly change some .animate()s to .hide()s as the animation can look strange

insertIdeas = function(){
  var idea = new Idea("asdfasdf");
  IdeasToProcess.insert(idea);
  IdeasToProcess.insert(idea);
  IdeasToProcess.insert(idea);
  IdeasToProcess.insert(idea);
  IdeasToProcess.insert(idea);
}

var States = {
	NODECREATION: {val: 0, name: "IdeaNodeCreation", 
		prompt: "Subtrees of Root"},
	BESTMATCH: {val: 1, name: "FindBestMatch", 
		prompt: "Double click on the best match among the current nodes" },
	GENERALIZE: {val: 2, name: "Generalization", 
		prompt: "Do the nodes generalize each other in any way?"}
}
Object.freeze(States);

Session.set("currentNode", "1");
Session.set("ideaNode", "0");
Session.set("bestMatchNode", "1");
Session.set("currentState", States.NODECREATION);
Session.set("swapped", false);
var path = [1];

Template.Forest.rendered = function(){

	$('ul.newstack').sortable({
		receive : function(event, ui){
			var currClusId = createCluster(ui.item);
      Session.set("ideaNode", currClusId);
      $('#createnode').slideToggle();
      $('#buildcluster').slideToggle();
      ui.item.remove();
      $('#clusterlabel').addClass('unnamed');
      $('#namecluster').val('');
		},
	});

	$('#idealist').sortable({
		items: ">*:not(.sort-disabled)",
		connectWith:'ul.newstack, ul.stack',
		receive: function(event, ui){
      var myIdeaId = $(ui.item).attr('id');
      if(ui.sender.hasClass('stack')){
        processIdeaSender(ui, myIdeaId);
        $('#buildcluster').slideToggle();
      } else {
        alert("unknown sender"); //no way for this to happen
        return false;
      }
      updateIdeas(myIdeaId, false);
    }
	});

	$('ul.stack').sortable({
		items: ">*:not(.sort-disabled)",
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
   	return IdeasToProcess.find();
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
  	//console.log(Session.get('bestMatchNode'));
  	return Session.get('bestMatchNode');
  },

  bestMatchIdeas : function(){
  	var currNodeID = Session.get('bestMatchNode');
  	var currCluster = Clusters.findOne({_id: currNodeID});
		if(currCluster !== undefined){
			//console.log(currCluster.ideas);
			return currCluster.ideas;
		}
  },

  bestMatchName : function(){
  	var currNodeID = Session.get('bestMatchNode');
  	var currCluster = Clusters.findOne({_id: currNodeID});
  	//console.log(currNodeID);
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
  	//console.log(currNodeID);
  	var currCluster = Clusters.findOne({_id: currNodeID});
  	//console.log(currCluster);
  	if(currCluster === undefined){ 
  		//console.log("best match children undefined");
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

  clusterchildren : function(){
  	console.log(this.toString());
  	var cluster = Clusters.findOne(this.toString());
    if(cluster === undefined)
    	return false;
    else return cluster.children;
  },

  clustername : function(){
    var clu = Clusters.findOne({_id: this.toString()});
    if(clu === undefined) return false
    return clu.name;
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
  			$('#ideas').hide(function(){
  				$('#nodestatus').animate({width: 'toggle'});
  			});
  		}
  	}
  },

  'click a#nomatch' : function(){
  	$('#yes').click(function(){
  		addChild(Session.get("currentNode"));
  		exitDo();
  	});
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
  'dblclick .donestack' : function(){
  	//don't do anyhting if not in best match state
  	if(Session.get("currentState").val !== 1) 
  		return false;

  	Session.set("bestMatchNode", this.toString());
  	path.push(this.toString());
  	console.log(path);
		//if current node has no children, add idea node as child of current node, exit do
  	if(Clusters.findOne({_id : Session.get("currentNode")}).children.length === 0){
  		addChild(this.toString());
  		exitDo();
  	} else {
  		//move to next state
  		$('#tree').hide(function(){
  			$('#generalize').animate({width: 'toggle'});
  			});
  		Session.set("currentState", States.GENERALIZE);
  	}
  },

  //click to merge
  'click a#both' : function(){
  	$('#yes').click(function(){
  		//get name and ideas form idea node
  		var ideaNode = Clusters.findOne(Session.get("ideaNode"));

  		//update best match node by pushing its ideas and name to best match
  		var bestMatchNode = Clusters.findOne(Session.get("bestMatchNode"));

  		for (var i = 0; i < ideaNode.ideas.length; i++) {
	  		Clusters.update({_id: Session.get("bestMatchNode")}, 
  				{$push: {ideas: ideaNode.ideas[i]}
  			});
  		};

	  	var newName = bestMatchNode.name + " + " + ideaNode.name;
  		Clusters.update({_id: Session.get("bestMatchNode")}, 
  			{$set: {name: newName}});

	  	Clusters.remove(Session.get("ideaNode"));
  		exitDo();
  	});
  },

  //create artifical node
  'click button#save-name' : function(){
  	//get name from user
  	var newName = $("#artificial-name").val();

  	//clone best match
  	var bestMatch = Clusters.findOne({_id: Session.get("bestMatchNode")});
  	var clone = {
  		name: bestMatch.name,
  		children: bestMatch.children,
  		ideas: bestMatch.ideas
  	} //copy fields except id so a new id is generated on insert
  	var cloneId = Clusters.insert(clone);

  	Clusters.remove(Session.get("bestMatchNode"))
  	//update best match in collection such that is has name provided
  	Clusters.insert({
  		_id: Session.get("bestMatchNode"),
  		name: newName,
  		children: [Session.get("ideaNode"), cloneId]
  	});

  	exitDo();
  },

  'click button#ideanode' : function(){
  	//replace bestatchnode with ideanode in tree
  		//this is just the same as switching values of all fields except _id
  	swapNodes();
  	Session.set("currentNode", Session.get("bestMatchNode"));
  	Session.set("currentState", States.BESTMATCH);
  	$('#generalize').animate({width: 'toggle'}, function(){
  			$('#tree').animate({width: 'toggle'});
  		});
  	Session.set("swapped", true);
  },

  'click button#bestnode' : function(){
  	Session.set("currentNode", Session.get("bestMatchNode"));
  	Session.set("currentState", States.BESTMATCH);
  	$('#generalize').animate({width: 'toggle'}, function(){
  			$('#tree').animate({width: 'toggle'});
  		});
  },

  'click button#genback' : function(){
  	Session.set("currentState", States.BESTMATCH);
  	path.pop();
  	console.log(path);
  	Session.set("bestMatchNode", path[path.length-1].toString());
  	$('#generalize').animate({width: 'toggle'}, function(){
  			$('#tree').animate({width: 'toggle'});
  		});
  },

  'click button#bmback' : function(){
  	if(Session.get("swapped")){
  		swapNodes();
  		Session.set("swapped",false);
  	}

  	if(path.length > 1){
  		Session.set("currentState", States.GENERALIZE);
  		$('#tree').animate({width: 'toggle'}, function(){
  			$('#generalize').animate({width: 'toggle'});
  			});
  	} else {
  		Session.set("currentState", States.NODECREATION);
  		$('#nodestatus').animate({width: 'toggle'}, function(){
  				$('#ideas').animate({width: 'toggle'});
  			});
  	}

  }
});

/********************************************************************
* Convenience funtions
*********************************************************************/
function addToCluster(ideaId, clusterId){
	var idea = IdeasToProcess.findOne({_id: ideaId});
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
  var ideas = [IdeasToProcess.findOne({_id: ideaId})];
  var cluster = new Cluster(ideas);
  var id = Clusters.insert(cluster);
  updateIdeas(ideaId, true);
  return id;
}

//imported from cluster.js
function updateIdeas(ideaId, inCluster){
  IdeasToProcess.update({_id: ideaId}, 
    {$set:
      {inCluster: inCluster}
  });
}

function swapNodes(){
	//copy data and remove nodes
  var bestMatchNode = Clusters.findOne({_id: Session.get("bestMatchNode")});
  var bestName = bestMatchNode.name;
  var bestIdeas = bestMatchNode.ideas;
  var bestChildren = bestMatchNode.children;
  Clusters.remove(Session.get("bestMatchNode"));

  var ideaNode = Clusters.findOne({_id: Session.get("ideaNode")});
  var ideaNodeName = ideaNode.name;
  var ideaNodeIdeas = ideaNode.ideas;
  var ideaChildren = ideaNode.children;
  Clusters.remove(Session.get("ideaNode"));

  //insert ideaNode content at bestMatch id
  Clusters.insert({
  	_id: Session.get("bestMatchNode"),
  	name: ideaNodeName,
  	ideas: ideaNodeIdeas,
  	children: ideaChildren
  });

  	//insert bestMatch content at ideaNode id
  Clusters.insert({
  	_id: Session.get("ideaNode"),
  	name: bestName,
  	ideas: bestIdeas,
  	children: bestChildren
  });
}

function exitDo(){
	//if in any state other than node creation, hide nodestatus, show idealist + clusterbuilder
	if(Session.get("currentState").val !== 0){
		$('#nodestatus').animate({width: 'toggle'}, function(){
  		$('#ideas').animate({width: 'toggle'});
  	});
	}

	//if current state is Generalization, hide generalize and show tree
	if(Session.get("currentState").val === 2){
		$('#generalize').animate({width: 'toggle'}, function(){
  			$('#tree').animate({width: 'toggle'});
  		});
	}

	$('#buildcluster').slideToggle();
	$('#createnode').slideToggle();
	Session.set("currentNode", "1");
	Session.set("ideaNode", "0");
	Session.set("bestMatchNode", "1");
	Session.set("currentState", States.NODECREATION);
	Session.set("swapped",false);
	path = [1];
}

//modified from clusters.js
function processIdeaSender(ui, ideaId){
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
}