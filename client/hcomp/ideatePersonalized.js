// Configure logger for Tools
var logger = new Logger('Client:IdeatePersonal');
// Comment out to use global logging level
Logger.setLevel('Client:IdeatePersonal', 'trace');
// Logger.setLevel('Client:IdeatePersonal', 'debug');
// Logger.setLevel('Client:IdeatePersonal', 'info');
// Logger.setLevel('Client:IdeatePersonal', 'warn');

var numMatches = 3;
var stuckTimeOut;

Template.IdeaEntry.onRendered(function(){

  spell = BJSpell("dictionary.js/en_US.js");

  Session.set("misspelledThemes", []);
  Session.set("numMisspelledThemes", 0);

  Session.set("misspelledProps", []);
  Session.set("numMisspelledProps", 0);

  // var themeHighlightWords = [];
  // var propHighlightWords = [];

  // $("#idea-theme").highlightTextarea({
  //     words: themeHighlightWords
  // });

  // $("#idea-prop").highlightTextarea({
  //     words: propHighlightWords
  // });

  // Meteor.setInterval(function() {
  //   var themeWords = $("#idea-theme").val().split(" ");
  //   themeWords.forEach(function(w) {
  //     if (!spell.check(w)) {
  //       logger.trace("Misspelled word: " + w);
  //       themeHighlightWords.push(w)
  //     }
  //   });
  //   var propWords = $("#idea-prop").val().split(" ");
  //   propWords.forEach(function(w) {
  //     if (!spell.check(w)) {
  //       logger.trace("Misspelled word: " + w);
  //       propHighlightWords.push(w)
  //     }
  //   });
  // }, 5000);
  

});

Template.IdeaEntry.helpers({
  isStuck: function() {
    return Session.equals("cogState", "stuck");
  },
  anyMisSpellings: function() {
    if (Session.equals("numMisspelledThemes", 0) && Session.equals("numMisspelledProps", 0)) {
      return false;
    } else {
      return true;
    }
  },
  anyMisSpelledTheme: function() {
    if (Session.equals("numMisspelledThemes", 0)) {
      return false;
    } else {
      return true;
    }
  },
  anyMisSpelledProp: function() {
    if (Session.equals("numMisspelledProps", 0)) {
      return false;
    } else {
      return true;
    }
  },
  misspelledThemes: function() {
    var misSpellings = Session.get("misspelledThemes");
    var msg = "";
    if (misSpellings) {
      if (misSpellings.length > 1) {
        msg = " any of these: ";
        msg += misSpellings.join(", ");
      } else {
        msg = misSpellings[0];
      }
    }
    return msg;
  },
  misspelledProps: function() {
    var misSpellings = Session.get("misspelledProps");
    var msg = "";
    if (misSpellings) {
      if (misSpellings.length > 1) {
        msg = " any of these: ";
        msg += misSpellings.join(", ");
      } else {
        msg = misSpellings[0];
      }
    }
    return msg;
  },
});

