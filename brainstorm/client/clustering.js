/********************************************************************
* Attaches sortable to idea and cluster lists, new cluster area.
********************************************************************/
Template.Clustering.rendered = function(){
  //Attach sortable to the new cluster creation drop area
  $('ul.newcluster').sortable({
    items : '',
    receive : function(event, ui){
      var myIdea;
      if(ui.sender.parent().hasClass('cluster')){
        console.log(ui.sender);
        var myIdeaID = $(ui.item).attr('id');
        myIdea = processIdeaSender(ui, myIdeaID);
        //updateIdeas(myIdeaID, true);
      }
      createCluster(ui.item);
      ui.item.remove();
    }
  });

  //Attach sortable to the idea list
  $('ul.ideadeck').sortable({
    items: ">*:not(.sort-disabled)",
    connectWith : 'ul.ideadeck, ul.newcluster, .cluster ul',
    //re-insert idea back into ideas collection if dragged to deck
    receive: function(event, ui){
      var myIdeaID = $(ui.item).attr('id');
      if(ui.sender.hasClass('clusterul')){
        myIdea = processIdeaSender(ui, myIdeaID); 
      } else {
        alert("unknown sender"); //no way for this to happen
        return false;
      }
      updateIdeas(myIdeaID, false);
    }
  });
}

Template.clusterarea.rendered = function(){
     
}

Template.cluster.rendered = function(){
    // apply sortable to new cluster
  $('.cluster ul').sortable({
    items: ":not(.sort-disabled)",
    connectWith : 'ul.ideadeck, ul.newcluster, .cluster ul, ul.clusterdeck',
    receive : function(event, ui){
      var myIdeaID = $(ui.item).attr('id');
      var myIdea;
      var myClusterID = $(this).attr('id'); //get cluster being modified

      //if item is coming from cluster list
      if ($(ui.sender).hasClass('clusterdeck')){
        if(myClusterID === $(ui.item).attr('id')){ //if item being added has ID of cluster being added to
          alert("A cluster cannot be a member of itself. Sorry!");
          $(ui.sender).sortable('cancel');
          //ui.item.remove();
          return false;
        } else {
          Clusters.update({_id: myClusterID}, 
            {$addToSet:
              {children: $(ui.item).attr('id')} 
          });
          //if cluster item is coming from another cluster, pull it from the senders children
          if($(ui.item).hasClass('cluster-item')){
            Clusters.update({_id: $(ui.sender).attr('id')},
              {$pull: 
                {children: $(ui.item).attr('id')}
            });
          }
        return false;
        }
      //if item is coming from the idealist
      } else if ($(ui.sender).hasClass('ideadeck')){
        myIdea = IdeasToProcess.findOne({_id: myIdeaID});
        updateIdeas(myIdeaID, true);

      //if item is idea coming from another cluster
      } else if ($(ui.sender).hasClass('clusterul') && 
        $(ui.item).hasClass('idea-item')){
        myIdea = processIdeaSender(ui, myIdeaID);
      }

      //update cluster by pushing idea onto ideas field
      Clusters.update({_id: myClusterID}, 
        {$addToSet: 
          {ideas: myIdeaID}
      });
    }
  });

  $('.cluster').draggable({
    stop: function() {
      var id = $(this).attr('id');
      var pos = $(this).position();
      Clusters.update({_id: id},
        {$set: {position: pos}
      });
    },
    //snap: "#clusterarea ul", 
    //snapMode: "outer", 
    grid: [5, 5] 
  });
}

/********************************************************************
* Clustering Interface template Helpers
********************************************************************/
Template.Clustering.helpers({
  ideas : function(){
    return IdeasToProcess.find({inCluster: {$ne: true}});
  },

  clusters : function(){
    return Clusters.find({isRoot: {$ne: true}});
  },

  clustername : function(){
    var clu = Clusters.findOne({_id: this.toString()});
    if(clu === undefined) return false
    return clu.name;
  },
    
  prompt : function(){
    //return Session.get("currentCond").prompt;
    return "Names for Niki & Jeff's Company";//Session.get("currentExp").conditions[0].prompt.question;
  },

  numClusters : function(){
    return Clusters.find({isRoot: {$ne: true}}).count();
  },

  numUnnamed : function(){
    var nullNames = ["Not named yet", "", " ", "  ", "   ", undefined];
    return Clusters.find({isRoot: {$ne: true}, name: {$in: nullNames}}).count();
  }
});

/********************************************************************
* Cluster Area template Helpers
********************************************************************/
Template.clusterarea.helpers({
  clusters : function(){
    return Clusters.find({isRoot: {$ne: true}});
  },
});

