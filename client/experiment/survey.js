// Configure logger for Tools
var logger = new Logger('Client:Hcomp:Survey');
// Comment out to use global logging level
Logger.setLevel('Client:Hcomp:Survey', 'trace');
//Logger.setLevel('Client:Hcomp:Survey', 'debug');
// Logger.setLevel('Client:Hcomp:Survey', 'info');
//Logger.setLevel('Client:Hcomp:Survey', 'warn');

Template.SurveyPage.rendered = function() {
    $("#ss-submit").click(function() {
        console.log("form submitted");
        EventLogger.logSurveyComplete();
    });

    $("input[name='lang1']").click(function() {
      if ($("input[name='lang1']:checked").val() == "true") {
        $("#lang2Question").toggleClass("hidden");
      } else {
        $("#lang2Text").toggleClass("hidden");
      }
    });

    $("input[name='lang2']").click(function() {
      if ($("input[name='lang2']:checked").val() == "true") {
        $("#lang2Text").toggleClass("hidden");
      } 
    });

    var userID = Session.get("currentParticipant").userID;
    Session.set("currentUser",MyUsers.findOne({_id: userID}));

    //Scroll to top
    window.scrollTo(0,0);
    EventLogger.logSurveyBegan();
};

Template.SurveyPage.helpers({
  isTreatment: function() {
    var part = Session.get("currentParticipant");
    logger.trace("Found participant: " + JSON.stringify(part));
    var cond = Conditions.findOne({_id: part.conditionID});
    logger.trace("Found condition: " + JSON.stringify(cond));
    if (cond.description == "Treatment") {
      logger.trace("Participant is in treatment condition");
      return true;
    } else {
      return false
    }
  },
});

Template.SurveyPage.events({
	/*'click input#ss-submit': function(){
		console.log("hit");
		var elem = $('#nextpage');
		elem.prop('disabled', false);
	},*/

	'click button.submitForm' : function(){
    var part = Session.get("currentParticipant");
    var cond = Conditions.findOne({_id: part.conditionID});
    if (cond.description == "Treatment") {
      var resp = getTreatmentResponse();
    } else {
      var resp = getControlResponse();
    }
    resp._id = SurveyResponses.insert(resp);
    logger.trace("Created survey response with ID: " + resp._id);
    EventLogger.logSubmittedSurvey(part, resp);
    //Mark participant as finished
    ExperimentManager.logParticipantCompletion(part);
    // Participants.update({_id: part._id},
    //     {$set: {hasFinished: true}});
    //console.log("formsubmitted");
    Router.go("LegionFinalPage", {'partID': part._id});
    // Router.goToNextPage("SurveyPage");
    // try {
    //   var part = Session.get("currentParticipant");
    //   var cond = Conditions.findOne({_id: part.conditionID});
    //   if (cond.description == "Treatment") {
    //     var resp = getTreatmentResponse();
    //   } else {
    //     var resp = getControlResponse();
    //   }
    //   resp._id = SurveyResponses.insert(resp);
    //   EventLogger.logSubmittedSurvey(part, resp);
    //   //Mark participant as finished
    //   ExperimentManager.logParticipantCompletion(part);
    //   // Participants.update({_id: part._id},
    //   //     {$set: {hasFinished: true}});
    //   //console.log("formsubmitted");
    //   Router.go("LegionFinalPage", {'partID': part._id});
    //   // Router.goToNextPage("SurveyPage");
    // } catch (err) {
    //   console.log(err);
    //   alert("Please complete all questions in the survey before continuing");
    // }

	}
})

checkResponse = function(answer) {
  logger.debug("Checking response");
  if (!answer) {
    throw "Incomplete survey error";
  }
}

