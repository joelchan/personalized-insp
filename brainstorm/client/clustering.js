// // Configure logger for server tests
// var logger = new Logger('Client:Clustering');
// // Comment out to use global logging level
// Logger.setLevel('Client:Clustering', 'trace');

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
        var myClusterID = processIdeaSender(ui, myIdeaID); 
      } else {
        alert("unknown sender"); //no way for this to happen
        return false;
      }
      updateIdeas(myIdeaID, false);
      updateClusterList(myIdeaID, myClusterID, false);
      ui.item.remove();
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
      /*if ($(ui.sender).hasClass('clusterdeck')){
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
      } else*/ if ($(ui.sender).hasClass('ideadeck')){
        myIdea = Ideas.findOne({_id: myIdeaID});
        updateIdeas(myIdeaID, true);

      //if item is idea coming from another cluster
      } else if ($(ui.sender).hasClass('clusterul') && 
        $(ui.item).hasClass('idea-item')){
        myIdea = processIdeaSender(ui, myIdeaID);
      }

      //update cluster by pushing idea onto ideas field
      Clusters.update({_id: myClusterID}, 
        {$addToSet: 
          {ideaIDs: myIdeaID}
      });

      updateClusterList(myIdeaID, myClusterID, true);
      ui.item.remove();
    },
    remove: function(event, ui){
      var myIdeaID = $(ui.item).attr('id');
      var myClusterID = $(this).attr('id');

      updateClusterList(myIdeaID, myClusterID, false);
    }
  });

  $('.cluster').draggable({
    stop: function() {
      var id = $(this).attr('id');
      var cluster = Clusters.findOne({_id: id});
      var pos = $(this).position();
      //ClusterFactory.updatePosition(cluster, pos)
      Clusters.update({_id: cluster._id},
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
    //var filter = Session.get("currentFilter");//Filters.findOne({name: "Syn Idea List Filter", user: Session.get("currentUser")});
    var filteredIdeas = FilterManager.performQuery("Ideas Filter", Session.get("currentUser"),"ideas").fetch();
    var sortedIdeas = filteredIdeas.sort(function(a,b) { return b.time - a.time});
    return sortedIdeas;
    // return Ideas.find();//FilterFactory.performQuery(filter);//
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
    // logger.trace("Getting Cluster Ideas");
    var ideaIDs = $(this)[0].ideaIDs;
    var cursor = Ideas.find({_id: {$in: ideaIDs}});
    // logger.trace("adsfasdf");
    return cursor
  },

  named : function(){
    if ($(this)[0].name == "Not named yet")
      return 'text-danger';
    else return false
  },

  // clusterchildren : function(){
  //   var children = $(this)[0].children;
  //   if (children === undefined)
  //     return false;
  //   if(children.length > 0)
  //     return $(this)[0].children;
  //   else return false;
  // },

  isCollapsed : function(){
    return $(this)[0].isCollapsed;
  }

});

/********************************************************************
* Template event functions. Much of the heavy lifting in the interface*
* is done by the mouseover event.
********************************************************************/
Template.Clustering.events({
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
    var idea = Ideas.findOne({_id: id});
    var state = !idea.isGamechanger;

    Ideas.update({_id: id}, {$set: {isGamechanger: state}});
  },

  'click .cluster-item': function(){
    //console.log(event.target);
    var id = $(event.target).attr("id");
    id = id.split("-")[1];
    var cluster = Clusters.findOne({_id: id});
    var top = cluster.position.top;
    window.scrollTo(0, top+100);
  },

  // 'click #sortOldest' : function(){
  //   Session.set("sortByTime", 1);
  // },

  // 'click #sortMostRecent' : function(){
  //   Session.set("sortByTime", -1);
  // }

  //Attaches sortable and draggable to clusters when mouse moves into cluster area
});


/********************************************************************
* Creates new cluster, adds it to collection, and updates Ideas list*
********************************************************************/
function createCluster(item) {
  var ideaID = item.attr('id');
  var ideas = [Ideas.findOne({_id: ideaID})];
  var cluster = new Cluster([ideaID]);//ClusterFactory.create(ideas);
  //add jitter to position
  var jitterTop = 30 + getRandomInt(0, 30);
  var jitterLeft = getRandomInt(0, 30);
  cluster.position = {top: jitterTop , left: jitterLeft};
  var clusterID = Clusters.insert(cluster);
  updateIdeas(ideaID, true);
  updateClusterList(ideaID, clusterID, true);
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
  myIdea = $.grep(sender.ideaIDs, function(idea){
    return idea === ideaID;
  })[0];

  Clusters.update({_id: senderID},
    {$pull:
      {ideaIDs: ideaID}
  });

  //if sending cluster now has no ideas, get rid of it
  var numIdeas = Clusters.findOne({_id: senderID}).ideaIDs.length;
  //console.log(ideasLength);
  if(numIdeas === 0){
    Clusters.remove(senderID);
  }
  return senderID;
}

/********************************************************************
* Convenince function used to update items in the Ideas Collection  *
********************************************************************/
function updateIdeas(ideaID, inCluster){
  Ideas.update({_id: ideaID}, 
    {$set:
      {inCluster: inCluster}
  });
}

function updateClusterList(ideaID, clusterID, adding){
  if (adding){
    Ideas.update({_id: ideaID}, 
      {$addToSet:
        {clusters: clusterID}
    });
  } else {
    Ideas.update({_id: ideaID}, 
      {$pull:
        {clusters: clusterID}
    });
  }
}