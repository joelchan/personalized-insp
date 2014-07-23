Template.filterbox.helpers({
	participants : function(){
		return MyUsers.find({type: "Experiment Participant"});
	},
	clusters: function(){
		return Clusters.find({_id: {$ne: "-1"}});
	}
});

Template.filterbox.events({
	'click #parts-filter' : function(){
		$('#select-part-filters').slideToggle();
	},

	'click #select-part-filters > div.apply-filter > button.apply' :function(){
		console.log(FilterFactory);
	},

	'click #theme-filter' : function(){
		$('#select-theme-filters').slideToggle();
	},

	'click #select-theme-filters > div.apply-filter > button.apply' :function(){
		//console.log(FilterFactory);
	},

	'click #time-filter' : function(){
		$('#select-time-filters').slideToggle();
	},

	'click #select-time-filters > div.apply-filter > button.apply' :function(){
		//console.log(FilterFactory);
	},

	'click .filter-dropdown > div.apply-filter > button' :function(){
		$('#select-part-filters').slideUp();
		$('#select-theme-filters').slideUp();
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