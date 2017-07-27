var baselineLength = 1*60000;

Template.FNIRS_Baseline.events({
    'click .continue': function() {
        $('.instructions').hide();
        $('#lpheader').hide();
        $('.fixation-cross-container').show();
        EventLogger.logFNIRSBaselineStart();
        Meteor.setTimeout(function() {
            EventLogger.logFNIRSBaselineStop();
            alert("Thank you for your patience! We will now proceed to the next screen");

            var part = Session.get("currentParticipant");
            var condName = Conditions.findOne({_id: part.conditionID}).description;
            var routeName = "ExpFluency";
            var promptID = Experiments.findOne({_id: part.experimentID}).promptID;

            $('#lpheader').show();

            // logger.debug("Sending to " + routeName);
            Router.go(routeName, {'promptID': promptID, 'partID': part._id});
        }, baselineLength);
    }
});
