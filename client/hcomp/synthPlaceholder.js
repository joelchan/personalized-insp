var logger = new Logger('Client:SynthPlaceholder');
// Comment out to use global logging level
Logger.setLevel('Client:SynthPlaceholder', 'trace');
// Logger.setLevel('Client:SynthPlaceholder', 'debug');
// Logger.setLevel('Client:SynthPlaceholder', 'info');
// Logger.setLevel('Client:SynthPlaceholder', 'warn');

Template.SynthesisPlaceholder.rendered = function(){

}

Template.SynthesisPlaceholder.helpers({
    condition: function() {
        // var part = Session.get("currentParticipant");
        // var cond = Conditions.findOne({_id: part.conditionID});
        // return cond.description;
        return "TestCondition";
    },
    experiment: function() {
        // var part = Session.get("currentParticipant");
        // var exp = Experiments.findOne({_id: part.experimentID});
        // return exp.description;
        return "TestExperiment";
    },
    subset: function() {
        // var part = Session.get("currentParticipant");
        // var subset = SynthSubets.findOne({_id: part.misc.synthSubsetID})
        // return subset.description;
        return "TestSubset";
    },
    ideas: function() {
        return "Nothing";
    }

});