Template.IdeaEntry.events({
  'change input[id="idea-theme"]': function() {
    logger.debug("Changed input in idea theme box");
    var words = $("#idea-theme").val().split(" ");
    var misSpelled = [];
    words.forEach(function(w) {
      if (!spell.check(w)) {
        misSpelled.push(w)
      }
    });
    Session.set("misspelledThemes", misSpelled);
    Session.set("numMisspelledThemes", misSpelled.length);
    if (misSpelled.length < 1) {
      logger.debug("No misspelled themes!");
      // Session.set("misspelledThemes", []);
    } else {
      logger.trace("Possibly misspelled themes: " + JSON.stringify(misSpelled));
    }
  },

  'change input[id="idea-prop"]': function() {
    logger.debug("Changed input in idea prop box");
    var words = $("#idea-prop").val().split(" ");
    var misSpelled = [];
    words.forEach(function(w) {
      if (!spell.check(w)) {
        misSpelled.push(w)
      }
    });
    Session.set("misspelledProps", misSpelled);
    Session.set("numMisspelledProps", misSpelled.length);
    if (misSpelled.length < 1) {
      logger.debug("No misspelled props!");
    } else {
      logger.trace("Possibly misspelled props: " + JSON.stringify(misSpelled));
    }
  },

  'click .submit-idea': function (e, target) {
    //console.log("event submitted");
    logger.debug("submitting a new idea");
    var theme = $("#idea-theme").val();
    var prop = $("#idea-prop").val();
    var description = $("#idea-description").val();
    //Add idea to database
    var idea = IdeaFactory.createWedding(theme, prop, description, 
        Session.get("currentUser"),
        Session.get("currentPrompt")
    );
    if (idea) {
      Session.set("lastIdea", idea);
      //EventLogger.logIdeaSubmission(idea); 
    //}
    // Clear the text field
      $("#idea-theme").val("");
      $("#idea-prop").val("");
      $("#idea-description").val("");

      Session.set("misspelledThemes", []);
      Session.set("numMisspelledThemes", 0);

      Session.set("misspelledProps", []);
      Session.set("numMisspelledProps", 0);

      logger.trace("Theme: " + theme + ", Prop: " + prop);
      WeddingInspManager.retrieveInsp("rollThemes", theme, "weddingTheme", numMatches);
      WeddingInspManager.retrieveInsp("rollProps", prop, "weddingProp", numMatches);
      // updateInspFilter("rollThemes");
      // updateInspFilter("rollProps");

      if (Session.equals("cogState", "stuck")) {
        // Meteor.clearTimeout(stuckTimeOut);
        Session.set("cogState", "onRoll");
        // $('input[type=checkbox]').val("1");
        // $("#roll-insps-container").css('-webkit-animation-name', 'rollGlow'); /* Chrome, Safari, Opera */
        // $("#roll-insps-container").css('-webkit-animation-duration', '2s'); /* Chrome, Safari, Opera */
      }
    } else {
      alert("Make sure all fields are filled out before submitting!");
    }
  },
  'click .roll-button': function() {
    logger.debug("Clicked on a roll");
    Session.set("cogState", "onRoll");
  },
  'click .stuck-button': function(e, target) {
    logger.debug("Clicked stuck button");
    if (Session.equals("cogState", "onRoll")) {
      logger.debug("Switching from onRoll to stuck");
      var lastIdea = Session.get("lastIdea");
      logger.trace("Last idea: Theme: " + lastIdea.theme + ", Prop: " + lastIdea.prop);
      WeddingInspManager.retrieveInsp("stuckThemes", lastIdea.theme, "weddingTheme", numMatches, "different");
      WeddingInspManager.retrieveInsp("stuckProps", lastIdea.prop, "weddingProp", numMatches, "different");
      Session.set("cogState", "stuck");  
    } else {
      logger.debug("Already stuck, refreshing stuck inspirations");
      updateInspFilter("stuckThemes");
      updateInspFilter("stuckProps");
    }
    
    // updateInspFilter("stuckThemes");
    // updateInspFilter("stuckProps");
    // if($(this).is(':checked')) {
    //   logger.trace("Changing back to on a roll state");
    //   Session.set("cogState", "onRoll");
    // } else {
    //   var lastIdea = Session.get("lastIdea");
    //   logger.trace("Last idea: Theme: " + lastIdea.theme + ", Prop: " + lastIdea.prop);
    //   WeddingInspManager.retrieveInsp("stuckThemes", lastIdea.theme, "weddingTheme", numMatches, "different");
    //   WeddingInspManager.retrieveInsp("stuckProps", lastIdea.prop, "weddingProp", numMatches, "different");
    //   Session.set("cogState", "stuck");  
    // }
    // stuckTimeOut = Meteor.setTimeout(function() {
    //   Session.set("cogState", "onRoll");
    //   $("#roll-insps-container").css('-webkit-animation-name', 'rollGlow'); /* Chrome, Safari, Opera */
    //   $("#roll-insps-container").css('-webkit-animation-duration', '2s'); /* Chrome, Safari, Opera */
    // }, 30000);
    
  },
});

Template.IdeaList.helpers({
  weddingIdeas: function() {
    return Ideas.find({promptID: Session.get("currentPrompt")._id, 
                       userID: Session.get("currentUser")._id, 
                       isWedding: true}, {sort: {time: -1}})
  },
  numIdeas: function() {
    return Ideas.find({promptID: Session.get("currentPrompt")._id, 
                       userID: Session.get("currentUser")._id, 
                       isWedding: true}).count();
  }
});

Template.Inspiration.onRendered(function () {
  initInspirationFilter("rollThemes");
  initInspirationFilter("rollProps");
  initInspirationFilter("stuckThemes");
  initInspirationFilter("stuckProps");
  Session.set("cogState", "onRoll");

  // $("input[name=cogState").switchButton({
  //   on_label: 'Stuck!',
  //   off_label: 'On a roll!'
  // });

  // $('input[name="cogState"]').change(function () {
  //   if ($(this).attr('checked') == 'checked'){
  //     $('input[name="cogState"]').trigger('change').removeAttr('checked');
  //     logger.trace("Changing back to on a roll state");
  //     Session.set("cogState", "onRoll");
  //   }
  //   else {
  //     $('input[name="cogState"]').trigger('change').attr('checked', 'checked');
  //     var lastIdea = Session.get("lastIdea");
  //     logger.trace("Last idea: Theme: " + lastIdea.theme + ", Prop: " + lastIdea.prop);
  //     WeddingInspManager.retrieveInsp("stuckThemes", lastIdea.theme, "weddingTheme", numMatches, "different");
  //     WeddingInspManager.retrieveInsp("stuckProps", lastIdea.prop, "weddingProp", numMatches, "different");
  //     Session.set("cogState", "stuck"); 
  //   }
  // });
});

