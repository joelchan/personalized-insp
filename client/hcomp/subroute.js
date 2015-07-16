var logger = new Logger('Client:Hcomp:SubrouteSandbox');
Logger.setLevel('Client:Hcomp:SubrouteSandbox', 'trace');

Template.ZoomSpace.helpers({
    getZoomSpaceIdeas: function() {
        return Ideas.find({inZoomSpace: true, inCluster:false}, {fields: {inZoomSpace: 0,inCluster: 0}});        
    },

    getClusters: function() {
        return Clusters.find();
    },
}); 

     
Template.SubrouteSandbox.onRendered(function () {
    this.$(".panZoomFrame").panzoom({
         minScale: .5,
         increment: 0.2,
         maxScale: 1.2,
         $zoomIn:    $(".glyphicon-zoom-in"),
         $zoomOut:   $(".glyphicon-zoom-out"),
         $zoomRange: $("input[type='range']")
    })
    .on("panzoomchange", function(e, panzoom, transform) {
       
        //$('zoomSpaceElement').css('position', 'relative');
        //print matrix
        //logger.trace(transform);
        //logger.trace(transform[4] + "  "  + transform[5]); 
        //logger.trace(event.clientX);
        //logger.trace(event.clientY);
        // Transform directions 
        //y axis transform[5] Matrix index 5 
        //Matrix scale is at index[0]
        // $(".zoomBox").css('top', transform[5]/4); 
        // $(".zoomBox").css('left', transform[4]/6); 
    });
});

Template.MiniMap.helpers({
     getIdeas: function() {
         return Ideas.find({inZoomSpace: true}, {fields: {inZoomSpace: 0}});        
    },
});

Template.ZoomSpace.onRendered(function () {
    
    
     $(this.firstNode).on('mousedown touchstart', function(e) {
               e.stopPropagation();
     });

     $('.panZoomFrame').droppable({
        accept: ".ideaListElement",
        //activeClass: 'droppable-active', 
        //hoverClass: 'droppable-hover', 
       
        drop: function(event, ui) {
    
        ideaLeftOffset =  $(ui.helper[0]).offset().left; 
        ideaTopOffset  =  $(ui.helper[0]).offset().top;
        pZMTopOffset   =  $('.panZoomFrame').offset().top;
        pZMLeftOffset  =  $('.panZoomFrame').offset().left;  

        //$(ui.helper[0]).detach().appendTo('.panZoomFrame').css('position', 'absolute');
        //$(ui.helper[0]).css('5left', ((ideaLeftOffset - $(ui.helper[0]).scrollTop() +  $(ui.helper[0]).clientX)));
        // logger.trace("ideaTopOffset " + ideaTopOffset); 
        // logger.trace("ideaLeftOffset " + ideaLeftOffset); 
        // logger.trace("panzoomTopSet " + pZMTopOffset); 
        // logger.trace("panzoomLeftset " + pZMLeftOffset); 

         //$(ui.helper[0]).detach().appendTo('.panZoomFrame').css('position', 'absolute');
        
         
        //$(ui.helper[0]).css('top',  $('panZoomFrame') ); 
        //logger.trace("Element received");
        //logger.trace("Page X"  + event.pageX);  
        
        //logger.trace(" THis is the current pos " +JSON.stringify();
        // logger.trace("Mouse X : " + event.clientX);
         //logger.trace("Mouse Y : " + event.clientY);
        
        // logger.trace("Within Element top "  + ui.position.top);
        // logger.trace("Within Element  left " + ui.position.left);

        // alert("top" + ui.offset.top);
        // alert("left " + ui.offset.left);
        // logger.trace("Panzoom possition top " + $('.panZoomFrame').position().top);
        // logger.trace("Panzoom possition left " + $('.panZoomFrame').position().left); 
        // $(ui.helper[0])
        
        
        if(Ideas.findOne({_id:ui.helper[0].id}, {fields: {inZoomSpace:false}})) {     
                var ideaID  = ui.helper[0].id;
                var ideaObject =  Ideas.find(ideaID).fetch();            
                //var cAtDrop = $('.ideaListElement').position({'top':event.pageY, 'left': event.pageX});    
                //logger.trace("TOP " + cAtDrop.top);
                Ideas.update({_id: ideaObject[0]._id}, {$set: {'inZoomSpace': true}});
                $('#' + ideaID).css('left', ((ideaLeftOffset - pZMLeftOffset)));
                $('#' + ideaID).css('top',  ((ideaTopOffset) - (pZMTopOffset))); 
                
                //count - 100
                //logger.trace(count);
               // count++; 
         }
            
        // if($.inArray(ideaID, clusterObject[0].ideaIDs) == -1) {
        //     Ideas.update({_id: ideaObject[0]._id}, {$set: {'inCluster': true}});
        //     ClusterFactory.insertIdeaToCluster(ideaObject[0], clusterObject[0]);              
        // } 
             
            //  logger.trace("top"  + draggedElement.css('top')); 
            //  logger.trace("left"  + draggedElement.css('left')); 
             
            //  logger.trace(event.clientX); 
            // logger.trace(event.clientY); 
            // var dropZone = $(this);
            // var leftOffset = Math.abs(parent.offset().left - dropZone.offset().left);
            // var topOffset = dropZone.offset().top - parent.offset().top;
             
            //draggedElement.detach().appendTo(dropZone);
            //draggedElement.detach().css({top: 0,left: 0}).appendTo(dropZone);
            //draggedElement.detach().css({top: event.clientX,left: event.clientY}).appendTo(dropZone);
            // draggedElement.css('left', event.clientX);
            //draggedElement.css('top', event.clientY);
            //logger.trace("Posiiton Left "  + draggedElement.position().left);
            //draggedElement.css('top', draggedElement.position().top - topOffset);
           // draggedElement.draggable('option', 'containment', 'parent');
        }
    });
});

