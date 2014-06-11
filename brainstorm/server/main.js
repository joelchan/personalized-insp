//Initialize Roles
//Meteor.startup(function() {
//});
     
Meteor.startup(function() {
    /****************************************************************
    * Setup a simple experiment with 2 conditions for individual 
    * brainstorming
    ****************************************************************/

    //Initialize roles
    if (Roles.find().count() === 0) {
        var ideator = new Role("Common Ideator");
        ideator.workflow = ["LoginPage",
          "ConsentPage",
          "IdeationPage1",
          "SurveyPage",
          "FinalizePage"];
        Roles.insert(ideator);
        ideator = new Role("Rare Ideator");
        ideator.workflow = ["LoginPage",
          "ConsentPage",
          "IdeationPage2",
          "SurveyPage",
          "FinalizePage"];
        Roles.insert(ideator);

    }
    //Initialize experiment hardcoded on boot
    if (Experiments.find().count() === 0) {
      var question = "Many people have old iPods or MP3 players that they no longer use. Please brainstorm 50 uses for old iPods/MP3 players. Assume that the devices' batteries no longer work, though they can be powered via external power sources. Also be aware that devices may <em>not</em> have displays. Be as specific as possible in your descriptions."
      var exp = new Experiment();
      exp.description = "Replicating the effect of priming with common vs rare ideas in individual brainstorming"; 
      var cond1 = new ExpCondition(1,
          question,
          "individual brainstorming primed with rare ideas",
          30
          );
      cond1.groupTemplate.addRole(
          Roles.findOne({'title': "Common Ideator"}), 1)
      var cond2 = new ExpCondition(2, 
          question,
          "individual brainstorming primed with common ideas",
          30
          );
      cond2.groupTemplate.addRole(
          Roles.findOne({'title': "Rare Ideator"}), 1)
      exp.conditions = [cond1, cond2];
      exp.setNumGroups(1);
      Experiments.insert(exp);
      //console.log(Experiments.find().fetch());
    }
});

