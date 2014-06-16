Template.SurveyPage.rendered = function() {
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
  console.log(answer);
  //English 1st language
  answer = $("input[name='lang1']:checked").val();
  checkResponse(answer)
  responses.push(new QuestionResponse("Is English your first language", answer));
  console.log(answer);
  var lang1 = answer;
  var lang2 = "false";
  //2nd language yes/no
  if (lang1 == "true") {
    answer = $("input[name='lang2']:checked").val();
    checkResponse(answer)
    responses.push(new QuestionResponse("Do you speak a 2nd language", answer));
    console.log(answer);
    lang2 = answer;

  }
  //2nd language
  if (lang1 == "false" || lang2 == "true") {
    answer = $("input[name='lang2text']").val();
    checkResponse(answer)
    responses.push(new QuestionResponse("What is your 2nd language", answer));
    console.log(answer);
  }
  //Ethnicity
  answer = $("input[name='ethnicity']").val();
  checkResponse(answer)
  responses.push(new QuestionResponse("What country do you call home", answer));
  console.log(answer);
  //ipod/mp3
  answer = $("input[name='ipod']:checked").val();
  checkResponse(answer)
  responses.push(new QuestionResponse("Have you ever owned an ipod/mp3 player", answer));
  console.log(answer);
  //smartphone
  answer = $("input[name='smartphone']:checked").val();
  checkResponse(answer)
  responses.push(new QuestionResponse("Have you ever owned a smartphone", answer));
  console.log(answer);
  //brainstorming
  answer = $("select option:selected").val();
  checkResponse(answer)
  responses.push(new QuestionResponse("How Frequently do you brainstorm", answer));
  console.log(answer);
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
      logSubmittedSurvey(Session.get("currentParticipant"), resp);
      console.log("formsubmitted");
      Router.goToNextPage("SurveyPage");
    } catch (err) {
      console.log(err);
      alert("Please complete all questions in the survey before continuing");
    }

	}
})
