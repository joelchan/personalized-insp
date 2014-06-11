// Setup a collection to contain all ideas

Meteor.startup(function() {
    if (Ideas.find().count() === 0) {
        var sampleIdeas = ["bowling",
                            "hammering",
                            "floats"];
        for (var i=0; i<sampleIdeas.length; i++) 
                Ideas.insert({idea: sampleIdeas[i]});
        }
    });



Meteor.startup(function() {
    if(Names.find().count()>0){
        Names.remove({});
    }
  });

