// Keeps text input field until submit is pressed
var primingIdeas = {'common':
[["Attach speakers and plug it in and use it as home radio",
    "Attach in car for a mp3 player that just stays in your car",
    "MP3 player if attached to external power source",
    "mini dj",
    "music player to listen to while in the shower"],
 ["give to charity",
    "give it as a gift (for real)",
    "Uniform them for highschool spanish class",
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

Template.IdeationPage.ideas = function () {
  return Ideas.find({experiment: Session.get("currentExp"),
    user: Session.get("currentUser")
    });
  //if (Session.get("currentPrompt") !== undefined) {
      //return Ideas.find({user: Session.get('currentUser'),
          //question_id: Session.get("currentPrompt")['_id']});
  //} else {
    //return Ideas.find();
  //}
};

Template.IdeationPage.prompt = function () {
    return Session.get("currentExp").prompt.question;
};

Template.IdeationPage.rendered = function() {
  //Debug statements
  console.log("rendered");
  //console.log(Session.get('currentExp'));
  // Scroll window back to top
  window.scrollTo(0,0);
  // Register event listenr to click submit button when enter is pressed
  $('#nextIdea').keypress(function(e){
  if(e.keyCode===13)
    $('#submitIdea').click();
  });

  //Insert ideas into database depnding on experimental condition
};

Template.IdeationPage.events({
    'click button.submitIdea': function () {
        console.log("event submitted");
        var newIdea = $('#nextIdea').val();
        //Check if idea already has been proposed
        //Ideas.find().forEach(function (idea) {
            //if (newIdea == idea.content) {
                //newIdea = "";
            //}
        //});
        //Add idea to database
        if (newIdea !== "") {
          var idea = new Idea(newIdea,
              Session.get("currentUser"),
              Session.get("currentExp")
              );
          console.log(idea); 
          Ideas.insert(idea);
          // Clear the text field
          $('#nextIdea').val("");
        }
    },

    //Transition to next page in state machine
    'click button.nextPage': function () {
      var role = $.extend(true, new Role(), Session.get("currentRole"));
      Router.go(role.nextFunc("IdeationPage"), 
          {'_id': Session.get("currentExp")._id});
    }
});

getUser = function() {
  /******************************************************************
  * Grab the userid from MTurk
  ******************************************************************/

};
