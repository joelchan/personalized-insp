var logger = new Logger('Client:Hcomp:SubrouteSandbox');
Logger.setLevel('Client:Hcomp:SubrouteSandbox', 'trace');

// Template.SubrouteSandbox.onRendered(function () {
//     this.$(".col-md-9").panzoom({
//     minScale: 0,
//     $zoomRange: $("input[type='range']")
//     });
// });


Template.SubrouteSandbox.helpers({
    getNumIdeas: function () {
        return Ideas.find({inCluster: false}, {fields: {inCluster: 0}}).count();
    }, 
});

Template.IdeaSpace.helpers({
    
    getNumIdeas: function () {
        return Ideas.find({inCluster: false}, {fields: {inCluster: 0}}).count();
    }, 
    displayIdeas: function() {             
        //Ideas.find({}, { fields: { inCluster: 1}})
        return Ideas.find({inCluster: false}, {fields: {inCluster: 0}});        
    },
});

Template.IdeaElement.onCreated(function () {
  $(".IdeaListElement").draggable({
        //containment: '.synth  esisBox',
        //revert: true,
        zIndex: 50,
        //helper: 'clone',
        //accept: '.card',
        appendTo: '.synthesisBox',
        //snap: true,
        //refreshPositions: true, // Decreases performance tremendously 
        start: function(e, ui) {
            // logger.debug("Began dragging a cluster");
            // logger.trace(ui.helper[0]);
            //get current ideas element
            // logger.trace(ui.helper[0].id); 
            var width = $(this).css('width');
            // logger.trace(width);
            $(ui.helper[0]).css('width', width);
        },
    });
});

Template.IdeaElement.onRendered(function () {
  logger.debug("Calling onRendered for new Idea"); 
  $(".IdeaListElement").draggable({
        //containment: '.synthesisBox',
        //revert: false,
        zIndex: 50,
        appendTo: '.synthesisBox',
        //removeOnDrop: true,
        //helper: 'clone',
        //accept: '.card',
        //appendTo: '.synthesisBox',
        //appendTo: '.card',
        //refreshPositions: true, // Decreases performance tremendously 
        start: function(e, ui) {
            var width = $(this).css('width');
            $(ui.helper[0]).css('width', width);  
        },
    });
});

// Template.IdeaSpace.rendered = function() {   
//    $(".IdeaListElement").draggable({
//         //containment: '.synth  esisBox',
//         //revert: true,
//         //zIndex: 50,
//         //helper: 'clone',
//         //accept: '.card',
//         //appendTo: '.synthesisBox',
//         //appendTo: '.card',
//         snap: false,
//         //refreshPositions: true, // Decreases performance tremendously 
//         start: function(e, ui) {
//             logger.debug("Began dragging a cluster");
//             logger.trace(ui.helper[0]);
//             //get current ideas element
//             logger.trace(ui.helper[0].id); 
//             var width = $(this).css('width');
//             logger.trace(width);
//             $(ui.helper[0]).css('width', width);
//         },
//     });
// };
// Template.MakeClusterButton.helper({
// });

Template.InstantiateCluster.events({
    'click .clusterButton' : function(e, ul) {
        var user   = Session.get('currentUser');
        var prompt = Session.get('currentPrompt');
        var newCluster = ClusterFactory.create(user, prompt, null);        
    },
});

Template.DeleteCluster.onRendered( function() {
    $(this.firstNode).droppable({
        accept: ".cluster",
        zIndex: 50,
        stack: true,
        //activeClass: 'droppable-active', 
        //hoverClass: 'droppable-hover', 
        drop: function(event, ui) {
            
            if(confirm("Are you sure you want to delete this element?")){
                var clusterID =  ui.helper[0].id; 
                var cluster = Clusters.findOne(clusterID);
                var ideasInCluster = cluster.ideaIDs; 
                for (var i = ideasInCluster.lengideaIDsth - 1; i >= 0; i--) {
                    logger.debug("Look here "  + ideasInCluster[i]);     
                    Ideas.update({_id: ideasInCluster[i]}, {$set: {'inCluster': false}});
                };
                ui.helper[0].remove();
            }
           //Clusters.update({_id:{ideasInCluster}}, {$set: {'inCluster':false}});
           //logger.debug("Here" + JSON.stringify(ids));
           //Clusters.update({_id: cluster[0]._id}, {$set: {'name' : text}});
        }
    });
});

