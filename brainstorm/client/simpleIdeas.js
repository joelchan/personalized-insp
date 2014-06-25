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
    var newIdeas = [];
      //console.log("inserting priming ideas");
      if (participant.condition.id == 1) {
        //console.log("Priming with rare ideas");
        //Grab 5 random rare ideas
        var ideas = getRandomRares();
        for (var i=0; i<ideas.length; i++) {
          //console.log(ideas[i]);
          //console.log("creating rare idea: " + ideas[i]);
            var idea = new Idea(ideas[i],
                participant.user,
                participant.condition.prompt,
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
                participant.user,
                participant.condition.prompt,
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

Template.IdeationPage.helpers({
    ideas: function() {
      return Ideas.find({participant: Session.get("currentParticipant")});
    },

    primeIdeas: function() {
        //console.log("getting prime ideas");
        var part = Session.get("currentParticipant");
        var primes = part.misc;
        //console.log(part);
        //console.log(primes);
        return primes;
    }
});
    


//Template.IdeationPage.ideas = function () {

  //if (Session.get("currentPrompt") !== undefined) {
      //return Ideas.find({user: Session.get('currentUser'),
          //question_id: Session.get("currentPrompt")['_id']});
  //} else {
    //return Ideas.find();
  //}
//};

Template.IdeationPage.prompt = function () {
    var condition = Session.get("currentParticipant").condition;
    //console.log(condition);
    return condition.prompt.question;
};

Template.IdeationPage.rendered = function() {
  //Debug statements
  //console.log("rendered");
  //console.log(Session.get('currentExp'));
  // Scroll window back to top
  window.scrollTo(0,0);
  // Register event listenr to click submit button when enter is pressed
  $('#nextIdea').keypress(function(e){
  if(e.keyCode===13)
    $('#submitIdea').click();
  });
  //Add Exit study button to top right
  $('.login').append('<button id="exitStudy" class="exitStudy btn-sm btn-default btn-primary">Exit Early</button>');

  //Insert ideas into database depnding on experimental condition
  var primes = getPrimingIdeas();
  var participant = Session.get("currentParticipant");
  //participant.misc = primes;
  Participants.update({_id: participant._id}, {$set: {misc: primes}});
  Session.set("currentParticipant", Participants.findOne({_id: participant._id}));
  var participant = Session.get("currentParticipant");
  //console.log(participant);
  logBeginIdeation(participant);
  //Set timer for page to transition after 15 minutes
  setTimeout('Router.goToNextPage("IdeationPage")', 900000);
  //Setup timer for decrementing onscreen timer
  Session.set("timeLeft", 15);
  setTimeout('decrementTimer()', 6000);
};

Template.IdeationPage.events({
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
        if (newIdea !== "") {
          var participant = Session.get("currentParticipant");
          var idea = new Idea(newIdea,
              participant.user,
              participant.condition.prompt,
              participant
              );
          //console.log(idea); 
          var ideaID = Ideas.insert(idea); //returns _id of Idea after it is inserted
          logIdeaSubmission(participant, ideaID); 
          // Clear the text field
          $('#nextIdea').val("");
        }
    }

});


//Placing the button in the navbar means I have to add event listeners
//to the toplevel template
Template.IdeaGen.events({
    //Transition to next page in state machine
    'click button.exitStudy': function () {
      logEndIdeation(Session.get("currentParticipant"));
      $('.exitStudy').addClass("hidden");
      Router.goToNextPage("IdeationPage");
    }
});


getUser = function() {
  /******************************************************************
  * Grab the userid from MTurk
  ******************************************************************/

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
