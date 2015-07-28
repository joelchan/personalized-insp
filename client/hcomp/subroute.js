var logger = new Logger('Client:Hcomp:SubrouteSandbox');
Logger.setLevel('Client:Hcomp:SubrouteSandbox', 'trace');
var global = 1; 
var clusterTop = 0;
var clusterLeft = 0;
var sVTop = 84.00;
var sVLeft = 76.00;
/****************************************************************
*
* MASTER template rendering setup, helpers and events
*
****************************************************************/

Template.SubrouteSandbox.onRendered(function () {
    
    $('.ScalingViewPane').css('top', sVTop); 
    $('.ScalingViewPane').css('left', sVLeft); 
    
        this.$(".panZoomFrame").panzoom({
         minScale: .5,
         increment: 0.1,
         maxScale: 1,
         
         $zoomIn:    $(".glyphicon-zoom-in"),
         $zoomOut:   $(".glyphicon-zoom-out"),
         $zoomRange: $("input[type='range']"),
    })
    .on("panzoomchange", function(e, panzoom, transform) {
        global = transform[0];
        clusterTop  = transform[5];
        clusterLeft = transform[4];
        
        //$('.zoomSpaceElement').css('top', top*transform[0]);
        //$('.zoomSpaceElement').css('left', transform[0]);
        
        var paneWidth = $('.ScalingViewPane').css('width');
        var paneHeight = $('.ScalingViewPane').css('height');; 
        
        ////logger.trace(paneWidth);
        ////logger.trace(paneHeight);
        paneWidth = parseFloat(paneWidth.substring(0,paneWidth.length-2)*.5);
        paneHeight = parseFloat(paneHeight.substring(0,paneHeight.length -2)*.5);        
        //scaling viewpane Scaled top
        sVTop = 100.00 - paneHeight;  
        
        //scaling viewpane Scaled left
        sVLeft = 100.00 - paneWidth;
        
        finalTopScale = (((transform[5]/25.00) * -1) + sVTop);
        finalLeftScale = (((transform[4]/25.00) * -1) + sVLeft);

        $('.ScalingViewPane').css('top', finalTopScale); 
        $('.ScalingViewPane').css('left', finalLeftScale); 
        
        $('.ScalingViewPane').css('width', 48 / transform[0]); 
        $('.ScalingViewPane').css('height', 32 / transform[0]); 
    });
});

/****************************************************************
*
* MINIMAP template setup, helpers and events
*
****************************************************************/

Template.MiniMap.onRendered(function () {

    var instructions = "<h3>Goal</h3>" +
                        "<p>Identify solution patterns in the ideas below. " +
                            "Try to identify patterns that might be useful to others who want to generate ideas for the same/related problem. " + 
                            "These ideas are generated for the problem: </p><p>" + 
                            "<em>\"" +
                            Session.get("currentPrompt").question +
                            "\"</em>" +
                            "</p>" +
                        "<p>All ideas must be associated with at least one pattern. " +
                        "Number of ideas left (i.e., not labeled) is shown below. " +
                        "A 'finish' button will appear when all ideas have been labeled.</p>" +
                        "<br/>" +
                        "<h3>Essential interactions</h3>" +
                        "<ul>" +
                            "<li>Drag ideas from the list into the canvas on the right.</li>" +
                            "<li>Move ideas around on canvas to make sense of them (e.g., group them with other ideas).</li>" +
                            "<li>Label an idea or group of ideas:" +
                                "<ol>" +
                                    "<li>Click on the New Pattern button to create a new pattern label. It will appear on the canvas.</li>" +
                                    "<li>Drag idea(s) onto the label. " +
                                        "The ideas will change color to green and be attached to the label.</li>" +
                                "</ol>" +
                            "</li>" +
                            "<li>Click on pattern label and type to create/edit pattern labels (all patterns must be labeled).</li>" +
                        "</ul>" +
                        "<h3>Other interactions</h3>" +
                        "<ul>" +
                            "<li>Drag ideas from one label to another (swaps labels for idea).</li>" +
                            "<li>Drag ideas from label onto canvas (removes idea from label).</li>" +
                            "<li>Click on the 'x' button on labels to delete them " +
                                "(removes all ideas from label and places them back in list on left).</li>" +
                            "<li>Zoom out of the canvas if you need more space</li>" +
                        "</ul>"
                        // "<br/>" +
                        // "<p>Click the question mark icon again to close this message. Good luck!</p>"

    $('#instructions').tooltipster({
        content: $(instructions),
        trigger: 'click',
        // autoClose: false,
        // hideOnClick: true,
        theme: 'tooltipster-shadow',
        position: 'right',
        offset: 40,
        speed: 200,
        maxWidth: 500
    });

    $('#instructions').tooltipster('show');

    $('.del-cluster').tooltipster({
        content: "Click to delete this label",
        // trigger: 'click',
        // autoClose: false,
        // hideOnClick: true,
        offsetX: -15,
        theme: 'tooltipster-shadow',
        position: 'right',
        speed: 750,
        maxWidth: 400
    })

    $('.clusterName').tooltipster({
        content: "Click to edit name; when finished, hit enter",
        // trigger: 'click',
        // autoClose: false,
        // hideOnClick: true,
        theme: 'tooltipster-shadow',
        position: 'top',
        speed: 750,
        maxWidth: 400
    })

    $('.ideaCollapser').tooltipster({
        content: "Click to show ideas",
        // trigger: 'click',
        // autoClose: false,
        // hideOnClick: true,
        theme: 'tooltipster-shadow',
        position: 'left',
        speed: 750,
        maxWidth: 400
    })

});