Template.ClusterSpace.helpers({
    getClusters: function() {
        var currPrompt = Session.get("currentPrompt");
        return Clusters.find();
    },
    createCluster: function() {
        return ClusterFactory.createDummy(); 
    },
});

Template.Cluster.helpers({
    getIdeas: function() {
        return Ideas.find();
    },
    getClusterIdeas: function() {  
        var targetCluster = Clusters.findOne(this._id);
        //logger.trace("target cluster " + JSON.stringify(targetCluster));
        IdeaIDs = targetCluster.ideaIDs; 
        // logger.debug("Idea IDS "  + IdeaIDs)
        //{ field: { $in: [<value1>, <value2>, ... <valueN> ] } }
        return Ideas.find({_id:{$in:IdeaIDs}});  // Iterated over IdeaIDs 
    },  
});

Template.ClusterIdeaElement.onCreated(function () {
  $(".clusterListElement").draggable({
        //containment: '.synth  esisBox',
        //revert: true,
        zIndex: 50,
        //helper: 'clone',
        //accept: '.card',
        //appendTo: '.synthesisBox',
        //appendTo: '.card',
        //snap: true,
        //refreshPositions: true, // Decreases performance tremendously 
        start: function(e, ui) {
            // logger.debug("Began dragging a cluster");
            // logger.trace(ui.helper[0]);
            //get current ideas element
            // logger.trace(ui.helper[0].id); 
            var width = $(this).css('width');
            $(ui.helper[0]).css('width', width);
        },
    });
});


Template.ClusterIdeaElement.onRendered(function () {
  logger.debug("Calling onRendered for new Idea"); 
  $(".clusterListElement").draggable({
        //containment: '.synth  esisBox',
        revert: true,
        zIndex: 50,
        //removeOnDrop: true,
        //helper: 'clone',
        //accept: '.card',
        //appendTo: '.synthesisBox',
        //appendTo: '.card',
        //refreshPositions: true, // Decreases performance tremendously 
        start: function(e, ui) {
            var width = $(this).css('width');
            $(ui.helper[0]).css('width', width); 
        },
    });
});


Template.Cluster.events({
"submit .clusterLabel": function (event, template) {
    
    // This function is called when the new task form is submitted
    var text = event.target.myInput.value;
    var clusterID = event.target.myInput.id; 
    var cluster = Clusters.find(clusterID).fetch();
    Clusters.update({_id: cluster[0]._id}, {$set: {'name' : text}});
    event.target.myInput.value = text;
    
    return false;
  }
});


