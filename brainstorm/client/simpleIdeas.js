// Keeps text input field until submit is pressed
var primingIdeas = {'common':
[["Attach speakers and plug it in and use it as home radio",
    "Attach in car for a mp3 player that just stays in your car",
    "MP3 player if attached to external power source",
    "mini dj",
    "music player to listen to while in the shower"],
 ["give to charity",
    "give it as a gift (for real)",
    "donate to the troops",
    "Give to homeless",
    "give it to a person in need"],
 ["Coin case",
    "i place to hid things",
    "holder for push pins",
    "ciggerette case",
    "Storage Container"]],
'rare':
[["golfing aid, weight shift causes audial feedback to improve next swing",
    "They could be strung together to form vertical strings and hung in windows to help prevent birds from flying into the glass accidentally.",
    "You could suspend a bird feeder between two trees on a rope, and then hang another rope over it with strings of iPods attached, each long enough to pass the rope below it with the bird feeder. Maybe squirrels would be deterred by the noise, motion, and feel of the iPods swinging if they tried to climb out to the feeder.",
    "Put a bunch of them on strings and make wind chimes.",
    "You could tie one to a cord, hang it near a mare's stall, and then teach the mare to grab the iPod with her teeth and pull on it to ring a bell to let someone know she is going into labor."],
 ["They could be melted together at the edges and fashioned into ceiling fan blades.",
    "use the rubber from them to make tires",
    "You could take the sand that you ground them into and put it in an hourglass.",
    "You could melt them all down then pour the results out to create an emergency blanket-like super-thin tarp, if you added something to make it flexible and all.",
    "connect them and make a bike frame out of them"],
 ["make into a high frequency pest controller",
    "Truckers can use to stay awake, intermitant chirps",
    "in theater as translation for nonEnglish",
    "load them with audio, connect them to speakers and power and use them to repeat a message, such as advertisements.",
    "Load with a siren and use to scare off attackers. "]]
};

getRandomRares = function() {
  var rare1 = primingIdeas['rare'][0];
  var rare2 = primingIdeas['rare'][1];
  var rare3 = primingIdeas['rare'][2];
  var ideas = [];
  ideas.push(getRandomElement(rare1));
  ideas.push(getRandomElement(rare2));
  ideas.push(getRandomElement(rare3));
  while (ideas.length < 5) {
    var randomRare = getRandomElement(primingIdeas['rare']);
    var nextIdea = getRandomElement(randomRare);
    var notDuplicate = true;
    for (var i=0; i<ideas.length && notDuplicate; i++) {
      if (ideas[i] == nextIdea) {
        notDuplicate = false;
      }
    }
    if (notDuplicate) {
      ideas.push(nextIdea);
    }
  }
  return ideas;
};

getPrimingIdeas = function () {
    var participant = Session.get("currentParticipant");
    var user = Session.get("currentUser");
    //Check if priming ideas were already set
    if (participant.misc != undefined) {
      return participant.misc
    }
    var newIdeas = [];
    var cond = Conditions.findOne({_id: participant.conditionID});
    //console.log("inserting priming ideas");
    if (cond.id == 1) {
      //console.log("Priming with rare ideas");
      //Grab 5 random rare ideas
      var ideas = getRandomRares();
      for (var i=0; i<ideas.length; i++) {
        //console.log(ideas[i]);
        //console.log("creating rare idea: " + ideas[i]);
          var idea = new Idea(ideas[i],
              user,
              cond.prompt,
              participant
              );
          newIdeas.push(idea);
          //if (Ideas.find({content: idea.content}).count() == 0) {
            ////Ideas.insert(idea);
          //}
      }
    } else {
      //console.log("Priming with common ideas");
      var ideas = getRandomElement(primingIdeas['common']);
      for (var i=0; i<ideas.length; i++) {
          var idea = new Idea(ideas[i], 
              user,
              cond.prompt,
              participant
              );
          newIdeas.push(idea);
          //if (Ideas.find({content: idea.content}).count() == 0) {
            ////Ideas.insert(idea);
          //} 
      }
    }
    
    return newIdeas;
};

Template.Priming.helpers({
    primeIdeas: function() {
      //console.log("getting prime ideas");
      var part = Session.get("currentParticipant");
      var primes = part.misc;
      //console.log(part);
      //console.log(primes);
      return primes;
    },
});

Template.Prompt.helpers({
    prompt: function() {
      var part = Session.get("currentParticipant");
      if (part) {
        var condition = 
            Conditions.findOne({_id: part.conditionID});
        return condition.prompt.question;
      } else {
        return "";
      }
    }
});

Template.IdeaBox.helpers({
    ideas: function() {
      return Ideas.find({participantID: Session.get("currentParticipant")._id});
    },
});


/********************************************************************
* NotifyItem Template
********************************************************************/
var timeDep = new Deps.Dependency();


//Rendered callback
Template.NotifyItem.rendered = function(){
  timeInterval = Meteor.setInterval(function(){
    timeDep.changed();
  }, 60000);
}