Template.SubrouteSandbox.helpers({
    //getNumIdeas: function () {
    //     return Ideas.find({ inCluster: false }, {fields: {inCluster: 0}}).count();
    // },
     getIdeas: function() {
        return Ideas.find();
    }, 
});

Template.IdeaSpace.helpers({ 
    getNumIdeas: function () {
        return Ideas.find({inCluster: false}, {fields: {inCluster: 0}}).count();
    }, 
    displayIdeas: function() {             
        return Ideas.find({inCluster:false,inZoomSpace: false}, {fields: {inZoomSpace: 0,inCluster:0}});       
    },
});

Template.IdeaListElement.onRendered(function () {
    
    $(this.firstNode).on('mousedown touchstart', function(e) {
        e.stopPropagation();
    });
        
        // var height = $(".IdeaListElement").css('height');
        // var width = $(".ideasList").css('width');   
        // var scaleHeight = parseInt(height.substring(0,2)); 
        // $(".miniIdeas").css('height', (scaleHeight * 1.2)); 
 $(this.firstNode).draggable({ 
        zIndex: 50,        
        create: function(event, ui) {
        },
        //appendTo: '.panZoomFrame',
        //removeOnDrop: true,
        //accept: '.card',
        //appendTo:'.zoomFrame',
        //appendTo: '.card',
        // refreshPositions: true, // Decreases performance tremendously 
        // start: function(e, ui) {
        drag: function(e, ui) {
        
        },
        start: function(e, ui) {

        }, 
        stop: function (event, ui) {
            
        },
    });
});

Template.ZoomSpaceElement.onRendered(function () {
     
    // $('.panZoomFrame').mousemove( function(event) {
                 //$('.ideaListElement').css('top', event.pageY);
                 //$('.ideaListElement').css('left', event.pageX);
    //  });
    $(this.firstNode).on('mousedown touchstart', function(e) {
                
                $(this.firstNode).detach();
                //logger.trace("This current css left " + $(this.firstNode).css('left'));
                 e.stopPropagation();
    });
    
    $(this.firstNode).draggable({
        zIndex: 50,
        appendTo: '.panZoomFrame',
        drag: function(e, ui) {
          
             var factor = ((1 / .5) -1);
             ui.position.top += Math.round((ui.position.top - ui.originalPosition.top) * factor);
             ui.position.left += Math.round((ui.position.left- ui.originalPosition.left) * factor); 

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
                
                for (var i = ideasInCluster.length - 1; i >= 0; i--) {
                    logger.debug("Look here "  + ideasInCluster[i]);     
                    Ideas.update({_id: ideasInCluster[i]}, {$set: {'inCluster': false, 'inZoomSpace':false}});
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
    getClusterName: function() {
        return Clusters.findOne({_id:this._id}).name; 
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
        drag: function(e, ui) {
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
    clusterID =  clusterID.substring(0, clusterID.length -1);
    var cluster = Clusters.find(clusterID).fetch();
    Clusters.update({_id: cluster[0]._id}, {$set: {'name' : text}});
    event.target.myInput.value = text;
    return false;
  }
});


Template.Cluster.onRendered( function() {   
$(this.firstNode).on('mousedown touchstart', function(e) {
                 e.stopPropagation();
});
 
$(this.firstNode).draggable({
        //containment: '.synthesisBox',
        //revert: true,
        //zIndex: 50,
        //helper: 'clone',
        accept: '.zoomSpaceElement',
        appendTo: '.panZoomFrame',
        //appendTo: '.card',
        //snap: true,
        //refreshPositions: true, // Decreases performance tremendously 
        drag: function(e, ui) {
            var width = $(this).css('width');
            $(ui.helper[0]).css('width', width);
            
            //Zoom Amount goes here
            var factor = ((1 / .5) -1);
            ui.position.top += Math.round((ui.position.top - ui.originalPosition.top) * factor);
            ui.position.left += Math.round((ui.position.left- ui.originalPosition.left) * factor); 
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
               logger.debug("Array of clusters"  +ideaObject[0].clusterIDs);     
               var prevCluster = Clusters.find(ideaObject[0].clusterIDs[0]).fetch();
               ClusterFactory.removeIdeaFromCluster(ideaObject[0], prevCluster[0]);
            }
        }
    });    
    
    $(this.firstNode).on({
        "shown.bs.dropdown": function() { this.closable = false; },
        "click":             function() { this.closable = true; },
        "hide.bs.dropdown":  function() { return this.closable; }
    });
});



