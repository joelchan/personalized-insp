// Setup a collection to contain all ideas
Ideas = new Meteor.Collection("ideas");
Types = new Meteor.Collection("types");

if (Meteor.isServer) {
    Meteor.startup(function() {
        if (Ideas.find().count() === 0) {
            var sampleIdeas = ["bowling",
                            "hammering",
                            "floats"];
            for (var i=0; i<sampleIdeas.length; i++) 
                Ideas.insert({idea: sampleIdeas[i]});
        }
    });
};

if (Meteor.isServer) {
    Meteor.startup(function() {
        if (Types.find().count() === 0) {
            var sampleTypes = ["food", "sport"];
            for (var i=0; i<sampleTypes.length; i++) 
                Types.insert({type: sampleTypes[i]});
        }
    });
};
