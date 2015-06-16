var logger = new Logger('Client:Hcomp:SubrouteSandbox');
Logger.setLevel('Client:Hcomp:SubrouteSandbox', 'trace');

Template.CreateIdeas.helpers({
    dropOnEmpty: true,
    getIdeas: function() {
        return Ideas.find();
    },
});


Template.SubrouteSandbox.helpers({
    setFilterName: function(name) {
        filterName = name + "IdeasFilter";
        console.log(filterName);
        //doesn't work
    },
    participants: function() {
        return MyUsers.find({
            type: "Ideator"
        });
    },
    ideas: function() {
        filteredIdeas = getFilteredIdeas("Ideas Filter");
        return filteredIdeas;
    },
    currentClusters: function() {
        return Clusters.find({
            _id: {
                $ne: "-1"
            }
        });
    },
    numIdeas: function() {
        return getFilteredIdeas("Ideas Filter").length;
    },
    hasRead: function() {

        if (isInList(Session.get("currentUser")._id, this.readIDs)) {
            return (true);
        } else {
            return (false);
        }
    },
    getClusters: function() {
        return Clusters.find();
    },
});



Template.drag2.rendered = function() {
    $(this.firstNode).draggable({
        //containment: '.synthesisBox',
        //revert: true,
        //zIndex: 50,
        //helper: 'clone',
        //accept: '.card',
        appendTo: '.synthesisBox',
        //appendTo: '.card',
        snap: true,
        refreshPositions: true, // Decreases performance tremendously 
        start: function(e, ui) {
            logger.debug("Began dragging an cluster");
            logger.trace(ui.helper[0]);
            var width = $(this).css('width');
            logger.trace(width);
            $(ui.helper[0]).css('width', width);
        },
    });
};



Template.SubrouteSandbox.rendered = function () {
        $("#items1,#items2").sortable({
                connectWith: "#items1,#items2",
                start: function (event, ui) {
                        ui.item.toggleClass("highlight");
                },
                stop: function (event, ui) {
                        ui.item.toggleClass("highlight");
                }
        });
        $("#items1,#items2").disableSelection();
};