Template.MiniMap.helpers({
    numIdeasTotal: function() {
       
        var part = Session.get("currentParticipant");
        if (part) {
            var subset = SynthSubsets.findOne({_id: part.misc.subsetID});
            logger.debug("On synthesis experiment workflow with subset " + subset._id);
            return subset.ideaIDs.length;
        } else {
            var promptID = Session.get("currentPrompt")._id;
            return Ideas.find({promptID: promptID}).count();
        }
    },
    getRemainingIdeas: function () {
        var user = Session.get("currentUser");
        var numDisplay = FilterManager.performQuery("displayIdeas", user, "ideas").count();
        var numZoom = FilterManager.performQuery("zoomSpaceIdeas", user, "ideas").count();
        return numDisplay + numZoom;
        // return Ideas.find({ inCluster: false }, {fields: {inCluster: 0}}).count();
    },
    couldBeDone: function() {
        var user = Session.get("currentUser");
        var numDisplay = FilterManager.performQuery("displayIdeas", user, "ideas").count();
        var numZoom = FilterManager.performQuery("zoomSpaceIdeas", user, "ideas").count();
        var remaining = numDisplay + numZoom;
        if (remaining < 1) {
            return true;
        } else {
            return false;
        }
    },
     getIdeas: function() {
        var user = Session.get("currentUser");
        return FilterManager.performQuery("zoomSpaceIdeas", user, "ideas");
        // return Ideas.find({inZoomSpace: true}, {fields: {inZoomSpace: 0}});        
    },
    getClusters: function() {
        var user = Session.get("currentUser");
        return FilterManager.performQuery("clusterFilter", user, "clusters");
    },
});

Template.Finished.events({
    'click #finished': function() {
        logger.debug("User clicked finish button");
        // check if all clusters have a name
        var user = Session.get("currentUser");
        var clusters = FilterManager.performQuery("clusterFilter", user, "clusters");
        var allNamed = true;
        clusters.forEach(function(cluster) {
            if (cluster.name == "Not named yet") {
                allNamed = false;
            }
        });
        if (allNamed) {
            var part = Session.get("currentParticipant");
            var cond = Conditions.findOne({_id: part.conditionID});
            var curIndex = getIndex(cond.misc.routeSequence, "SynthesisExp");
            //logger.trace("Current position in route sequence" + curIndex);
            var nextPage = cond.misc.routeSequence[curIndex+1]
            //logger.trace("Next page in sequence: " + nextPage);
            Session.set("nextPage", nextPage);
            Router.go(Session.get("nextPage"), {partID: part._id});

            // TODO:
            // [] Grab snapshot of current zoomspace and put in 
        } else {
            EventLogger.logSynthExpPartialFinish()
            alert("All patterns need to be labeled! Please check and name all your patterns before finishing.");
        }
    }
})

