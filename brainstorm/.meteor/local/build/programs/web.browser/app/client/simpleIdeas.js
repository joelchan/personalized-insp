(function(){// Keeps text input field until submit is pressed
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

/********************************************************************
* Template helpers
********************************************************************/
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
      return Session.get("currentPrompt").question
    }
});

Template.IdeaBox.helpers({
    ideas: function() {
      return Ideas.find({userID: Session.get("currentUser")._id});
    },
});

Template.simpleIdea.helpers({
  isStarred : function(){
    var idea = Ideas.findOne({_id: this._id});
    if (idea === undefined)
      return false;
    return idea.isGamechanger;
  }
})


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

  isPrompt : function(){
    if(this.type.val === 1)
      return true;
    else
      return false;
  },

  isTheme : function(){
    if(this.type.val === 2)
      return true;
    else
      return false;
  },

  time : function(){
    timeDep.depend();
    return getTime(this.time);
  }
});

Template.sentexamples.helpers({
  examples : function(){
    // console.log(examples[0].content);
    return this.examples;
  }
});

Template.senttheme.helpers({
  theme : function(){
    //console.log(this);
    return Clusters.findOne({_id: this.theme}).name;
  },

  themeexamples : function(){
    var ideaIDs = Clusters.findOne({_id: this.theme}).ideaIDs;
    return Ideas.find({_id: {$in: ideaIDs}});
  }
});

Template.senttheme.events({
  'click .themehint' : function(){
    $(event.target).next().slideToggle();
  }
});
/********************************************************************
* IdeationPage Template
********************************************************************/
//Rendered Callback    
Template.IdeationPage.rendered = function() {
  $('.menu-link').bigSlide({
    'menu': ('#notifications'),
    'menuWidth': '25%'
  }).open();
  //Debug statements
  //console.log("rendered");
  //console.log(Session.get('currentExp'));
  // Scroll window back to top
  window.scrollTo(0,0);

  // Register event listenr to click submit button when enter is pressed2
  $('#nextIdea').keyup(function(e){
    if(e.keyCode===13) {
      //console.log("enter pressed")
      $('#submitIdea').click();
    }
  });
  
  //Insert ideas into database depnding on experimental condition
  //var primes = getPrimingIdeas();
  //var participant = Session.get("currentParticipant");
  //participant.misc = primes;
  //Participants.update({_id: participant._id}, {$set: {misc: primes}});
  //Update the participant misc fields in the session variable
  //Session.set("currentParticipant", Participants.findOne({_id: participant._id}));
  //var participant = Session.get("currentParticipant");
  //console.log(participant);
  //EventLogger.logBeginIdeation(participant);
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

Template.SubmitIdeas.rendered = function(){
  $("[data-toggle='tooltip']").tooltip({'placement': 'top'});
}

//Rendered Callback
Template.NotificationDrawer.rendered = function(){
  //$('.menu-link').bigSlide();

  messageAlertInterval = Meteor.setInterval(function(){
        // console.log("toggle");
        $('.notification-item.unhandled > div.panel-heading').toggleClass('flash');
        // #accordion > div:nth-child(1) > div.panel-heading
      }, 1000);

  Notifications.find({recipientIDs: Session.get("currentUser")._id, handled: false}).observe({
    added : function(doc){
      newNotify = doc;//Notifications.findOne({_id: doc}); //holds new notification
      // Meteor.clearInterval(messageAlertInterval);
    }
  });
  // Meteor.clearInterval(messageAlertInterval);
}

//Helpers
Template.NotificationDrawer.helpers({
  notifications : function(){
    return Notifications.find({recipientIDs: Session.get("currentUser")._id}, {sort: {time: -1}});
  },
  directions : function(){
    return this.type.val === -1;
  },
  primes : function(){
    return this.type.val === 3;
  }
});

//Events
Template.NotificationDrawer.events({
  'click a' : function(){
    var $notification = $(event.target).parent().parent().parent();
    var id = $notification.children('.panel-collapse').attr('id');
    var notification = Notifications.findOne({_id: id});
    if(!notification.handled){
      Notifications.update({_id: id}, {$set: {handled: true}});
      EventLogger.logNotificationHandled(notification);
      //return false; //handled event is same as first expansion event
    } else {
      var context = $(event.target).parent('.panel-heading').context;
      if($(context).hasClass("collapsed")){
        EventLogger.logNotificationExpanded(notification);
        //console.log("logging expansion");
      } else {
        EventLogger.logNotificationCollapsed(notification);
        //console.log("logging collapse");
      }
    }
    $notification.removeClass("unhandled");

    var $icon = $(event.target).children('i');
    //target is expanded
    if($icon.hasClass('fa-chevron-circle-down')){
      $icon.switchClass('fa-chevron-circle-down', 'fa-chevron-circle-right');
      return;
    }

    //set all other arrows to closed
    $('.fa-chevron-circle-down').each(function(i){
      $(this).switchClass('fa-chevron-circle-down', 'fa-chevron-circle-right');
      console.log($(this));
    });

    //target is collapsed
    if($icon.hasClass('fa-chevron-circle-right')){
      $icon.switchClass('fa-chevron-circle-right', 'fa-chevron-circle-down');
      return;
    }
  }
});

/********************************************************************
* SubmitIdeas Template
********************************************************************/
//Helpers
Template.SubmitIdeas.helpers({
  number : function(){
    return Notifications.find({recipientIDs: Session.get("currentUser")._id, handled: false}).count(); 
  }
});
//Events
var timer;
Template.SubmitIdeas.events({
    'click button.submitIdea': function () {
      //console.log("event submitted");
      var content = $('#nextIdea').val();
      //Add idea to database
      var idea = IdeaFactory.create(content, 
          Session.get("currentUser"),
          Session.get("currentPrompt")
      );
      EventLogger.logIdeaSubmission(idea); 
      // Clear the text field
      $('#nextIdea').val('');
      //Scroll window to new idea
      // $("html, body").animate({ scrollTop: $('.ideabox').height() }, "slow");
    },

    'click #request-help' : function(){
      var dbUsers = MyUsers.find({type: 'Facilitator'});
      dbUsers.forEach(function(user) {
        requestHelpNotify(Session.get("currentUser")._id, user._id);
      });
    },

    //waits 3 seconds after user stops typing to change isTyping flag to false
    'keyup textarea' : function(){;
      window.clearTimeout(timer);
      timer = window.setTimeout(function(){
        //isTyping = false;
      }, 3000);
    }
});


})();