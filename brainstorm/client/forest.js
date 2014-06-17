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
//current node; is root at beginning of every new node insertion
//ideaNode; node being inserted
//bestmatchNode; node with highest similarity to ideaNode

var activeCluster = false;
Session.set("currentNode", "1");
Session.set("currentState", "IdeaNodeCreation");

Template.Forest.rendered = function(){

	$('ul.newstack').sortable({
		receive : function(event, ui){
			if(activeCluster){
				$(this).sortable('cancel');
				$(ui.sender).sortable('cancel');
				return false;
			}

			var currClusId = createCluster(ui.item);
      Session.set("ideaNode", currClusId);
      activeCluster = true; //change back to false after node is inserted
      ui.item.remove();
		},
	});

	$('#idealist').sortable({
		connectWith:'ul.newstack, ul.stack'
	});

	$('ul.stack').sortable({
		connectWith: '#idealist',
		receive : function(event, ui){
			var ideaId = $(ui.item).attr('id');
			var clusterId = $(this).attr('id');
			addToCluster(ideaId, clusterId);
		}
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

  myName : function(){
  	console.log($(this).attr('id'));
  	//return Clusters.findOne($(this).attr('id'));
  },

  currentChildren : function(){
  	var currNodeID = Session.get('currentNode');
  	var currCluster = Clusters.findOne({_id: currNodeID});
  	if(currCluster === undefined) 
  		return [];
		if(currCluster.isRoot){
			return root.children;
		} else {
			return currCluster.children;
		}
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
  	} else {
  		if(Clusters.findOne({_id: "1"}).children.length === 0){
  			Clusters.update({_id: "1"}, 
  				{$addToSet: {children: Session.get("ideaNode")}});
  		}
  		//move on to next state
  	}
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
});

/********************************************************************
* Convenience funtions
*********************************************************************/
function addToCluster(ideaId, clusterId){
	var idea = Ideas.findOne({_id: ideaId});
	Clusters.update({_id: clusterId}, {$push: {ideas: idea}});
	updateIdeas(ideaId, true);
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