/****************************************************************
*
* IDEASPACE template rendering setup, helpers and events
*
****************************************************************/

Template.IdeaSpace.onRendered(function() {
    
    // set default filters
    var user = Session.get("currentUser");
    
    // set cluster filter here because it's the innermost element that uses filters
    // hopefully this means the filter will be set in the right order
    FilterManager.reset("clusterFilter", user, "clusters");
    setBaseClusterFilters("clusterFilter");

    FilterManager.reset("displayIdeas", user, "ideas");
    FilterManager.create("displayIdeas", user,
        "ideas", "zoomSpace", user._id, "ne");
    setBaseIdeasFilters("displayIdeas");

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

/****************************************************************
*
* IDEALIST ELEMENT template rendering setup, helpers and events
*
****************************************************************/

Template.IdeaListElement.onRendered(function () {
    
    $(this.firstNode).on('mousedown touchstart', function(e) {
        e.stopPropagation();
    });
        
 $(this.firstNode).draggable({ 
        zIndex: 50,        
        create: function(event, ui) {
        },
        drag: function(e, ui) {
        },
        start: function(e, ui) {
        }, 
        stop: function (event, ui) {   
        },
    });
});

Template.InstantiateCluster.events({
    'click #addCluster' : function(e, ui) {
        var user   = Session.get('currentUser');
        var prompt = Session.get('currentPrompt');
        var newCluster = ClusterFactory.create(user, prompt, null);
        EventLogger.logCreateCluster(newCluster);        
        var tc = (clusterTop*-1/global) + 2475;
        var lc = (clusterLeft*-1/global) + 2475;
        var newPos = {"top": tc, "left": lc};
        updateClusterFilter(newCluster._id);
        ZoomManager.updatePosition(newCluster._id, "Clusters", newPos, Session.get("currentUser"));
        $("#miniCluster"+ newCluster._id).css('top' , (((clusterTop*-1)/global) + 2475)/25);
        $("#miniCluster"+ newCluster._id).css('left', (((clusterLeft*-1)/global) + 2475)/25);
    },
});

/****************************************************************
*
* ZOOMSPACE template rendering setup, helpers and events
*
****************************************************************/

Template.ZoomSpace.onRendered(function () {
    
    var user = Session.get("currentUser");

    FilterManager.reset("zoomSpaceIdeas", user, "ideas");
    FilterManager.create("zoomSpaceIdeas", user,
        "ideas", "zoomSpace", user._id);
    setBaseIdeasFilters("zoomSpaceIdeas");

     $(this.firstNode).on('mousedown touchstart', function(e) {
               e.stopPropagation();
     });

     $('.panZoomFrame').droppable({
        accept: ".ideaListElement ,  .clusterListElement",
        drop: function(event, ui) {
            ideaLeftOffset =  $(ui.helper[0]).offset().left; 
            ideaTopOffset  =  $(ui.helper[0]).offset().top;
            pZMTopOffset   =  $('.panZoomFrame').offset().top;
            pZMLeftOffset  =  $('.panZoomFrame').offset().left;   
            
            var ideaID = ui.helper[0].id;
            var user = Session.get("currentUser");
            // is it coming from the displayIdeas list?
            if(fromDisplayIdeas(ideaID)) {
            // if(Ideas.findOne({_id:ui.helper[0].id}, {fields: {'inZoomSpace':false, 'inCluster':false}})) {     
                   // var ideaID  = ui.helper[0].id;
                   var ideaObject =  Ideas.findOne(ideaID);   
                   logger.trace(JSON.stringify(ideaObject));         
                   //var cAtDrop = $('.ideaListElement').position({'top':event.pageY, 'left': event.pageX});    
                   ////logger.trace("TOP " + cAtDrop.top);
                   // Ideas.update({_id: ideaObject[0]._id}, {$set: {'inZoomSpace': true}});
                   // IdeaFactory.toggleZoomSpaceFlag(ideaID, user._id);
                   IdeaFactory.updateZoomSpaceFlag(ideaID, "add");
                   // var factor = ((1 / global) -1);
                   var elementID = ui.helper[0].id;
                   var left = (((ideaLeftOffset/global) - (pZMLeftOffset/global)));
                   var top = (((ideaTopOffset/global) - (pZMTopOffset/global)));
                   var position = {"top": top, "left": left};
                   EventLogger.logDisplayToZoom(ideaObject, position);
                   logger.debug("Updating current position of idea in zoom space");
                   //logger.trace("New position of idea " + elementID + ": " + JSON.stringify(position));
                   ZoomManager.updatePosition(elementID, "Ideas", position, Session.get("currentUser"));
                   //logger.trace(ideaLeftOffset - pZMLeftOffset);
                   $('#' + ideaID).css('left', left);
                   $('#' + ideaID).css('top', top); 
                
                   $('#miniIdeas' + ideaID).css('left', left/25);
                   $('#miniIdeas' + ideaID).css('top', top/25);
             } else if (fromCluster(ideaID)) {
               // is it coming from a cluster?
               //if (fromCluster(ideaID)) {
               // if(Ideas.findOne({_id:ui.helper[0].id}, {fields: {inCluster: true}})) {
               var ideaID  = ui.helper[0].id;
               var ideaObject =  Ideas.findOne(ideaID);  
               logger.trace(JSON.stringify(ideaObject));
               var cluster  = $(ui.helper[0].parentNode);
               var clusterID = cluster[0].id.split("-").slice(-1)[0];
               //logger.trace("Cluster ID of item being dragged out: " + clusterID);
               // Ideas.update({_id: ideaObject[0]._id}, {$set: {'inZoomSpace': true, 'inCluster':false}});
               ClusterFactory.removeIdeaFromCluster(ideaObject, Clusters.findOne(clusterID));
               IdeaFactory.updateZoomSpaceFlag(ideaID, "add");
               // //logger.trace("Shouldnt be here ");
               var elementID = ui.helper[0].id;
               var left = (((ideaLeftOffset/global) - (pZMLeftOffset/global)));
               var top = (((ideaTopOffset/global) - (pZMTopOffset/global)));
               var position = {"top": top, "left": left};
               EventLogger.logClusterToZoom(ideaObject, Clusters.findOne(clusterID), position);
              
               logger.debug("Updating current position of idea in zoom space");
               //logger.trace("New position of idea " + elementID + ": " + JSON.stringify(position));
               ZoomManager.updatePosition(elementID, "Ideas", position, Session.get("currentUser"));
               //logger.trace(ideaLeftOffset - pZMLeftOffset);
               $('#' + ideaID).css('left',left);
               $('#' + ideaID).css('top', top);
               
               $('#miniIdeas' + ideaID).css('left', left/25);
               $('#miniIdeas' + ideaID).css('top', top/25);

            } else {
                logger.warn("Neither from displayIdeas or cluster; rejecting for now!");
            }
        }
    });
});

Template.ZoomSpace.helpers({
    getZoomSpaceIdeas: function() {
        // return Ideas.find({inZoomSpace: true, inCluster:false}, {fields: {inZoomSpace: 0,inCluster: 0}});        
        return FilterManager.performQuery("zoomSpaceIdeas", Session.get("currentUser"), "ideas");
    },

    getClusters: function() {
        var user = Session.get("currentUser");
        // return Clusters.find({userID: user._id, isTrash: false});
        return FilterManager.performQuery("clusterFilter", user, "clusters");
    },
});

// <div id="zoom-{{_id}}">
// ui.helper[0].id.split("-")[1]

/****************************************************************
*
* ZOOMSPACE ELEMENT template rendering setup, helpers and events
*
****************************************************************/

Template.ZoomSpaceElement.onRendered(function () {
    
    var zoomElementID = $(this.firstNode)[0].id;
    //logger.trace("Zoom element ID: " + zoomElementID);
    var oldPosition = ZoomManager.getElementPosition(zoomElementID, Session.get("currentUser"));
    //logger.trace("Old position: " + oldPosition);
    $(this.firstNode).css("top", oldPosition.top);
    $(this.firstNode).css("left", oldPosition.left);
    $(this.firstNode).on('mousedown touchstart', function(e) {
                //$(".zoomSpaceElement").collapse();
                 e.stopPropagation();
    });
    
    $("#" + zoomElementID).css('-webkit-animation-name', 'zoomGlow'); /* Chrome, Safari, Opera */
    $("#" + zoomElementID).css('-webkit-animation-duration', '2s'); /* Chrome, Safari, Opera */
    
    var canvasHeight = $('.panZoomFrame').height();
    var canvasWidth = $('.panZoomFrame').width();

    $(this.firstNode).draggable({
        zIndex: 50,
        appendTo: '.panZoomFrame',
        drag: function(e, ui) {
              
            ui.position.top =  Math.round(ui.position.top / global);
            ui.position.left = Math.round(ui.position.left / global);

            $('#miniIdeas' + ui.helper[0].id).css('left', ui.position.left/25);
            $('#miniIdeas' + ui.helper[0].id).css('top', ui.position.top/25);

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
            //logger.trace("UI for stop zoom space drag");
            //logger.trace(ui.helper[0].id);
            var elementID = ui.helper[0].id;
            var position = ui.position;
            var prevPosition = ZoomManager.getElementPosition(elementID, Session.get("currentUser"));
            logger.debug("Updating current position of idea in zoom space");
            //logger.trace("New position of idea " + elementID + ": " + JSON.stringify(position));
            ZoomManager.updatePosition(elementID, "Ideas", position, Session.get("currentUser"));
            EventLogger.logMoveZoomIdea(this, position, prevPosition);
        },
    });
});

/****************************************************************
*
* CLUSTER template rendering setup, helpers and events
*
****************************************************************/

Template.Cluster.onRendered( function() {   
    
    var clusterID = $(this.firstNode)[0].id;
    // //logger.trace("Zoom element: ");
    // //logger.trace(zoomElement);
    //logger.trace("Zoom element ID: " + clusterID);
    var oldPosition = ZoomManager.getElementPosition(clusterID, Session.get("currentUser"));
    //logger.trace("Old position: " + oldPosition);
    $(this.firstNode).css("top", oldPosition.top);
    $(this.firstNode).css("left", oldPosition.left);
    $(this.firstNode).on('mousedown touchstart', function(e) {
            e.stopPropagation();
    });
     var canvasHeight = $('.panZoomFrame').height();
     var canvasWidth = $('.panZoomFrame').width();
     $(this.firstNode).draggable({
        accept: '.zoomSpaceElement',
        drag: function(e, ui) {
            ui.position.top = Math.round(ui.position.top/global);
            ui.position.left = Math.round(ui.position.left/global);
            $('#miniCluster' + ui.helper[0].id).css('left', ui.position.left/25);
            $('#miniCluster' + ui.helper[0].id).css('top', ui.position.top/25);
        },
        stop: function(e, ui) {
            var elementID = ui.helper[0].id;
            var position = ui.position;
            logger.debug("Updating current position of cluster in zoom space");
            //logger.trace("New position of idea " + elementID + ": " + JSON.stringify(position));
            ZoomManager.updatePosition(elementID, "Clusters", position, Session.get("currentUser"));
            EventLogger.logMovedCluster(this, position);
        },
    });
    
    $(this.firstNode).droppable({
        accept:'.zoomSpaceElement, .clusterListElement, .ideaListElement',
        drop: function(event, ui) {
            var currentClusterID = this.id;
            //logger.trace("current cluster ID: " + currentClusterID);
            var ideaID = ui.helper[0].id; 
            var clusterObject = Clusters.findOne(currentClusterID);
            var ideaObject =  Ideas.findOne(ideaID);     
            var user = Session.get("currentUser");       
        
            $("#" + currentClusterID).css('-webkit-animation-name', 'glowone'); /* Chrome, Safari, Opera */
            $("#" + currentClusterID).css('-webkit-animation-duration', '2s'); /* Chrome, Safari, Opera */
            
            // -webkit-animation-duration: 4s; /* Chrome, Safari, Opera */
            // animation-name: example;
            // animation-duration: 4s;

            ClusterFactory.insertIdeaToCluster(ideaObject, clusterObject);  

            // from zoomSpace or displayIdeas
            if($.inArray(ideaID, clusterObject.ideaIDs) == -1) {
                // Ideas.update({_id: ideaObject._id}, {$set: {'inCluster': true, 'inZoomSpace':false}});
                IdeaFactory.updateZoomSpaceFlag(ideaID, "remove");
                if (isInList(user._id, ideaObject.zoomSpace)) {
                    EventLogger.logZoomToCluster(ideaObject, clusterObject);
                } else {
                    EventLogger.logDisplayToCluster(ideaObject, clusterObject);
                }           
            } 
            
            // if it's already in another cluster belonging to the user, remove it
            if(ideaObject.clusterIDs.length > 1) {
               logger.debug("Array of clusters"  + ideaObject.clusterIDs);     
               var prevClusters = Clusters.find({_id: {$in: ideaObject.clusterIDs}}).fetch();
               prevClusters.forEach(function(cluster){
                    if ((cluster.userID == Session.get("currentUser")._id) && (cluster._id != currentClusterID)) {
                         logger.debug("Removing from user's previous cluster with id: " + cluster._id);
                         ClusterFactory.removeIdeaFromCluster(ideaObject, cluster); 
                         EventLogger.logClusterToCluster(ideaObject, cluster, clusterObject);
                    } else {
                         logger.debug("Cluster with id " + cluster._id + " not previously in user's clusters");
                    }
               });
            }
            $("#" + currentClusterID).removeClass('-webkit-animation-name', 'glowone'); 
            $("#" + currentClusterID).css('-webkit-animation-name', 'glowtwo'); 
            $("#" + currentClusterID).css('-webkit-animation-duration', '2s'); 
        }
    });    
    $(this.firstNode).on({
        "shown.bs.dropdown":  function() { this.closable = false; },
        "click"            :  function() { this.closable = true;  },
        "hide.bs.dropdown" :  function() { return this.closable;  }
    });
});

Template.Cluster.helpers({
    getIdeas: function() {
        return Ideas.find();
    },
    getClusterIdeas: function() {  
        var targetCluster = Clusters.findOne(this._id);
        ////logger.trace("target cluster " + JSON.stringify(targetCluster));
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
        ////logger.trace("target cluster " + JSON.stringify(targetCluster));
        IdeaIDs = targetCluster.ideaIDs; 
        // logger.debug("Idea IDS "  + IdeaIDs)
        //{ field: { $in: [<value1>, <value2>, ... <valueN> ] } }
        return Ideas.find({_id:{$in:IdeaIDs}}).count();  // Iterated over IdeaIDs 
    },  
});

Template.Cluster.events({
    
    "click .clusterName" : function() {
            var clusterID = this._id; 
            var textBoxID = this._id; 
            var label = $('.clusterName' +  "#" + clusterID);
            var textBox = $('.nameCluster' + "#" + textBoxID); 
            var currentName = Clusters.findOne({_id: this._id}).name;
            label.hide();
            textBox.val(currentName);
            textBox.show();
            textBox.focus();
    }, 
    
    "keyup .nameCluster": function (event, template) {
        
        if(event.keyCode == 13){
            var clusterID = this._id; 
            var textBoxID = this._id; 
            var label = $('.clusterName' +  "#" + clusterID);
            var textBox = $('.nameCluster' + "#" + textBoxID); 
            var oldName = this.name;
            var clusterName  = event.target.value.slice(0, -1); // add slice to remove the carriage return

            if(!clusterName.match(/[a-z]/i)){
                clusterName = "Not named yet..."
            }
            textBox.hide();
            label.show();
            ClusterFactory.setName(this, clusterName);
            // Clusters.update({_id: clusterID}, {$set: {'name' : text}});
            EventLogger.logChangeClusterName(this, clusterName, oldName);
        } 
        return false;
    },

    'click #downArrow': function(event, template) {
        Clusters.update({_id: this._id},
            {$set: {isCollapsed: !this.isCollapsed}});
        event.stopPropagation();
        EventLogger.logClusterCollapse(this);

    },
});

Template.ClusterIdeaElement.onRendered(function () {
     
    $(this.firstNode).on('mousedown touchstart', function(e) {
        e.stopPropagation();
    });

   $(this.firstNode).draggable({
        //containment: '.synth  esisBox',
        //revert: true,
        zIndex: 50,
        drag: function(e, ui) {
            // var width = $(this).css('width');
            // $(ui.helper[0]).css('width', width);          
        },
    });
});

Template.DeleteCluster.onRendered( function() {
    
    $(this.firstNode).click(function(){
        
            if(confirm("Are you sure you want to delete this label? Any attached ideas will go back into the list on the left")){
                
                var clusterID =  this.parentNode.parentNode.parentNode.parentNode.id;
                //logger.trace("cluster ID to delete: " + clusterID)
                var cluster = Clusters.findOne(clusterID);
                var ideasInCluster = cluster.ideaIDs; 
                var user = Session.get("currentUser");
                ClusterFactory.trash(cluster);
                $("#miniCluster" + cluster._id).remove();
                updateClusterFilter(cluster._id, "remove");
                for (var i = ideasInCluster.length - 1; i >= 0; i--) {   
                    // Ideas.update({_id: ideasInCluster[i]}, 
                        // {$set: {'inZoomSpace':false, 'inCluster':false}});
                    // IdeaFactory.toggleZoomSpaceFlag(ideaID, user._id);
                    IdeaFactory.updateZoomSpaceFlag(ideasInCluster[i], "remove");
                    EventLogger.logClusterToDisplay(Ideas.findOne(ideasInCluster[i]), cluster);
                    //$("#" +ideasInCluster[i]).remove(); 
                   // Ideas.update({_id: ideasInCluster[i]}, {$set: {'inCluster': false, 'inZoomSpace':false}});
                }; 
                EventLogger.logDeletingCluster(cluster);
            }
    });
});

/****************************************************************
*
* Convenience functions
*
****************************************************************/

var setBaseIdeasFilters = function setBaseIdeasFilters(filterName) {

    var user = Session.get("currentUser");

    FilterManager.create(filterName, user, 
        "ideas", "promptID", Session.get("currentPrompt")._id);
    
    // init cluster filters
    // var clusters = Clusters.find({userID: user._id}).fetch();
    var clusters = FilterManager.performQuery("clusterFilter", user, "clusters").fetch();
    clusters.forEach(function(cluster) {
        FilterManager.create(filterName, user,
        "ideas", "clusterIDs", cluster._id, "ne");
    });
    
    // add synth subset filters (if from experiment)
    var part = Session.get("currentParticipant");
    if (part) {
        logger.debug("On synthesis experiment workflow; updating " + filterName + " filter");
        addSynthExpFilter(filterName, part);
    }
}

var setBaseClusterFilters = function setBaseClusterFilters(filterName) {

    var user = Session.get("currentUser");

    // get all clusters that belong to the user AND are not trashed
    FilterManager.create(filterName, user, 
        "clusters", "userID", user._id);
    FilterManager.create(filterName, user, 
        "clusters", "isTrash", false);

}

var addSynthExpFilter = function addSynthExpFilter(filterName, part) {
    
    logger.debug("Calling addSynthExpFilter for " + filterName);
    
    var subset = SynthSubsets.findOne({_id: part.misc.subsetID});
    //logger.trace(JSON.stringify(subset));

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

fromCluster = function fromCluster(ideaID) {
    var clusters = Clusters.find({ideaIDs: ideaID}).fetch();
    if (clusters.length > 0) {
        return true;
    } else {
        return false;
    }
}

fromDisplayIdeas = function fromDisplayIdeas(ideaID) {
    
    var displayIdeas = FilterManager.performQuery("displayIdeas", Session.get("currentUser"), "ideas").fetch()
    var fromDisplay = false;
    displayIdeas.forEach(function(idea) {
        if (idea._id == ideaID) {
            logger.debug("This is coming from displayIdeas");
            fromDisplay = true;
        }
    });
    logger.debug("This is not from displayIdeas");
    return fromDisplay;
    // var user = Session.get("currentUser");
    // var idea = Ideas.findOne({_id: ideaID});
    // // //logger.trace(JSON.stringify(idea));
    // var clusters = Clusters.find({_id: {$in: idea.clusterIDs}, userID: user._id, isTrash: false}).fetch();
    // //logger.trace(JSON.stringify(clusters));
    // if (clusters.length < 1 && !isInList(user._id, idea.zoomSpace)) {
    //     logger.debug("This is coming from displayIdeas");
    //     return true;
    // } else {
    //     logger.debug("This is not from displayIdeas");
    //     return false;
    // }
}