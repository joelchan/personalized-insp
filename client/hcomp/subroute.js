var logger = new Logger('Client:Hcomp:SubrouteSandbox');
Logger.setLevel('Client:Hcomp:SubrouteSandbox', 'trace');


var global = 1; 
var clusterTop = 0;
var clusterLeft = 0;

// <<<<<<< HEAD
Template.ZoomSpace.helpers({
    getZoomSpaceIdeas: function() {
        // return Ideas.find({inZoomSpace: true, inCluster:false}, {fields: {inZoomSpace: 0,inCluster: 0}});        
        return FilterManager.performQuery("zoomSpaceIdeas", Session.get("currentUser"), "ideas");
    },

    getClusters: function() {
        var user = Session.get("currentUser");
        return Clusters.find({userID: user._id, isTrash: false});
    },
});
     
Template.SubrouteSandbox.onRendered(function () {
$('.ScalingViewPane').css('top', 75); 
$('.ScalingViewPane').css('left', 50); 

// =======
//  Template.SubrouteSandbox.onRendered(function () {
// >>>>>>> synthInterfaceNew
    this.$(".panZoomFrame").panzoom({
         minScale: .3,
         increment: 0.01,
         maxScale: 1,
         $zoomIn:    $(".glyphicon-zoom-in"),
         $zoomOut:   $(".glyphicon-zoom-out"),
         $zoomRange: $("input[type='range']")
    })
    .on("panzoomchange", function(e, panzoom, transform) {
        global = transform[0];
        clusterTop  = transform[5];
        clusterLeft = transform[4];
        //$('.zoomSpaceElement').css('top', top*transform[0]);
        //$('.zoomSpaceElement').css('left', transform[0]);

        $('.ScalingViewPane').css('top', (((transform[5])/25)* -1) + 75); 
        $('.ScalingViewPane').css('left', (((transform[4])/25)* -1) + 50); 
        $('.ScalingViewPane').css('width', 100 * transform[0]); 
        $('.ScalingViewPane').css('height', 50 * transform[0]); 

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

// <<<<<<< HEAD
Template.MiniMap.helpers({
    getNumIdeas: function () {
        var remainingIdeas = FilterManager.performQuery("remainingIdeas", Session.get("currentUser"), "ideas");
        return remainingIdeas.count();
        // return Ideas.find({ inCluster: false }, {fields: {inCluster: 0}}).count();
    },
     getIdeas: function() {
         return Ideas.find({inZoomSpace: true}, {fields: {inZoomSpace: 0}});        
    },
    getClusters: function() {
        return Clusters.find();
    },
});

Template.ZoomSpace.onRendered(function () {
    
    var user = Session.get("currentUser");

    FilterManager.reset("zoomSpaceIdeas", user, "ideas");
    
    // init cluster filters
    var clusters = Clusters.find({userID: user._id}).fetch();
    clusters.forEach(function(cluster) {
        FilterManager.create("zoomSpaceIdeas", user,
        "ideas", "clusterIDs", cluster._id, "ne");
    });
    
    FilterManager.create("zoomSpaceIdeas", user,
        "ideas", "inZoomSpace", true);

    // add synth subset filters (if from experiment)
    var part = Session.get("currentParticipant");
    if (part) {
        logger.debug("On synthesis experiment workflow; updating displayIdeas filter");
        addSynthIdeasFilter("zoomSpaceIdeas", part);
    }

     $(this.firstNode).on('mousedown touchstart', function(e) {
               e.stopPropagation();
     });

     $('.panZoomFrame').droppable({
        accept: ".ideaListElement",
        //refreshPositions:true,
        //activeClass: 'droppable-active', 
        //hoverClass: 'droppable-hover', 
        drop: function(event, ui) {
        //var factor = ((1 / global) -1);
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
                
               // var factor = ((1 / global) -1);
               
               var elementID = ui.helper[0].id;
               var left = (((ideaLeftOffset/global) - (pZMLeftOffset/global)));
               var top = (((ideaTopOffset/global) - (pZMTopOffset/global)));
               var position = {"top": top, "left": left};
               logger.debug("Updating current position of idea in zoom space");
               logger.trace("New position of idea " + elementID + ": " + JSON.stringify(position));
               ZoomManager.updatePosition(elementID, "Ideas", position, Session.get("currentUser"));

                logger.trace(ideaLeftOffset - pZMLeftOffset);
                $('#' + ideaID).css('left',(((ideaLeftOffset/global) - (pZMLeftOffset/global))));
                $('#' + ideaID).css('top', (((ideaTopOffset/global) - (pZMTopOffset/global)))); 
                
                // ui.position.top += Math.round(((ui.position.top - ui.originalPosition.top) * factor));
                // ui.position.left += Math.round(((ui.position.left- ui.originalPosition.left) * factor)); 
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

Template.IdeaSpace.onRendered(function() {
    
    var user = Session.get("currentUser");
    // SET DEFAULT FILTERS
    // displayIdeas idea filters
    FilterManager.reset("displayIdeas", user, "ideas");

    // for getting the count of ideas remaining
    FilterManager.reset("remainingIdeas", user, "ideas");
    
    // init cluster filters
    var clusters = Clusters.find({userID: user._id}).fetch();
    clusters.forEach(function(cluster) {
        FilterManager.create("displayIdeas", user,
            "ideas", "clusterIDs", cluster._id, "ne");
        FilterManager.create("remainingIdeas", user,
            "ideas", "clusterIDs", cluster._id, "ne");
    });
    
    // FilterManager.create("displayIdeas", Session.get("currentUser"),
    //     "ideas", "inCluster", false);
    FilterManager.create("displayIdeas", user,
        "ideas", "inZoomSpace", false);

    
    // FilterManager.create("remainingIdeas", Session.get("currentUser"),
    //     "ideas", "inCluster", false);

    var part = Session.get("currentParticipant");
    if (part) {
        logger.debug("On synthesis experiment workflow; updating displayIdeas filter");
        addSynthIdeasFilter("displayIdeas", part);
        addSynthIdeasFilter("remainingIdeas", part);
    }

});

Template.IdeaSpace.helpers({ 
    getNumIdeas: function () {
        return FilterManager.performQuery("remainingIdeas", Session.get("currentUser"), "ideas").count();
    }, 
    displayIdeas: function() {             
        return FilterManager.performQuery("displayIdeas", Session.get("currentUser"), "ideas");
        // return Ideas.find({inCluster:false,inZoomSpace: false}, {fields: {inZoomSpace: 0,inCluster:0}});       
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
    
    var zoomElementID = $(this.firstNode)[0].id;
    // logger.trace("Zoom element: ");
    // logger.trace(zoomElement);
    logger.trace("Zoom element ID: " + zoomElementID);
    var oldPosition = ZoomManager.getElementPosition(zoomElementID, Session.get("currentUser"));
    logger.trace("Old position: " + oldPosition);
    $(this.firstNode).css("top", oldPosition.top);
    $(this.firstNode).css("left", oldPosition.left);

    $(this.firstNode).on('mousedown touchstart', function(e) {
                 //logger.trace("This current css left " + $(this.firstNode).css('left'));
                 e.stopPropagation();
    });
    
    var canvasHeight = $('.panZoomFrame').height();
    var canvasWidth = $('.panZoomFrame').width();

    $(this.firstNode).draggable({
        zIndex: 50,
        appendTo: '.panZoomFrame',
        drag: function(e, ui) {
              
            ui.position.top = Math.round(ui.position.top / global);
            ui.position.left = Math.round(ui.position.left / global);

            if (ui.position.left < 0) 
                ui.position.left = 0;
            if (ui.position.left + $(this).width() > canvasWidth)
                ui.position.left = canvasWidth - $(this).width();  
            if (ui.position.top < 0)
                ui.position.top = 0;
            if (ui.position.top + $(this).height() > canvasHeight)
                ui.position.top = canvasHeight - $(this).height();  
        },
        stop: function(event, ui) {
            logger.trace("UI for stop zoom space drag");
            logger.trace(ui.helper[0].id);
            var elementID = ui.helper[0].id;
            var position = ui.position;
            logger.debug("Updating current position of idea in zoom space");
            logger.trace("New position of idea " + elementID + ": " + JSON.stringify(position));
            ZoomManager.updatePosition(elementID, "Ideas", position, Session.get("currentUser"));
        },
    });
});


Template.InstantiateCluster.events({
    'click .clusterButton' : function(e, ui) {
        var user   = Session.get('currentUser');
        var prompt = Session.get('currentPrompt');
        var newCluster = ClusterFactory.create(user, prompt, null);        
        updateClusterFilter(newCluster._id);
        
        $("#" +newCluster._id).css('top' , ((clusterTop*-1)/global) + 2850);
         $("#" +newCluster._id).css('left', ((clusterLeft*-1)/global) + 2900);
    },
});

Template.DeleteCluster.onRendered( function() {
    
    $(this.firstNode).click(function(){
        // accept: ".cluster",
        // zIndex: 50,
        // stack: true,
        // //activeClass: 'droppable-active', 
        //hoverClass: 'droppable-hover', 
        // drop: function(event, ui) {
            if(confirm("Are you sure you want to delete this element?")){
                
                var clusterID =  this.id; 
                var cluster = Clusters.findOne(clusterID);
                var ideasInCluster = cluster.ideaIDs; 
                ClusterFactory.trash(cluster);
                updateClusterFilter(cluster._id, "remove");
                // $(this.parentNode.parentNode).remove();
                for (var i = ideasInCluster.length - 1; i >= 0; i--) {   
                    Ideas.update({_id: ideasInCluster[i]}, 
                        {$set: {'inZoomSpace':false}});
                    // Ideas.update({_id: ideasInCluster[i]}, {$set: {'inCluster': false, 'inZoomSpace':false}});
                }; 
            }
           //Clusters.update({_id:{ideasInCluster}}, {$set: {'inCluster':false}});
           //logger.debug("Here" + JSON.stringify(ids));
           //Clusters.update({_id: cluster[0]._id}, {$set: {'name' : text}});
        //}
    });
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
    getClusterIdeasCount: function() {  
        var targetCluster = Clusters.findOne(this._id);
        //logger.trace("target cluster " + JSON.stringify(targetCluster));
        IdeaIDs = targetCluster.ideaIDs; 
        // logger.debug("Idea IDS "  + IdeaIDs)
        //{ field: { $in: [<value1>, <value2>, ... <valueN> ] } }
        return Ideas.find({_id:{$in:IdeaIDs}}).count();  // Iterated over IdeaIDs 
    },  
});

Template.ClusterIdeaElement.onRendered(function () {
  
   $(this.firstNode).draggable({
        //containment: '.synth  esisBox',
        revert: true,
        zIndex: 50,
        appendTo: '.panZoomFrame',
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
    
    var clusterID = $(this.firstNode)[0].id;
    // logger.trace("Zoom element: ");
    // logger.trace(zoomElement);
    logger.trace("Zoom element ID: " + clusterID);
    var oldPosition = ZoomManager.getElementPosition(clusterID, Session.get("currentUser"));
    logger.trace("Old position: " + oldPosition);
    $(this.firstNode).css("top", oldPosition.top);
    $(this.firstNode).css("left", oldPosition.left);

    $(this.firstNode).on('mousedown touchstart', function(e) {
            e.stopPropagation();
    });
     
     var canvasHeight = $('.panZoomFrame').height();
     var canvasWidth = $('.panZoomFrame').width();
    
    
     $(this.firstNode).draggable({
        //containment: '.synthesisBox',
        //revert: true,
        //zIndex: 50,
        //helper: 'clone',
        accept: '.zoomSpaceElement',
        //   appendTo: '.panZoomFrame',
        //appendTo: '.card',
        //snap: true,
        //refreshPositions: true, // Decreases performance tremendously 
        drag: function(e, ui) {
            
            ui.position.top = Math.round(ui.position.top / global);
            ui.position.left = Math.round(ui.position.left / global);
              
            
        },
        stop: function(e, ui) {
            var elementID = ui.helper[0].id;
            var position = ui.position;
            logger.debug("Updating current position of cluster in zoom space");
            logger.trace("New position of idea " + elementID + ": " + JSON.stringify(position));
            ZoomManager.updatePosition(elementID, "Clusters", position, Session.get("currentUser"));
        },
    });
    
    $(this.firstNode).droppable({
        
        accept:'.zoomSpaceElement',
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

Template.MiniMap.helpers({
     getIdeas: function() {
         return Ideas.find({inZoomSpace: true}, {fields: {inZoomSpace: 0}});        
    },
});

var addSynthIdeasFilter = function addSynthIdeasFilter(filterName, part) {
    
    logger.debug("Calling addSynthIdeasFilter for " + filterName);
    
    var subset = SynthSubsets.findOne({_id: part.misc.subsetID});
    logger.trace(JSON.stringify(subset));

    subset.ideaIDs.forEach(function(ideaID){
        FilterManager.create(filterName, Session.get("currentUser"),
        "ideas", "_id", ideaID);
    });
}

var updateClusterFilter = function updateClusterFilter(clusterID, remove) {
    if (!remove) {
        // call this function when a new cluster is created
        FilterManager.create("zoomSpaceIdeas", Session.get('currentUser'),
            "ideas", "clusterIDs", clusterID, "ne");
        FilterManager.create("displayIdeas", Session.get('currentUser'),
            "ideas", "clusterIDs", clusterID, "ne");
        FilterManager.create("remainingIdeas", Session.get('currentUser'),
            "ideas", "clusterIDs", clusterID, "ne");
    } else {
        FilterManager.remove("zoomSpaceIdeas", Session.get('currentUser'),
            "ideas", "clusterIDs", clusterID, "ne");
        FilterManager.remove("displayIdeas", Session.get('currentUser'),
            "ideas", "clusterIDs", clusterID, "ne");
        FilterManager.remove("remainingIdeas", Session.get('currentUser'),
            "ideas", "clusterIDs", clusterID, "ne");
    }
    
}