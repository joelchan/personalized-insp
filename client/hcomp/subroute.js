var logger = new Logger('Client:Hcomp:SubrouteSandbox');
Logger.setLevel('Client:Hcomp:SubrouteSandbox', 'trace');

Template.InstantiateCluster.events({


    'click .clusterButton' : function(e, ul) {
        logger.debug("Pressed button");
        var newCluster = ClusterFactory.createDummy(1);
        logger.debug(newCluster.id); 
    },
});

Template.ClusterSpace.helpers({
    getClusters: function() {
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
    getClusters: function() {
        return Clusters.find();
    },  
});

Template.IdeaElement.onCreated(function () {
 
  logger.debug("Calling on created for new idea"); 
  $(".IdeaListElement").draggable({
        //containment: '.synth  esisBox',
        //revert: true,
        //zIndex: 50,
        //helper: 'clone',
        //accept: '.card',
        //appendTo: '.synthesisBox',
        //appendTo: '.card',
        //snap: true,
        //refreshPositions: true, // Decreases performance tremendously 
        start: function(e, ui) {
            logger.debug("Began dragging a cluster");
            logger.trace(ui.helper[0]);
            //get current ideas element
            logger.trace(ui.helper[0].id); 
            var width = $(this).css('width');
            logger.trace(width);
            $(ui.helper[0]).css('width', width);
        },
    });
});

Template.IdeaSpace.helpers({
    dropOnEmpty: true,
    getIdeas: function() {
        return Ideas.find();
    },
});

Template.IdeaElement.onRendered(function () {
  logger.debug("Calling onRendered for new Idea"); 
  $(".IdeaListElement").draggable({
        //containment: '.synth  esisBox',
        //revert: true,
        //zIndex: 50,
        //helper: 'clone',
        //accept: '.card',
        //appendTo: '.synthesisBox',
        //appendTo: '.card',
        snap: false,

        //refreshPositions: true, // Decreases performance tremendously 
        start: function(e, ui) {
            logger.debug("Began dragging a cluster");
            logger.trace(ui.helper[0]);
            //get current ideas element
            logger.trace(ui.helper[0].id); 
            var width = $(this).css('width');
            logger.trace(width);
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
            logger.debug("Began dragging an cluster");
            logger.trace(ui.helper[0]);
            var width = $(this).css('width');
           // var info = $(this).currentData(id);
            //logger.trace(info);
            logger.trace(width);
            $(ui.helper[0]).css('width', width);
        },
    });
    
    $(this.firstNode).droppable({
        accept: ".IdeaListElement",
        //activeClass: 'droppable-active', 
        //hoverClass: 'droppable-hover', 
        drop: function(event, ui) {
             
            logger.debug("dropped into cluster");
            var droppable = $(this);
            var draggable = ui.draggable;
            logger.debug("Item associated with cluster");
            
            var cluster = Clusters.find("9NGnWLK236Kynpbzh").fetch(); 
            
            var droppedIdeaID = (ui.helper[0].id); 
            var idea = Ideas.find(droppedIdeaID).fetch();
            //var cluster = Clusters.find() 
            ClusterFactory.insertIdeaToCluster(idea[0], cluster[0]);         
            //logger.debug("Here");
            //logger.trace(ui.helper[0].id); 
            // Move draggable into droppable   
            //draggable.appendTo(droppable);
            //ClusterFactory.insertIdeaToCluster(Ideas.find().fetch(Session.get("currentUser")) ); 
        }
    });
});