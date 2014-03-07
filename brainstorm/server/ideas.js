// Setup a collection to contain all ideas
Ideas = new Meteor.Collection("ideas");

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

