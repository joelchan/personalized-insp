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


//Initialize Roles
Meteor.startup(function() {
    if (Roles.find().count() === 0) {
        var ideator = new Role("Ideator");
        ideator.workflow = ["LoginPage",
          "ConsentPage",
          "IdeationPage",
          "SurveyPage",
          "FinalizePage"];
        Roles.insert(ideator);

    }
});

Meteor.startup(function() {
    

});
    Meteor.startup(function() {
        if(Names.find().count()>0){
            Names.remove({});
        }
      });

