//state machine
	//current step/prompt
	//current node/cluster
	//ideaNode
	//bestmatch cluster

var root = {
	id : 1,
	isRoot : true,
	children : []
}

var activeCluster = false;

Template.Forest.rendered = function(){
	Session.set("currentNode", root.id);

	$('ul.newstack').sortable({
		receive : function(event, ui){
			if(activeCluster){
				$(this).sortable('cancel');
				$(ui.sender).sortable('cancel');
				return false;
			}
      ui.item.remove();
      Session.set("currentNode", createCluster(ui.item));
      activeCluster = true;
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

function addToCluster(ideaId, clusterId){
	var idea = Ideas.findOne({_id: ideaId});

	Clusters.update({_id: clusterId}, {$push: {ideas: myIdea}});

	updateIdeas(ideaId, true);

}
/*********************************************************************/




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

  currentNode : function(){
  	console.log(Session.get('currentNode'));
  	return Session.get('currentNode');
  },

  currentNodeIdeas : function(){
  	var currNodeID = Session.get('currentNode');
  	var currCluster = Clusters.findOne({_id: currNodeID});
		if(currCluster !== undefined){
			return currCluster.ideas;
		}
  }
});

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