//Helpers
Template.NotifyItem.helpers({
  title : function(){
    return this.type.title;
  }, 

  isExamples : function(){
    if(this.type.val === 0)
      return true;
    else
      return false;
  },

  examples : function(){
    return this.examples;
  },

  time : function(){
    timeDep.depend();
    return getTime(this.time);
  }
});
/********************************************************************
* IdeationPage Template
********************************************************************/
//Rendered Callback    
Template.IdeationPage.rendered = function() {
  $('.menu-link').bigSlide();
  //Debug statements
  //console.log("rendered");
  //console.log(Session.get('currentExp'));
  // Scroll window back to top
  window.scrollTo(0,0);

  // Register event listenr to click submit button when enter is pressed
  $('#nextIdea').keyup(function(e){
    if(e.keyCode===13) {
      //console.log("enter pressed")
      $('#submitIdea').click();
    }
  });

  
  //Add Exit study button to top right
  if ($('.exitStudy').length == 0) {
    $('.login').append('<button id="exitStudy" class="exitStudy btn-sm btn-default btn-primary">Exit Early</button>');
  } else {
      $('.exitStudy').removeClass('hidden');
  }

  //Add event handler for the exit study button
  $('.exitStudy').click(function() {
      console.log("exiting study early")
    Logger.logExitStudy(Session.get("currentParticipant"));
    exitIdeation();
  });

  //Insert ideas into database depnding on experimental condition
  var primes = getPrimingIdeas();
  var participant = Session.get("currentParticipant");
  //participant.misc = primes;
  Participants.update({_id: participant._id}, {$set: {misc: primes}});
  //Update the participant misc fields in the session variable
  Session.set("currentParticipant", Participants.findOne({_id: participant._id}));
  var participant = Session.get("currentParticipant");
  //console.log(participant);
  Logger.logBeginIdeation(participant);
  //Set timer for page to transition after 15 minutes
  Meteor.setTimeout('exitIdeation()', 900000);
  //Setup timer for decrementing onscreen timer
  Session.set("timeLeft", 15);
  Meteor.setTimeout('decrementTimer()', 60000);
};

//Events
Template.IdeationPage.events({
  'click #notifications-handle' : function(){
    $('#notifications-handle').toggleClass('moved');
  }
});

/********************************************************************
* NotificationDrawer Template
********************************************************************/
var newNotify = null; //stores a new notification

//defines isTyping as object that executes function when value is 
//changed to false and there is a new notfication waiting
(function() {
    var val = true;
    
    Object.defineProperty(window, "isTyping", {
        get: function() {
            return val;
        },
        set: function(v) {
            val = !!v;
            if(newNotify !== null && val === false){
              //alert(newNotify); //or some other function
              //newNotify = null;
              //val = true;
            }
        }
    });
})();

//Rendered Callback
Template.NotificationDrawer.rendered = function(){
  $('.menu-link').bigSlide();

  Notifications.find({recipient: Session.get("currentUser"), handled: false}).observeChanges({
    added : function(doc){
      newNotify = Notifications.findOne({_id: doc}); //holds new notification
    }
  });
}

//Helpers
Template.NotificationDrawer.helpers({
  notifications : function(){
    return Notifications.find({recipient: Session.get("currentUser")._id});
  },
  directions : function(){
    return this.type.val === -1;
  }
});

//Events
Template.NotificationDrawer.events({
  'click a' : function(){
    var $icon = $(event.target).children('i');
    if($icon.hasClass('fa-chevron-circle-right')){
      $icon.switchClass('fa-chevron-circle-right', 'fa-chevron-circle-down');
    } else if($icon.hasClass('fa-chevron-circle-down')){
      $icon.switchClass('fa-chevron-circle-down', 'fa-chevron-circle-right');
    }

    var $notification = $(event.target).parents('.unhandled');
    $notification.removeClass("unhandled");

    var id = $notification.find('.panel-collapse').attr('id');
    Notifications.update({_id: id}, {$set: {handled: true}});
  }
});

/********************************************************************
* SubmitIdeas Template
********************************************************************/
//Helpers
Template.SubmitIdeas.helpers({
  number : function(){
    return Notifications.find({recipient: Session.get("currentUser")._id, handled: false}).count(); 
  }
});
//Events
var timer;
Template.SubmitIdeas.events({
    'click button.submitIdea': function () {
        //console.log("event submitted");
        var newIdea = $('#nextIdea').val();
        //Check if idea already has been proposed
        //Ideas.find().forEach(function (idea) {
            //if (newIdea == idea.content) {
                //newIdea = "";
            //}
        //});
        //Add idea to database
        if (newIdea.trim() != "") {
          var participant = Session.get("currentParticipant");
          var user = Session.get("currentUser");
          var cond = Session.get("currentCond");
          //Set a session variable to convenience
          if (!cond) {
            cond = Conditions.findOne({_id: participant.conditionID});
            Session.set("currentCond", cond);
          }
          var idea = new Idea(newIdea,
              user,
              cond.prompt,
              participant
              );
          //console.log(idea); 
          var ideaID = Ideas.insert(idea); //returns _id of Idea after it is inserted
          Logger.logIdeaSubmission(participant, ideaID); 
          // Clear the text field
          $('#nextIdea').val('');
        }
    },

    'click #notify-bulb' : function(){
      $('#notifications-handle').toggleClass('moved');
    },

    //waits 3 seconds after user stops typing to change isTyping flag to false
    'keyup textarea' : function(){;
      window.clearTimeout(timer);
      timer = window.setTimeout(function(){
        //isTyping = false;
      }, 3000);
    }
});



getUser = function() {
  /******************************************************************
  * Grab the userid from MTurk
  ******************************************************************/

};

exitIdeation = function exitIdeation() {
  /******************************************************************
  * switch to next view to end ideation
  ******************************************************************/
  //Logs a partial idea if user hasn't submitted it
  $('#submitIdea').click();
  Logger.logEndIdeation(Session.get("currentParticipant"));
  $('.exitStudy').addClass("hidden");
  Router.goToNextPage("IdeationPage");
};

decrementTimer = function decrementTimer() {
  /******************************************************************
  * Decrement the onscreen timer
  ******************************************************************/
  var nextTime = Session.get("timeLeft") - 1;
  Session.set("timeLeft", nextTime);
  var time = $('#time').text(nextTime);
  if (nextTime != 0) {
    setTimeout('decrementTimer()', 60000);
  }
};