Template.ideaitem.helpers({
  gameChangerStatus : function(){
    return this.isGamechanger;
  }
})


/********************************************************************
* Cluster objecct template Helpers
********************************************************************/
Template.cluster.helpers({
  clusterideas : function(){
    var ideaIDs = $(this)[0].ideas;
    return IdeasToProcess.find({_id: {$in: ideaIDs}})
  },

  named : function(){
    if ($(this)[0].name == "Not named yet")
      return 'text-danger';
    else return false
  },

  clusterchildren : function(){
    var children = $(this)[0].children;
    if (children === undefined)
      return false;
    if(children.length > 0)
      return $(this)[0].children;
    else return false;
  },

  isCollapsed : function(){
    return $(this)[0].isCollapsed;
  }

});

/********************************************************************
* Template event functions. Much of the heavy lifting in the interface*
* is done by the mouseover event.
********************************************************************/
Template.Clustering.events({
  //checks that a name has been provided for all clusters
  // 'click button#finish' : function(){
  //   var finished = true;
  //   Clusters.find().forEach(function(myCluster){
  //     if(myCluster.name == undefined || myCluster.name ==="" 
  //       || myCluster.name ==="Not named yet"){
  //       alert("Please name all clusters");
  //       finished = false;
  //       return finished;
  //     }
  //   });
  // },

  //updates name field in cluster as user types
  'keyup .namecluster' : function(event, template){
    var $myCluster = $(event.target).parent().parent();
    console.log($(event.target).val());

    Clusters.update({_id:$myCluster.attr('id')},
      {$set: {name: $(event.target).val()}
    });
  },

  //Collapse clusters and makes them unsortable until expanded
  'click .collapser' : function(){
    var id = $(event.target).parent().parent().attr('id');
    var cluster = Clusters.findOne({_id: id});
    var state = !cluster.isCollapsed;

    Clusters.update({_id: id}, {$set: {isCollapsed: state}});
    /*if($(event.target).hasClass('fa-angle-double-up')){
      $(event.target).switchClass('fa-angle-double-up', 
        'fa-angle-double-down');
    } else {
      $(event.target).switchClass('fa-angle-double-down', 
        'fa-angle-double-up');
    }
    $(event.target).parent().parent().children('li').slideToggle("fast");*/
  },

  'click .gamechangestar' : function(){
    console.log(this);
    var id = (this)._id;
    var idea = IdeasToProcess.findOne({_id: id});
    var state = !idea.isGamechanger;

    IdeasToProcess.update({_id: id}, {$set: {isGamechanger: state}});
  },

  'click .cluster-item': function(){
    //console.log(event.target);
    var id = $(event.target).attr("id");
    id = id.split("-")[1];
    var cluster = Clusters.findOne({_id: id});
    var top = cluster.position.top;
    window.scrollTo(0, top+100);
  }

  //Attaches sortable and draggable to clusters when mouse moves into cluster area
});


/********************************************************************
* Creates new cluster, adds it to collection, and updates Ideas list*
********************************************************************/
function createCluster(item) {
  var ideaID = item.attr('id');
  var ideas = [ideaID];//[IdeasToProcess.findOne({_id: ideaID})];
  var cluster = new Cluster(ideas);
  cluster.position = {top: 55, left:0};
  Clusters.insert(cluster);
  updateIdeas(ideaID, true);
}

/********************************************************************
* Takes a ui and id of idea being moved. Returns an idea and updates
* the sender.  
********************************************************************/
function processIdeaSender(ui, ideaID){
  var myIdea;
  var senderID = $(ui.sender).attr('id');
  var sender = Clusters.findOne({_id: senderID});//remove that idea from sending cluster
    
  //find all ideas in clusters idea list with matching id (should be one)>need error check here
  myIdea = $.grep(sender.ideas, function(idea){
    return idea === ideaID;
  })[0];

  Clusters.update({_id: senderID},
    {$pull:
      {ideas: ideaID}
  });

  //if sending cluster now has no ideas, get rid of it
  var ideasLength = Clusters.findOne({_id: senderID}).ideas.length;
  //console.log(ideasLength);
  if(ideasLength === 0){
    Clusters.remove(senderID);
  }
  return myIdea;
}

/********************************************************************
* Convenince function used to update items in the Ideas Collection  *
********************************************************************/
function updateIdeas(ideaID, inCluster){
  IdeasToProcess.update({_id: ideaID}, 
    {$set:
      {inCluster: inCluster}
  });
}