Template.filterbox.rendered = function(){
	// FilterFactory.create("Syn Idea List Filter", Session.get("currentUser"), "ideas");
}

Template.filterbox.helpers({
	participants : function(){
		return MyUsers.find({type: "Experiment Participant"});
	},
	ideas : function(){
		return IdeaFilter.query.getResults();
	},
	clusters: function(){
		return Clusters.find({_id: {$ne: "-1"}});
	}
});

Template.filterbox.events({
	// 'click #parts-filter' : function(){
	// 	$('#select-part-filters').slideToggle();
	// },

	'click #select-part-filters > div.apply-filter > button.apply' :function(){
		var options = $('#select-participants option:selected');

		var ids = $.map(options ,function(option) {
		    var id = $(option).attr("val");
			id = id.split("-")[1];
		    return id;
		});
		// console.log(ids);
		// IdeaFilter.sort.set('time', 'asc', true);
		IdeaFilter.filter.set('userID', {value: ids, operator: ['$in']}, true);
		// var filter = Session.get("currentFilter");
		// FilterFactory.addInListFilter(filter, 'userID', ids);
		// Session.set("currentFilter", filter);
	},

	// 'click #themed-filter' : function(){
	// 	$('#select-themed-filters').slideToggle();
	// },

	// 'click #memberOf-filter' : function(){
	// 	$('#select-memberOf-filters').slideToggle();
	// },

	'click #select-themed-filters > div.apply-filter > button.apply' :function(){
		var checkboxes = $("input:checkbox[name=themecheck]:checked");
		var checked = $.map(checkboxes, function(checkbox){
			console.l
			return $(checkbox).attr("value");
		});

		console.log(checked);
		if(checked.length < 1){
			IdeaFilter.filter.get().inCluster.active = false;
			console.log("IdeaFilter: ");
			console.log(IdeaFilter);
		} else
			IdeaFilter.filter.set('inCluster', {value: checked[0], operator: ['$in']}, true);

	},

	// 'click #time-filter' : function(){
	// 	$('#select-time-filters').slideDown();
	// },

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
			IdeaFilter.filter.set('isGamechanger', {value: true}, true)
		} else if($icon.hasClass('fa-star')){
			$icon.switchClass('fa-star', 'fa-star-o');
		}
		//console.log($icon);
	},
});