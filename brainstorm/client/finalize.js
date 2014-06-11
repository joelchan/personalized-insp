
Template.FinalizePage.code = function(){
	var myUser = Session.get("currentUser");
	return myUser.verifyCode;
}