Template.Inspiration.helpers({
  inspRollThemes: function() {
    // var rollThemes = Session.get("rollThemes");
    // updateInspFilter(rollThemes, "rollThemes");
    return FilterManager.performQuery("rollThemes", Session.get("currentUser"), "weddingInspirations");
  },
  inspRollProps: function() {
    // var rollProps = Session.get("rollProps");
    // updateInspFilter(rollProps, "rollProps");
    return FilterManager.performQuery("rollProps", Session.get("currentUser"), "weddingInspirations");
  },
  inspStuckThemes: function() {
    // var stuckThemes = Session.get("stuckThemes");
    // updateInspFilter(stuckThemes, "stuckThemes");
    return FilterManager.performQuery("stuckThemes", Session.get("currentUser"), "weddingInspirations");
  },
  inspStuckProps: function() {
    // var stuckProps = Session.get("stuckProps");
    // updateInspFilter(stuckProps, "stuckProps");
    return FilterManager.performQuery("stuckProps", Session.get("currentUser"), "weddingInspirations");
  },
  isStuck: function() {
    return Session.equals("cogState", "stuck");
  }
});

Template.Inspiration.events({
  // 'click .stuck-button': function(e) {
    // logger.trace("Clicked stuck checkbox");
    // var name = $(e.target).attr('for');
    // if ($("input[name='+name+']").attr('checked') == 'checked'){
    //   $("input[name='+name+']").trigger('change').removeAttr('checked');
    //   logger.trace("Changing back to on a roll state");
    //   Session.set("cogState", "onRoll");
    // }
    // else {
    //   $('input[name="cogState"]').trigger('change').attr('checked', 'checked');
    //   var lastIdea = Session.get("lastIdea");
    //   logger.trace("Last idea: Theme: " + lastIdea.theme + ", Prop: " + lastIdea.prop);
    //   WeddingInspManager.retrieveInsp("stuckThemes", lastIdea.theme, "weddingTheme", numMatches, "different");
    //   WeddingInspManager.retrieveInsp("stuckProps", lastIdea.prop, "weddingProp", numMatches, "different");
    //   Session.set("cogState", "stuck"); 
    // }
  // },
  'click .roll-button': function() {
    logger.debug("Clicked on a roll");
    Session.set("cogState", "onRoll");
  },
  'click .stuck-button': function(e, target) {
    logger.trace("Clicked stuck button");
    var lastIdea = Session.get("lastIdea");
    logger.trace("Last idea: Theme: " + lastIdea.theme + ", Prop: " + lastIdea.prop);
    WeddingInspManager.retrieveInsp("stuckThemes", lastIdea.theme, "weddingTheme", numMatches, "different");
    WeddingInspManager.retrieveInsp("stuckProps", lastIdea.prop, "weddingProp", numMatches, "different");
    Session.set("cogState", "stuck");
    // if($(this).is(':checked')) {
    //   logger.trace("Changing back to on a roll state");
    //   Session.set("cogState", "onRoll");
    // } else {
    //   var lastIdea = Session.get("lastIdea");
    //   logger.trace("Last idea: Theme: " + lastIdea.theme + ", Prop: " + lastIdea.prop);
    //   WeddingInspManager.retrieveInsp("stuckThemes", lastIdea.theme, "weddingTheme", numMatches, "different");
    //   WeddingInspManager.retrieveInsp("stuckProps", lastIdea.prop, "weddingProp", numMatches, "different");
    //   Session.set("cogState", "stuck");  
    // }
    // stuckTimeOut = Meteor.setTimeout(function() {
    //   Session.set("cogState", "onRoll");
    //   $("#roll-insps-container").css('-webkit-animation-name', 'rollGlow'); /* Chrome, Safari, Opera */
    //   $("#roll-insps-container").css('-webkit-animation-duration', '2s'); /* Chrome, Safari, Opera */
    // }, 30000);
  }
});

var initInspirationFilter = function(filterName) {
  if(Filters.find({name: filterName, user: Session.get("currentUser")._id}).count() == 0) {
    FilterManager.create(filterName, Session.get("currentUser"), 
      "weddingInspirations", "previous_id", "NonsenseID");
  }
}

var updateInspFilter = function(filterName) {
  var insps = Session.get(filterName);
  // logger.trace("Inspirations: " + JSON.stringify(insps));
  var samples = []
  while (samples.length < numMatches) {
    var sample = getRandomElement(insps);
    if (!isInList(sample, samples)) {
      samples.push(sample);  
    }
  }
  // for (i=0; i<numMatches; i++) {
  //   var sample = getRandomElement(insps);
  //   samples.push(sample);
  // }
  // var slicedData = insps.slice(0,numMatches);
  // var matches = [];
  FilterManager.reset(filterName, Session.get("currentUser"), "weddingInspirations");
  samples.forEach(function(sample) {
      // matches.push(WeddingInspirations.findOne({previous_id: sample}));
      FilterManager.create(filterName, Session.get("currentUser"), 
        "weddingInspirations", "previous_id", sample.id);
  });
  logger.trace(samples.length + " matches with average similarity: " + WeddingInspManager.averageSim(samples));
  logger.trace("New matches are: " + JSON.stringify(samples));
}