getControlResponse = function() {
  var responses = [];
  //Gender
  var answer = $("input[name='gender']:checked").val();
  // checkResponse(answer)
  responses.push(new QuestionResponse("Gender", answer));
        
  //Age
  answer = $("input[name='age']").val();
  // checkResponse(answer)
  responses.push(new QuestionResponse("Age", answer));
  //English 1st language
  answer = $("input[name='lang1']:checked").val();
  // checkResponse(answer)
  responses.push(new QuestionResponse("Is English your first language", answer));
  var lang1 = answer;
  var lang2 = "false";
  //2nd language yes/no
  if (lang1 == "true") {
    answer = $("input[name='lang2']:checked").val();
    // checkResponse(answer)
    responses.push(new QuestionResponse("Do you speak a 2nd language", answer));
    lang2 = answer;

  }
  //2nd language
  if (lang1 == "false" || lang2 == "true") {
    answer = $("input[name='lang2text']").val();
    // checkResponse(answer)
    responses.push(new QuestionResponse("What is your 2nd language", answer));
  }
  //Ethnicity
  answer = $("input[name='ethnicity']").val();
  // checkResponse(answer)
  responses.push(new QuestionResponse("What country do you call home", answer));
  answer = $("select option:selected").val();
  // checkResponse(answer)
  responses.push(new QuestionResponse("How Frequently do you brainstorm", answer));
  
  // activity/interface feedback
  answer = $("#activityLikeSurvey").val();
  responses.push(new QuestionResponse("Is there anything about the activity that you found particularly challenging", answer));
  answer = $("#intLikeSurvey").val();
  responses.push(new QuestionResponse("Is there anything about the brainstorming interface that you liked", answer));
  answer = $("#intDislikeSurvey").val();
  responses.push(new QuestionResponse("Is there anything about the brainstorming interface that you didn't like", answer));
  var part = Session.get("currentParticipant");
  return new SurveyResponse(responses, part);
}

getTreatmentResponse = function() {
  var responses = [];
  //Gender
  var answer = $("input[name='gender']:checked").val();
  // checkResponse(answer)
  responses.push(new QuestionResponse("Gender", answer));
        
  //Age
  answer = $("input[name='age']").val();
  // checkResponse(answer)
  responses.push(new QuestionResponse("Age", answer));
  //English 1st language
  answer = $("input[name='lang1']:checked").val();
  // checkResponse(answer)
  responses.push(new QuestionResponse("Is English your first language", answer));
  var lang1 = answer;
  var lang2 = "false";
  //2nd language yes/no
  if (lang1 == "true") {
    answer = $("input[name='lang2']:checked").val();
    // checkResponse(answer)
    responses.push(new QuestionResponse("Do you speak a 2nd language", answer));
    lang2 = answer;

  }
  //2nd language
  if (lang1 == "false" || lang2 == "true") {
    answer = $("input[name='lang2text']").val();
    // checkResponse(answer)
    responses.push(new QuestionResponse("What is your 2nd language", answer));
  }
  //Ethnicity
  answer = $("input[name='ethnicity']").val();
  // checkResponse(answer)
  responses.push(new QuestionResponse("What country do you call home", answer));
  //brainstorming
  answer = $("select option:selected").val();
  // checkResponse(answer)
  responses.push(new QuestionResponse("How Frequently do you brainstorm", answer));
  
  // inspirations
  answer = $("input[name='inspirationHelpful']:checked").val();
  // checkResponse(answer)
  responses.push(new QuestionResponse("Did you find any of the suggested inspirations helpful", answer));
  answer = $("#inspirationExplainSurvey").val();
  // checkResponse(answer)
  responses.push(new QuestionResponse("Briefly explain why inspiration (not) helpful", answer));
  
  // activity/interface feedback
  answer = $("#activityLikeSurvey").val();
  responses.push(new QuestionResponse("Is there anything about the activity that you found particularly challenging", answer));
  answer = $("#intLikeSurvey").val();
  responses.push(new QuestionResponse("Is there anything about the brainstorming interface that you liked", answer));
  answer = $("#intDislikeSurvey").val();
  responses.push(new QuestionResponse("Is there anything about the brainstorming interface that you didn't like", answer));
  var part = Session.get("currentParticipant");
  return new SurveyResponse(responses, part);
}