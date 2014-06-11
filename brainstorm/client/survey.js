Template.SurveyPage.rendered = function() {
    $("#ss-submit").click(function() {
        console.log("form submitted");
    });
};

Template.SurveyPage.events({
	/*'click input#ss-submit': function(){
		console.log("hit");
		var elem = $('#nextpage');
		elem.prop('disabled', false);
	},*/

	'click button.nextPage' : function(){
    Router.goToNextPage("SurveyPage");
	}
})
