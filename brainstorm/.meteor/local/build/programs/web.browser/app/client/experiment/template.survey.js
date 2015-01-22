(function(){
Template.__checkName("SurveyPage");
Template["SurveyPage"] = new Template("Template.SurveyPage", (function() {
  var view = this;
  return HTML.DIV({
    "class": "container"
  }, HTML.Raw('\n  <div class="directions">\n    <h2>Directions:</h2>\n    <p>Please complete the following survey questions</p>\n  </div>\n  '), HTML.FORM({
    "class": "surveyForm"
  }, "\n    ", HTML.Raw('<div class="row formQuestion">\n      <div class="question">Gender:*</div><br>\n      <input type="radio" class="radioButton" name="gender" value="male">Male<br>\n      <input type="radio" class="radioButton" name="gender" value="female">Female\n    </div>'), "\n    ", HTML.Raw('<div class="row formQuestion">\n      <div class="question">Age: *</div><br>\n      <input type="number" class="surveyNumBox" name="age" min="1" max="200" step="1" value="18">\n    </div>'), "\n    ", HTML.Raw('<div class="row formQuestion">\n      <div class="question">Is English your first language?: *</div><br>\n      <input type="radio" class="radioButton" name="lang1" value="true">Yes<br>\n      <input type="radio" class="radioButton" name="lang1" value="false">No\n    </div>'), "\n    ", HTML.Raw('<div id="lang2Question" class="row formQuestion hidden">\n      <div class="question">Do you speak a second language?: *</div><br>\n      <input type="radio" class="radioButton" name="lang2" value="true">Yes<br>\n      <input type="radio" class="radioButton" name="lang2" value="false">No\n    </div>'), "\n    ", HTML.Raw('<div id="lang2Text" class="row formQuestion hidden">\n      <div class="question">List another language in which you are fluent(besides English): *</div><br>\n      <input type="text" class="shortText" name="lang2text">\n    </div>'), "\n    ", HTML.Raw('<div class="row formQuestion">\n      <div class="question">What country do you call home?: *</div><br>\n      <input type="text" class="shortText" name="ethnicity">\n    </div>'), "\n    ", HTML.Raw('<div class="row formQuestion">\n      <div class="question">Do you currently or have you ever owned either an ipod or an mp3 player of any sort?: *</div><br>\n      <input type="radio" class="radioButton" name="ipod" value="true">Yes<br>\n      <input type="radio" class="radioButton" name="ipod" value="false">No\n    </div>'), "\n    ", HTML.Raw('<div class="row formQuestion">\n      <div class="question">Do you currently or have you ever owned a smartphone?: *</div><br>\n      <input type="radio" class="radioButton" name="smartphone" value="true">Yes<br>\n      <input type="radio" class="radioButton" name="smartphone" value="false">No\n    </div>'), "\n    ", HTML.Raw('<div class="row formQuestion">\n      <div class="question">How often do you do brainstorming-type activities at your work?: *</div><br>\n      <select id="brainstorming">\n        <option value="5">Very Frequently</option>\n        <option value="4">Frequently</option>\n        <option value="3">Occasionally</option>\n        <option value="2">Rarely</option>\n        <option value="1">Never</option>\n      </select>\n    </div>'), "\n    ", HTML.Raw('<div class="row formQuestion">\n      <div class="question">Did you find any of the suggested ideas helpful?: *</div><br>\n      <input type="radio" class="radioButton" name="ideaRecall" value="true">Yes<br>\n      <input type="radio" class="radioButton" name="ideaRecall" value="false">No\n    </div>'), "\n    ", HTML.DIV({
    "class": "row formQuestion"
  }, "\n      ", HTML.Raw('<div class="question">What was one of the example ideas given?:*</div>'), HTML.Raw("<br>"), "\n      ", HTML.TEXTAREA({
    id: "exampleIdeaSurvey",
    "class": "survey-textbox"
  }), "\n    "), "\n    ", HTML.DIV({
    "class": "row formQuestion"
  }, "\n      ", HTML.Raw('<div class="question">Is there anything about the activity that you found particularly challenging?:</div>'), HTML.Raw("<br>"), "\n      ", HTML.TEXTAREA({
    id: "activityLikeSurvey",
    "class": "survey-textbox"
  }), "\n    "), "\n    ", HTML.DIV({
    "class": "row formQuestion"
  }, "\n      ", HTML.Raw('<div class="question">Is there anything about the brainstorming interface that you liked?:</div>'), HTML.Raw("<br>"), "\n      ", HTML.TEXTAREA({
    id: "intLikeSurvey",
    "class": "survey-textbox"
  }), "\n    "), "\n    ", HTML.DIV({
    "class": "row formQuestion"
  }, "\n      ", HTML.Raw('<div class="question">Is there anything about the brainstorming interface that you didn\'t like?:</div>'), HTML.Raw("<br>"), "\n      ", HTML.TEXTAREA({
    id: "intDislikeSurvey",
    "class": "survey-textbox"
  }), "\n    "), "\n  "), HTML.Raw('\n\n    <button id="submit" class="submitForm btn-xlarge2 btn-default btn-primary">\n     Submit \n    </button>\n'));
}));

Template.__checkName("IdeationSurvey");
Template["IdeationSurvey"] = new Template("Template.IdeationSurvey", (function() {
  var view = this;
  return HTML.Raw('<div class="container">\n    <iframe src="https://docs.google.com/forms/d/17oUbtN0acd-QEasNkW2crWyyIq3kEI7AGbNbXD6tfIA/viewform?embedded=true" width="760" height="500" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>\n  </div>');
}));

Template.__checkName("SynthesisSurvey");
Template["SynthesisSurvey"] = new Template("Template.SynthesisSurvey", (function() {
  var view = this;
  return HTML.Raw('<div class="container">\n    <iframe src="https://docs.google.com/forms/d/1bYMyIpACIYFGCRBV05euMnCIkb0sropz116JPT3yMvY/viewform?embedded=true" width="760" height="500" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>>\n  </div>');
}));

Template.__checkName("FacilitatorSurvey");
Template["FacilitatorSurvey"] = new Template("Template.FacilitatorSurvey", (function() {
  var view = this;
  return HTML.Raw('<div class="container">\n    <iframe src="https://docs.google.com/forms/d/1q1fYe8LqF2Fn0V2X3DMvKmj8uKDcIdaxYG_yZ7Ibec0/viewform?embedded=true" width="760" height="500" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>\n  </div>');
}));

})();
