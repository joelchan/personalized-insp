Template.SurveyPage.events({
	/*'click input#ss-submit': function(){
		console.log("hit");
		var elem = $('#nextpage');
		elem.prop('disabled', false);
	},*/

	'click button.nextPage' : function(){
		var currentPrompt = Session.get("currentPrompt");
		Router.go('FinalizePage', {'_id': currentPrompt._id});
	}
})