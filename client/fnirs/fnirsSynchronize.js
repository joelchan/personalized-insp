Template.FNIRS_Synchronize.events({
    'click .continue': function() {
        EventLogger.logFNIRSMarker();
        var part = Session.get("currentParticipant");
        var condName = Conditions.findOne({_id: part.conditionID}).description;
        var routeName = "FNIRS_Baseline";
        var promptID = Experiments.findOne({_id: part.experimentID}).promptID;
        // logger.debug("Sending to " + routeName);
        Router.go(routeName, {'promptID': promptID, 'partID': part._id});
    }
});