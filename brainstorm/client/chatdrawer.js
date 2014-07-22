var messageAlertInterval;
var messageWaiting = false;

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

  
  Notifications.find({recipient: Session.get("currentUser")._id}).observe({
  	added: function(message){
  		Meteor.clearInterval(messageAlertInterval);

  		if($('#chat-handle').hasClass('moved')){
  			messageViewScrollTo();
  			return false;
  		}
  		messageAlertInterval = Meteor.setInterval(function(){
  			$('#chat-handle').toggleClass('flash');
  		}, 750);
  	}
  });

  Meteor.clearInterval(messageAlertInterval);
}

Template.chatdrawer.helpers({
	messages: function(){
		var currUser = Session.get("currentUser");
		//console.log(Notifications.find({$or: [{sender: currUser._id}, {recipient: currUser._id}]}).fetch())
		return Notifications.find({$or: [{sender: currUser._id}, {recipient: currUser._id}]});
	},
	username: function(){
		return MyUsers.findOne({_id: this.sender}).name;
	},

	isSender : function(){
		return (this.sender === Session.get("currentUser")._id);
	}
});

messageViewScrollTo =function(){
	$('#messageview').scrollTop($('#messageview')[0].scrollHeight);
	console.log("scrolled");
}

Template.chatdrawer.events({
	'click #messageicon' : function(){
		console.log("moving");
		if($('#chat-handle').hasClass('moved')){
			$('#chat-handle').removeClass('moved');
		} else {
			$('#chat-handle').addClass('moved');
		}

		Meteor.clearInterval(messageAlertInterval);
		$('#chat-handle').removeClass('alert');

		messageViewScrollTo();
	},
	'click #sendchat' : function(){
		var message = $("#chatinput").val()
		if(message === "")
			return false;
		$("#chatinput").val("");
		//chatNotify(Session.get("currentUser")._id, "syn", message);

		MyUsers.find({_id: {$ne: Session.get("currentUser")._id}, type: {$in: ["anonDBUser", "anonSynUser"]}}).forEach(function(user){
			console.log(user)
			chatNotify(Session.get("currentUser")._id, user._id, message);
		});

		messageViewScrollTo();
		//$('#messageview').scrollTop($('#messageview')[0].scrollHeight);
	}
});