// Setup a collection to contain all ideas
Ideas = new Meteor.Collection("ideas");
Tags = new Meteor.Collection("tags");

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
        if (Tags.find().count() === 0) {
            var sampleTags = ["food", "sport"];
            for (var i=0; i<sampleTags.length; i++) 
                Tags.insert({tag: sampleTags[i]});
        }
    });
};
