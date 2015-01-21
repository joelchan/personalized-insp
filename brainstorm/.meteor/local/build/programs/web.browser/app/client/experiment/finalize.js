(function(){Template.FinalizePage.rendered = function() {
  window.scrollTo(0,0);
};

Template.FinalizePage.code = function(){
	var myUser = Session.get("currentParticipant");
	return myUser.verifyCode;
};

})();
