(function(){Template.SurveyPage.rendered = function() {
    $("#ss-submit").click(function() {
        console.log("form submitted");
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
    //Scroll to top
    window.scrollTo(0,0);
};

checkResponse = function(answer) {
  if (!answer) {
    throw "Incomplete survey error";
  }
}

getResponse = function() {
  var responses = [];
  //Gender
  var answer = $("input[name='gender']:checked").val();
  checkResponse(answer)
  responses.push(new QuestionResponse("Gender", answer));
        
  //Age
  answer = $("input[name='age']").val();
  checkResponse(answer)
  responses.push(new QuestionResponse("Age", answer));
  //English 1st language
  answer = $("input[name='lang1']:checked").val();
  checkResponse(answer)
  responses.push(new QuestionResponse("Is English your first language", answer));
  var lang1 = answer;
  var lang2 = "false";
  //2nd language yes/no
  if (lang1 == "true") {
    answer = $("input[name='lang2']:checked").val();
    checkResponse(answer)
    responses.push(new QuestionResponse("Do you speak a 2nd language", answer));
    lang2 = answer;

  }
  //2nd language
  if (lang1 == "false" || lang2 == "true") {
    answer = $("input[name='lang2text']").val();
    checkResponse(answer)
    responses.push(new QuestionResponse("What is your 2nd language", answer));
  }
  //Ethnicity
  answer = $("input[name='ethnicity']").val();
  checkResponse(answer)
  responses.push(new QuestionResponse("What country do you call home", answer));
  //ipod/mp3
  answer = $("input[name='ipod']:checked").val();
  checkResponse(answer)
  responses.push(new QuestionResponse("Have you ever owned an ipod/mp3 player", answer));
  //smartphone
  answer = $("input[name='smartphone']:checked").val();
  checkResponse(answer)
  responses.push(new QuestionResponse("Have you ever owned a smartphone", answer));
  //brainstorming
  answer = $("select option:selected").val();
  checkResponse(answer)
  responses.push(new QuestionResponse("How Frequently do you brainstorm", answer));
  answer = $("input[name='ideaRecall']:checked").val();
  checkResponse(answer)
  responses.push(new QuestionResponse("Did you find any of the suggested ideas helpful", answer));
  answer = $("#exampleIdeaSurvey").val();
  checkResponse(answer)
  responses.push(new QuestionResponse("What was one of the example ideas given", answer));
  answer = $("#activityLikeSurvey").val();
  responses.push(new QuestionResponse("Is there anything about the activity that you found particularly challenging", answer));
  answer = $("#intLikeSurvey").val();
  responses.push(new QuestionResponse("Is there anything about the brainstorming interface that you liked", answer));
  answer = $("#intDislikeSurvey").val();
  responses.push(new QuestionResponse("Is there anything about the brainstorming interface that you didn't like", answer));
  var part = Session.get("currentParticipant");
  return new SurveyResponse(responses, part);
}

Template.SurveyPage.events({
	/*'click input#ss-submit': function(){
		console.log("hit");
		var elem = $('#nextpage');
		elem.prop('disabled', false);
	},*/

	'click button.submitForm' : function(){
    try {
      var resp = getResponse();
      resp._id = SurveyResponses.insert(resp);
      var part = Session.get("currentParticipant");
      EventLogger.logSubmittedSurvey(part, resp);
      //Mark participant as finished
      Participants.update({_id: part._id},
          {$set: {hasFinished: true}});
      //console.log("formsubmitted");
      Router.goToNextPage("SurveyPage");
    } catch (err) {
      console.log(err);
      alert("Please complete all questions in the survey before continuing");
    }

	}
})

})();
