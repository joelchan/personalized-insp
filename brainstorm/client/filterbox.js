Template.filterbox.rendered = function(){
	// FilterFactory.create("Syn Idea List Filter", Session.get("currentUser"), "ideas");
}
var filterName;
Template.filterbox.helpers({
	setFilterName : function(name){
		filterName = name + "IdeasFilter";
		console.log(filterName);
		//doesn't work
	},
	participants : function(){
		return MyUsers.find({type: "Experiment Participant"});
	},
	ideas : function(){
		return IdeasToProcess.find();
	},
	clusters: function(){
		return Clusters.find({_id: {$ne: "-1"}});
	},

	getMappedFilters : function(){
		var mappedFilts = FilterManager.createMappedFilterList("Ideas Filter", Session.get("currentUser"), "ideas", "mappedFilters");
		mappedFilts = $.map(mappedFilts, function(val, key){
			var obj = {};
			obj[key] = val;
			return obj;
		});
		console.log(mappedFilts);
		return mappedFilts;
	}
});

Template.filterbox.events({

	'click #select-parts-filters > div.apply-filter > button.apply' :function(){
		console.log("applying participant filters");
		var options = $('#select-participants option:selected');
		var ids = $.map(options ,function(option) {
		    var id = $(option).attr("val");
			id = id.split("-")[1];
			FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", "userID", id);
		    return id;
		});

		console.log(options);

	},

	'click #select-themed-filters > div.apply-filter > button.apply' :function(){
		FilterManager.remove("Ideas Filter", Session.get("currentUser"), "ideas", "inCluster");

		var selected = $(".filter-list input[type='radio']:checked");
			if (selected.length > 0) {
			    selectedVal = selected.val();
			}

		if (selectedVal !== "neither") {
			FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", "inCluster", selectedVal);
		};
	},

	'click #select-memberOf-filters > div.apply-filter > button.apply' : function(){
		var options = $('#select-themes option:selected');
		var ids = $.map(options ,function(option) {
		    var id = $(option).attr("val");
			id = id.split("-")[1];
			FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", "clusterID", id);
		    return id;
		});
	},

	'click #select-time-filters > div.apply-filter > button.apply' :function(){
		FilterManager.remove("Ideas Filter", Session.get("currentUser"), "ideas", 'time');
		var startDur = $("#select-start option:selected").text();
		var endDur = $("#select-end option:selected").text();
		var start = moment(Date.now()).subtract('minutes', startDur)._d;
		var end = moment(Date.now()).subtract('minutes', endDur)._d;
		FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", 'time', start, 'lt');
		FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", 'time', end, 'gt');
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
		FilterManager.remove("Ideas Filter", Session.get("currentUser"), "ideas", "isGamchanger");		

		if($icon.hasClass('fa-star-o')){
			$icon.switchClass('fa-star-o', 'fa-star');
			FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", "isGamchanger", true);
		} else if($icon.hasClass('fa-star')){
			$icon.switchClass('fa-star', 'fa-star-o');
		}
	},

	'click #reset-filters' : function(){
		console.log("resetting filters");
		FilterManager.reset("Ideas Filter", Session.get("currentUser"), "ideas");
	}
});