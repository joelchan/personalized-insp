  Template.Cluster.rendered = function(){

    $('ul.newstack').sortable({
      items : '',
      receive : function(event, ui){
        var myIdea;
        if(ui.sender.hasClass('stack')){
          var myIdeaId = $(ui.item).attr('id');
          myIdea = processSender(ui, myIdeaId);

          Ideas.update({_id: myIdeaId}, 
            {$set:
              {inCluster: false}
            });
          $(ui.item).remove(); 
        }
        createCluster(ui.item);
        ui.item.remove();
      }
    });

    $('ul.deck').sortable({
      items: ">*:not(.sort-disabled)",
      connectWith : 'ul.deck, ul.newstack, ul.stack',
      //re-insert idea back into ideas collection if dragged to deck
      receive: function(event, ui){
        var myIdeaId = $(ui.item).attr('id');
        if(ui.sender.hasClass('stack')){
          myIdea = processSender(ui, myIdeaId); 
        } else {
          alert("unknown sender"); //no way for this to happen
        }
        $(ui.item).remove(); //removes item so it only appears once, just database entry

        Ideas.update({_id: myIdeaId}, 
          {$set:
            {inCluster: false}
          });
      }
    });
  }

  function createCluster(item) {
    // create a new stack
    var ideaId = item.attr('id');
    var ideas = [Ideas.findOne({_id: ideaId})];
    var cluster = new Cluster(ideas);
    Clusters.insert(cluster);
    Ideas.update({_id: ideaId}, 
      {$set:
        {inCluster: true}
      });
  }

    function processSender(ui, ideaId){
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
    $(ui.item).remove();
    return myIdea;
}
  
  Template.Cluster.ideas = function(){
    return Ideas.find();
  }

  Template.Cluster.clusters = function(){ 
    return Clusters.find().fetch();
  }

  Template.Cluster.clusterideas = function(){
    return $(this)[0].ideas;
  }

  Template.Cluster.isClustered= function(){
    if(this.inCluster){
      return false;
    } else {
      return true;
    }
  }


  function getCenterPos(element){ //not sure if this is necessary anymore, ask Joel
    var offset = element.offset();
    var width = element.width();
    var height = element.height();

    var centerX = offset.left + width / 2;
    var centerY = offset.top + height / 2;
    return [centerX, centerY];
  }

  Template.Cluster.helpers({
    clusters : function(){
      return Clusters.find();
    },

    /*prompt : function(){
      return Session.get("currentExp").conditions[0].prompt.question;
    }*/
  });

  Template.Cluster.events({
    'click button#finish' : function(){
      var finished = true;

      //checks that a name has been provided for all clusters
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
    'keyup .clustername' : function(event, template){
      var $myCluster = $(event.target).parent();
      $myCluster.children().children('span').removeClass("unnamed");

      Clusters.update({_id:$myCluster.attr('id')},
        {$set: {name: $(event.target).val()}
      });
    },

    'click .glyphicon' : function(){
      if($(event.target).hasClass('glyphicon-collapse-up'))
        $(event.target).switchClass('glyphicon-collapse-up', 'glyphicon-collapse-down');
      else
        $(event.target).switchClass('glyphicon-collapse-down', 'glyphicon-collapse-up');
      
      $(event.target).parent().children('li').slideToggle("fast");

      return false;
    },

    'mouseenter #clusterarea' : function(){
    // apply sortable to new stack
      $('ul.stack').sortable({
        items: ":not(.sort-disabled)",
        connectWith : 'ul.deck, ul.newstack, ul.stack',
        receive : function(event, ui){
          //add idea to cluster in db when dropeed in it
          var myIdeaId = $(ui.item).attr('id');
          var myIdea;//get idea being added
          var myClusterId = $(this).attr('id'); //get cluster being modified

          //if idea is coming from the idealist
          if($(ui.sender).hasClass('deck')){
            myIdea = Ideas.findOne({_id: myIdeaId});
            //remove idea from idealist
            Ideas.update({_id: myIdeaId}, 
              {$set:
                {inCluster: true}
              });
          //if idea is coming from another cluster
          } else if ($(ui.sender).hasClass('stack')){
            myIdea = processSender(ui, myIdeaId);
          }

          //update cluster by pushing idea onto ideas field
          Clusters.update({_id: myClusterId}, 
            {$push: 
              {ideas: myIdea}
            });
        }
      })

      $('#clusterarea ul').draggable({
        stop: function() {
          var id = $(this).attr('id');
          var pos = $(this).position();
          console.log(pos);
          Clusters.update({_id: id},
            {$set: {position: pos}
          });
          console.log(Clusters.findOne({_id: id}).position);
        },
        snap: "#clusterarea ul", 
        snapMode: "outer", 
        grid: [5, 5] 
      });
    }
  });