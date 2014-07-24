Template.filterbox.rendered = function(){
	// FilterFactory.create("Syn Idea List Filter", Session.get("currentUser"), "ideas");
}

Template.filterbox.helpers({
	participants : function(){
		return MyUsers.find({type: "Experiment Participant"});
	},
	// clusters: function(){
	// 	return Clusters.find({_id: {$ne: "-1"}});
	// }
});

Template.filterbox.events({
	'click #parts-filter' : function(){
		$('#select-part-filters').slideToggle();
	},

	'click #select-part-filters > div.apply-filter > button.apply' :function(){
		var options = $('#select-participants option:selected');

		var ids = $.map(options ,function(option) {
		    var id = $(option).attr("val");
			id = id.split("-")[1];
		    return id;
		});
		console.log(ids);
		// var filter = Session.get("currentFilter");
		// FilterFactory.addInListFilter(filter, 'userID', ids);
		// Session.set("currentFilter", filter);
	},

	'click #themed-filter' : function(){
		$('#select-themed-filters').slideToggle();
	},

	'click #select-themed-filters > div.apply-filter > button.apply' :function(){
		var checkboxes = $("input:checkbox[name=themecheck]:checked");
		var checked = $.map(checkboxes, function(checkbox){
			console.l
			return $(checkbox).attr("value");
		});

		console.log(checked);
		// var filter = Session.get("currentFilter");
		// console.log(filter.filter);
		// FilterFactory.addInListFilter(filter, 'inCluster', checked);
		// Session.set("currentFilter", filter);
	},

	'click #time-filter' : function(){
		$('#select-time-filters').slideToggle();
	},

	'click #select-time-filters > div.apply-filter > button.apply' :function(){
		
	},

	'click .filter-dropdown > div.apply-filter > button' :function(){
		$('#select-part-filters').slideUp();
		$('#select-themed-filters').slideUp();
		$('#select-time-filters').slideUp();
	},


	'click #gamechange-filter' : function(){
		var $icon = $('#gamechange-filter').children('i');

		if($icon.hasClass('fa-star-o'))
			$icon.switchClass('fa-star-o', 'fa-star');
		else if($icon.hasClass('fa-star'))
			$icon.switchClass('fa-star', 'fa-star-o');
		//console.log($icon);
	},
});