Template.Cluster.onCreated( function() {
 $(this.firstNode).draggable({
        //containment: '.synthesisBox',
        //revert: true,
        //zIndex: 50,
        //helper: 'clone',
        // accept: '.IdeaListElement',
        //appendTo: '.synthesisBox',
        //appendTo: '.card',
        //snap: true,
        //refreshPositions: true, // Decreases performance tremendously 
        start: function(e, ui) {
            // logger.debug("Began dragging an cluster");
            // logger.trace(ui.helper[0]);
            var width = $(this).css('width');
           // var info = $(this).currentData(id);
            //logger.trace(info);
            logger.trace(width);
            $(ui.helper[0]).css('width', width);
        },
    });
    
    $(this.firstNode).droppable({
        //accept: ".IdeaListElement",
        //activeClass: 'droppable-active', 
        //hoverClass: 'droppable-hover', 
        
        drop: function(event, ui) {
            
            var currentClusterID = this.id;
            var ideaID = ui.helper[0].id; 
            
            var clusterObject = Clusters.find(currentClusterID).fetch();
            var ideaObject =  Ideas.find(ideaID).fetch();            
            
            //ClusterFactory.removeIdeaFromCluster(idea[0], cluster[0])
            // //logger.debug(clusterAssocIdea[0].clusterIDs + "Current CLuster ID");
            // var idAssocCluster = clusterAssocIdea[0].clusterIDs[0]; 
            // var cluster = Clusters.find(idAssocCluster).fetch();
            
            if($.inArray(ideaID, clusterObject[0].ideaIDs) == -1) {
                Ideas.update({_id: ideaObject[0]._id}, {$set: {'inCluster': true}});
                ClusterFactory.insertIdeaToCluster(ideaObject[0], clusterObject[0]);              
            } 
            
            if(ideaObject[0].clusterIDs.length > 1) {
               logger.debug("Array of clusters "  +ideaObject[0].clusterIDs);     
               //logger.debug("---> "  + );
               var prevCluster = Clusters.find(ideaObject[0].clusterIDs[0]).fetch();
                ClusterFactory.removeIdeaFromCluster(ideaObject[0], prevCluster[0]);
            
            }
            //id = document.getElementById(idea[0]._id);
            //id.parentNode.removeChild(id);
            
            //logger.debug("Here");
            
            // Move draggable into droppable   
            //draggable.appendTo(droppable);
           // ClusterFactory.insertIdeaToCluster(Ideas.find().fetch(Session.get("currentUser")) ); 
        }
    });

    $('.cluster').on({
        "shown.bs.dropdown": function() { this.closable = false; },
        "click":             function() { this.closable = true; },
        "hide.bs.dropdown":  function() { return this.closable; }
    });

});



Template.Cluster.onRendered( function() {
   
 $(this.firstNode).draggable({
        //containment: '.synthesisBox',
        //revert: true,
        //zIndex: 50,
        //helper: 'clone',
        // accept: '.IdeaListElement',
        //appendTo: '.synthesisBox',
        //appendTo: '.card',
        //snap: true,
        //refreshPositions: true, // Decreases performance tremendously 
        start: function(e, ui) {
            // logger.debug("Began dragging an cluster");
            // logger.trace(ui.helper[0]);
            var width = $(this).css('width');
           // var info = $(this).currentData(id);
            //logger.trace(info);
            logger.trace(width);
            $(ui.helper[0]).css('width', width);
        },
    });
    
    $(this.firstNode).droppable({
        //accept: ".IdeaListElement",
        //activeClass: 'droppable-active', 
        //hoverClass: 'droppable-hover', 
        
        drop: function(event, ui) {
            
            var currentClusterID = this.id;
            var ideaID = ui.helper[0].id; 
            
            var clusterObject = Clusters.find(currentClusterID).fetch();
            var ideaObject =  Ideas.find(ideaID).fetch();            
            
            //ClusterFactory.removeIdeaFromCluster(idea[0], cluster[0])
            // //logger.debug(clusterAssocIdea[0].clusterIDs + "Current CLuster ID");
            // var idAssocCluster = clusterAssocIdea[0].clusterIDs[0]; 
            // var cluster = Clusters.find(idAssocCluster).fetch();
            
            if($.inArray(ideaID, clusterObject[0].ideaIDs) == -1) {
                Ideas.update({_id: ideaObject[0]._id}, {$set: {'inCluster': true}});
                ClusterFactory.insertIdeaToCluster(ideaObject[0], clusterObject[0]);              
            } 
            
            if(ideaObject[0].clusterIDs.length > 1) {
               logger.debug("Array of clusters "  +ideaObject[0].clusterIDs);     
               //logger.debug("---> "  + );
               var prevCluster = Clusters.find(ideaObject[0].clusterIDs[0]).fetch();
                ClusterFactory.removeIdeaFromCluster(ideaObject[0], prevCluster[0]);
            
            }
            //id = document.getElementById(idea[0]._id);
            //id.parentNode.removeChild(id);
            
            //logger.debug("Here");
            
            // Move draggable into droppable   
            //draggable.appendTo(droppable);
           // ClusterFactory.insertIdeaToCluster(Ideas.find().fetch(Session.get("currentUser")) ); 
        }
    });

    
    $('.cluster').on({
        "shown.bs.dropdown": function() { this.closable = false; },
        "click":             function() { this.closable = true; },
        "hide.bs.dropdown":  function() { return this.closable; }
    });

});




