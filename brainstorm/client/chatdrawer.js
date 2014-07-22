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
		console.log(Notifications.find({$or: [{sender: currUser._id}, {recipient: currUser._id}]}).fetch())
		return Notifications.find({$or: [{sender: currUser._id}, {recipient: currUser._id}]});
	},
	username: function(){
		return MyUsers.findOne({_id: this.sender}).name;
	},

	isSender : function(){
		return (this.sender === Session.get("currentUser")._id);
	}
});

Template.chatdrawer.events({
	'click #chat-handle' : function(){
		console.log("moving");
		if($('#chat-handle').hasClass('moved')){
			$('#chat-handle').removeClass('moved');
		} else {
			$('#chat-handle').addClass('moved');
		}
	},
	'click #sendchat' : function(){
		var message = $("#chatinput").val()
		if(message === "")
			return false;
		$("#chatinput").val("");
		//chatNotify(Session.get("currentUser")._id, "syn", message);

		MyUsers.find({_id: {$ne: Session.get("currentUser")._id}, type: {$ne: "admin"}}).forEach(function(user){
			console.log(user)
			chatNotify(Session.get("currentUser")._id, user._id, message);
		});
	}
});