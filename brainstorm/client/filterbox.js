Template.filterbox.rendered = function(){
	// FilterFactory.create("Syn Idea List Filter", Session.get("currentUser"), "ideas");
}

Template.filterbox.helpers({
	participants : function(){
		return MyUsers.find({type: "Experiment Participant"});
	},
	ideas : function(){
		return IdeasToProcess.find();
	},
	clusters: function(){
		return Clusters.find({_id: {$ne: "-1"}});
	}
});

Template.filterbox.events({

	'click #select-part-filters > div.apply-filter > button.apply' :function(){
		var options = $('#select-participants option:selected');

		var ids = $.map(options ,function(option) {
		    var id = $(option).attr("val");
			id = id.split("-")[1];
			FilterFactory.create("Ideas Filter", Session.get("currentUser"), "ideas", "userID", id);
		    return id;
		});

	},

	'click #select-themed-filters > div.apply-filter > button.apply' :function(){
		var checkboxes = $("input:checkbox[name=themecheck]:checked");
		var checked = $.map(checkboxes, function(checkbox){
			return $(checkbox).attr("value");
		});

		if(checked.length === 1) {
			FilterFactory.create("Ideas Filter", Session.get("currentUser"), "ideas", "inCluster", checked[0]);
		} else if(checked.length === 2) {
			FilterFactory.remove("Ideas Filter", Session.get("currentUser"), "ideas", "inCluster");
		}
	},

	'click #select-time-filters > div.apply-filter > button.apply' :function(){
		
	},

	'click .filter-drop-button' :function(){
		var id = $(event.target).attr('id');
		id = 'select-' +id;
		$('.filter-dropdown').each(function(i){
			if($(this).attr('id') === id){
				$('#' + id).slideDown();
			} else {
				$('#' + $(this).attr('id')).slideUp();
			}
		});
	},

	'click .filter-dropdown > div.apply-filter > button' : function(){
		$(event.target).parents('.filter-dropdown').slideUp();
	},


	'click #gamechange-filter' : function(){
		var $icon = $('#gamechange-filter').children('i');

		if($icon.hasClass('fa-star-o')){
			$icon.switchClass('fa-star-o', 'fa-star');
			FilterFactory.create("Gamechanging Ideas", Session.get("currentUser"), "ideas", "isGamchanger", true);
		} else if($icon.hasClass('fa-star')){
			FilterFactory.create("Gamechanging Ideas", Session.get("currentUser"), "ideas", "isGamchanger", true);
			FilterFactory.create("Gamechanging Ideas", Session.get("currentUser"), "ideas", "isGamchanger", false);
			$icon.switchClass('fa-star', 'fa-star-o');
		}
		
	},
});