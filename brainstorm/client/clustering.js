/********************************************************************
* Attaches sortable to idea and cluster lists, new cluster area.
********************************************************************/
Template.Clustering.rendered = function(){
  //Attach sortable to the new cluster creation drop area
  $('ul.newcluster').sortable({
    items : '',
    receive : function(event, ui){
      var myIdea;
      if(ui.sender.hasClass('cluster')){
        var myIdeaId = $(ui.item).attr('id');
        myIdea = processIdeaSender(ui, myIdeaId);
        updateIdeas(myIdeaId, false);
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
      var myIdeaId = $(ui.item).attr('id');
      if(ui.sender.hasClass('clusterul')){
        myIdea = processIdeaSender(ui, myIdeaId); 
      } else {
        alert("unknown sender"); //no way for this to happen
        return false;
      }
      updateIdeas(myIdeaId, false);
    }
  });

  //Attach sortable to the cluster list
  /*$('ul.clusterdeck').sortable({
    items: ">*:not(.sort-disabled)",
    connectWith: 'ul.stack',
    receive: function(event,ui){
      if(ui.sender.hasClass('stack')){
        ui.item.remove();
      }
      return false;
    }
  });*/
}

Template.clusterarea.rendered = function(){
      
}

Template.cluster.rendered = function(){
    // apply sortable to new cluster
  $('.cluster ul').sortable({
    items: ":not(.sort-disabled)",
    connectWith : 'ul.ideadeck, ul.newcluster, .cluster ul, ul.clusterdeck',
    receive : function(event, ui){
      var myIdeaId = $(ui.item).attr('id');
      var myIdea;
      var myClusterId = $(this).attr('id'); //get cluster being modified

      //if item is coming from cluster list
      if ($(ui.sender).hasClass('clusterdeck')){
        if(myClusterId === $(ui.item).attr('id')){ //if item being added has ID of cluster being added to
          alert("A cluster cannot be a member of itself. Sorry!");
          $(ui.sender).sortable('cancel');
          //ui.item.remove();
          return false;
        } else {
          Clusters.update({_id: myClusterId}, 
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
        myIdea = IdeasToProcess.findOne({_id: myIdeaId});
        updateIdeas(myIdeaId, true);

      //if item is idea coming from another cluster
      } else if ($(ui.sender).hasClass('clusterul') && 
        $(ui.item).hasClass('idea-item')){
        myIdea = processIdeaSender(ui, myIdeaId);
      }

      //update cluster by pushing idea onto ideas field
      Clusters.update({_id: myClusterId}, 
        {$push: 
          {ideas: myIdea}
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

  Deps.autorun(function(){
    var ic = this.isCollapsed;
    console.log(ic);
  });
}

/********************************************************************
* Clustering Interface template Helpers
********************************************************************/
Template.Clustering.helpers({
  ideas : function(){
    return IdeasToProcess.find();
  },

  clustername : function(){
    var clu = Clusters.findOne({_id: this.toString()});
    if(clu === undefined) return false
    return clu.name;
  },

  isClustered : function(){
    if(this.inCluster){
      return false;
    } else {
      return true;
    }
  },
    
  prompt : function(){
    return "Alternative uses for old ipods";//Session.get("currentExp").conditions[0].prompt.question;
  }
});


/********************************************************************
* Cluster Area template Helpers
********************************************************************/
Template.clusterarea.helpers({
  clusters : function(){
    return Clusters.find().fetch();
  },

  isNotRoot : function(){
    if($(this)[0].isRoot)
      return false;
    return true;
  },
});


/********************************************************************
* Cluster objecct template Helpers
********************************************************************/
Template.cluster.helpers({
  clusterideas : function(){
    return $(this)[0].ideas;
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
  }

});

/********************************************************************
* Template event functions. Much of the heavy lifting in the interface*
* is done by the mouseover event.
********************************************************************/
Template.Clustering.events({
  //checks that a name has been provided for all clusters
  'click button#finish' : function(){
    var finished = true;
    Clusters.find().forEach(function(myCluster){
      if(myCluster.name == undefined || myCluster.name ==="" 
        || myCluster.name ==="Not named yet"){
        alert("Please name all clusters");
        finished = false;
        return finished;
      }
    });
  },

  //updates name field in cluster as user types
  'keyup .namecluster' : function(event, template){
    var $myCluster = $(event.target).parent().parent();
    console.log($(event.target).val());

    Clusters.update({_id:$myCluster.attr('id')},
      {$set: {name: $(event.target).val()}
    });
  },

  //Collapse clusters and makes them unsortable until expanded
  'click .fa' : function(){
    var id = $(event.target).parent().parent().attr('id');
    cluster = Clusters.find({_id: id});
    console.log(id);
    console.log(cluster);
    /*if($(event.target).hasClass('fa-angle-double-up')){
      $(event.target).switchClass('fa-angle-double-up', 
        'fa-angle-double-down');
    } else {
      $(event.target).switchClass('fa-angle-double-down', 
        'fa-angle-double-up');
    }
    $(event.target).parent().parent().children('li').slideToggle("fast");*/
    return false;
  },

  //Attaches sortable and draggable to clusters when mouse moves into cluster area
});


/********************************************************************
* Creates new cluster, adds it to collection, and updates Ideas list*
********************************************************************/
function createCluster(item) {
  var ideaId = item.attr('id');
  var ideas = [IdeasToProcess.findOne({_id: ideaId})];
  var cluster = new Cluster(ideas);
  cluster.position = {top: 50, left:0};
  Clusters.insert(cluster);
  updateIdeas(ideaId, true);
}

/********************************************************************
* Takes a ui and id of idea being moved. Returns an idea and updates
* the sender.  
********************************************************************/
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
  }
  return myIdea;
}

/********************************************************************
* Convenince function used to update items in the Ideas Collection  *
********************************************************************/
function updateIdeas(ideaId, inCluster){
  IdeasToProcess.update({_id: ideaId}, 
    {$set:
      {inCluster: inCluster}
  });
}