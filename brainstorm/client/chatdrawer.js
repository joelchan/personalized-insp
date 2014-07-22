Template.chatdrawer.rendered = function(){
	$('.menu-link').bigSlide({
		'menu': ('#chat-drawer'),
		'push': ('.push'),
    	'side': 'left', 
    	'menuWidth': '25%', 
    	'speed': '300'
	});

	// Register event listenr to click submit button when enter is pressed
  $('#chatinput').keyup(function(e){
    if(e.keyCode===13) {
      //console.log("enter pressed")
      $('#sendchat').click();
    }
  });
}

Template.chatdrawer.helpers({
	messages: function(){
		var currUser = Session.get("currentUser");
		return Notifications.find({sender: currUser._id});
	},
	username: function(){
		return MyUsers.findOne({_id: this.sender}).name;
	},

	isSender : function(){
		return (this.sender === Session.get("currentUser")._id);
	}
});

Template.chatdrawer.events({
	'click #sendchat' : function(){
		var message = $("#chatinput").val()
		$("#chatinput").val("");
		console.log(message);
		chatNotify(Session.get("currentUser")._id, "syn", message);
	}
});