var logger = new Logger('Client:Hcomp:SubrouteSandbox');
Logger.setLevel('Client:Hcomp:SubrouteSandbox', 'trace');

Template.ZoomSpace.helpers({
    getIdeas: function() {
        return Ideas.find();
    },
}); 

Template.SubrouteSandbox.onRendered(function () {
    this.$(".zoomFrame").panzoom({
         minScale: .5,
         increment: 0.2,
         maxScale: 1.2,
         $zoomIn: $(".zoomIn"),
         $zoomOut: $(".zoomOut"),
         $zoomRange: $("input[type='range']")
    })
    .on("panzoomchange", function(e, panzoom, transform) {
        logger.trace("Calabash and carrots");
        
        //print matrix
        logger.trace(transform);
        //logger.trace(transform[4] + "  "  + transform[5]); 
        //Transform directions 
        //y axis transform[5] Matrix index 5 
        //Matrix scale is at index[0]
        $(".ideasList").css('top', transform[5]);  
        //x Axis  transform[4] Matrix index 4 
        $(".ideasList").css('left', transform[4]);   
    
    });
});

Template.MiniMap.helpers({
     getIdeas: function() {
        return Ideas.find();
    },
});

Template.MiniMap.onRendered(function () {

});

Template.ZoomSpace.onRendered(function () {
    
    
});

Template.SubrouteSandbox.helpers({
    getNumIdeas: function () {
        return Ideas.find({ inCluster: false }, {fields: {inCluster: 0}}).count();
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

Template.IdeaElement.onRendered(function () {
    
    logger.trace("IdeaElement rendered from IdeaElement.onRendered "); 
        
        var height = $(".IdeaListElement").css('height');
        var width = $(".ideasList").css('width');   
        var scaleHeight = parseInt(height.substring(0,2)); 
        $(".miniIdeas").css('height', (scaleHeight * 1.2)); 
    
    $(this.firstNode).on('mousedown touchstart', function(e) {
        e.stopPropagation();
        logger.trace("I am here");
    });  

 $(this.firstNode).draggable({
        //containment: '.synthesisBox',
        //revert: false,
        zIndex: 50,
        appendTo: '.zoomFrame',
        //removeOnDrop: true,
        //helper: 'clone',
        //accept: '.card',
        //appendTo: '.synthesisBox',
        //appendTo: '.card',
        //refreshPositions: true, // Decreases performance tremendously 
        start: function(e, ui) {
            
            var width = $(this).css('width');
            var top = $(this).css('top');
            var left = $(this).css('left');
           
            var thisId = ui.helper[0].id; 
            thisId = "#" +thisId.trim();
     
            logger.trace(thisId.length)       
            logger.trace(top);
            $(thisId).css('top',parseInt(top.substring(0,2)));
            $(thisId).css('left',parseInt(left.substring(0,2)));
            // $(thisId).css('left', parseInt(top.substring(0,2));
            

            // $(this).on('mousedown touchstart', function(e) {
            //      e.stopImmediatePropagation();
            //   });
        
        // var top = $(ui.helper[0]).css('top');   
        // var left = $(ui.helper[0]).css('left');   
        
        // logger.trace("top "  + top);
        // logger.trace("left "  + left);
        
        // var miniLeft = parseInt(left.substring(0,2));
        // var miniTop = parseInt(top.substring(0,2));

        // var miniTop 

        },
    });
});

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
                ui.helper[0].remove();
                for (var i = ideasInCluster.lengideaIDsth - 1; i >= 0; i--) {
                    logger.debug("Look here "  + ideasInCluster[i]);     
                    Ideas.update({_id: ideasInCluster[i]}, {$set: {'inCluster': false}});
                };
                
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

Template.ClusterIdeaElement.onRendered(function () {
  logger.debug("Calling onRendered for new Idea"); 
   $(this.firstNode).draggable({
        //containment: '.synth  esisBox',
        revert: true,
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
            var width = $(this).css('width');
            $(ui.helper[0]).css('width', width);
        },
    });
    
    $(this.firstNode).droppable({
        
        drop: function(event, ui) {
            
            var currentClusterID = this.id;
            var ideaID = ui.helper[0].id; 
            var clusterObject = Clusters.find(currentClusterID).fetch();
            var ideaObject =  Ideas.find(ideaID).fetch();            
            
            if($.inArray(ideaID, clusterObject[0].ideaIDs) == -1) {
                Ideas.update({_id: ideaObject[0]._id}, {$set: {'inCluster': true}});
                ClusterFactory.insertIdeaToCluster(ideaObject[0], clusterObject[0]);              
            } 
            
            if(ideaObject[0].clusterIDs.length > 1) {
               logger.debug("Array of clusters "  +ideaObject[0].clusterIDs);     
               var prevCluster = Clusters.find(ideaObject[0].clusterIDs[0]).fetch();
               ClusterFactory.removeIdeaFromCluster(ideaObject[0], prevCluster[0]);
            }
        }
    });    
    
    $('.cluster').on({
        "shown.bs.dropdown": function() { this.closable = false; },
        "click":             function() { this.closable = true; },
        "hide.bs.dropdown":  function() { return this.closable; }
    });

});



