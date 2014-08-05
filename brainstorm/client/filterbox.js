Template.filterbox.rendered = function(){

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
		// return Ideas.find();
		var cursor = FilterManager.performQuery("Ideas Filter", Session.get("currentUser"),"ideas");
		console.log("FilterBoxHelper" + cursor.count());
		return cursor;
	},
	currentClusters: function(){
		return Clusters.find({_id: {$ne: "-1"}});
	},
});

Template.activefilters.helpers({
	getMappedFilters : function(){
		var mappedFilts = FilterManager.createMappedFilterList("Ideas Filter", Session.get("currentUser"), "ideas", "mappedFilters");
		mappedFilts = $.map(mappedFilts, function(val, key){
			var obj = {};
			obj[key] = val;
			return obj;
		});
		//console.log(mappedFilts);
		return mappedFilts;
	},

	isFilter: function(){
		return (FilterManager.getFilterList("Ideas Filter", Session.get("currentUser"), "ideas").count() > 0);
	},

	users : function(){
		return this.users;
	},

	clusters: function(){
		return this.clusters;
	},

	inClusterFilter : function(){
		return this.hasOwnProperty('inCluster');
	},

	inCluster : function(){
		return $.parseJSON(this.inCluster);
	},

	time : function(){
		return this.time;
	},

	begin : function(){
		return moment(this.time.begin).fromNow();
	},
	end : function(){
		return moment(this.time.end).fromNow();
	}
});

Template.filterbox.events({

	'click .filter-drop-button' :function(){
		$('.filter-dropdown').each(function(i){
			$(this).slideUp()
		});

		console.log($(event.target));
		var $menu;
		if($(event.target).hasClass('parts-filters')){
			$menu = $('.select-parts-filters');
			if($menu.css('display') == 'none')
				$menu.slideDown();
			else
				$menu.slideUp();
		} else if($(event.target).hasClass('themed-filters')){
			$menu = $('.select-themed-filters');
			if($menu.css('display') == 'none')
				$menu.slideDown();
			else
				$menu.slideUp();
		} else if($(event.target).hasClass('memberOf-filters')){
			$menu = $('.select-memberOf-filters');
			if($menu.css('display') == 'none')
				$menu.slideDown();
			else
				$menu.slideUp();
		}  else if($(event.target).hasClass('time-filters')){
			$menu = $('.select-time-filters');
			if($menu.css('display') == 'none')
				$menu.slideDown();
			else
				$menu.slideUp();
		}
	},

	'click .filter-dropdown > div.apply-filter > button' : function(){
		$(event.target).parents('.filter-dropdown').slideUp();
	},

	'click .select-parts-filters > div.apply-filter > button.apply' :function(){
		var options = $('.select-parts-filters').find('.select-participants option:selected');
		var ids = $.map(options ,function(option) {
		    var id = $(option).attr("val");
			id = id.split("-")[1];
			FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", "userID", id);
		    return id;
		});

		console.log(ids);

	},

	'click .select-themed-filters > div.apply-filter > button.apply' :function(){
		FilterManager.remove("Ideas Filter", Session.get("currentUser"), "ideas", "inCluster");

		var selected = $(".filter-list input[type='radio']:checked");
			if (selected.length > 0) {
			    selectedVal = selected.val();
			}

		if (selectedVal !== "neither") {
			FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", "inCluster", selectedVal);
		};
	},

	'click .select-memberOf-filters > div.apply-filter > button.apply' : function(){
		var options = $('.select-themes option:selected');
		var ids = $.map(options ,function(option) {
		    var id = $(option).attr("val");
			id = id.split("-")[1];
			FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", "clusterIDs", id);
		    return id;
		});
	},

	'click .select-time-filters > div.apply-filter > button.apply' :function(){
		FilterManager.remove("Ideas Filter", Session.get("currentUser"), "ideas", 'time');

		var $menu = $(event.target).parents('.select-time-filters');

		var startDur= $menu.find("select.select-start option:selected").text();
		var endDur= $menu.find("select.select-end option:selected").text();

		var start = moment(Date.now()).subtract('minutes', startDur)._d;
		var end = moment(Date.now()).subtract('minutes', endDur)._d;
		
		FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", 'time', start, 'lt');
		FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", 'time', end, 'gt');
	},


	'click .gamechange-filter' : function(){
		var $icon = $('.gamechange-filter').children('i');
		FilterManager.remove("Ideas Filter", Session.get("currentUser"), "ideas", "isGamchanger");		

		if($icon.hasClass('fa-star-o')){
			$icon.switchClass('fa-star-o', 'fa-star');
			FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", "isGamchanger", true);
		} else if($icon.hasClass('fa-star')){
			$icon.switchClass('fa-star', 'fa-star-o');
		}
	},
});

Template.activefilters.events({
	'click .reset-filters' : function(){
		//console.log("resetting filters");
		FilterManager.reset("Ideas Filter", Session.get("currentUser"), "ideas");
	},

	'click .cancel-user': function(){
		FilterManager.remove("Ideas Filter", Session.get("currentUser"), "ideas", "userID", this._id);
	},

	'click .cancel-cluster': function(){
		FilterManager.remove("Ideas Filter", Session.get("currentUser"), "ideas", "clusterIDs", this._id);
	},

	'click .cancel-themed': function(){
		FilterManager.remove("Ideas Filter", Session.get("currentUser"), "ideas", "inCluster");
	},

	'click .cancel-time': function(){
		FilterManager.remove("Ideas Filter", Session.get("currentUser"), "ideas", "time");
	},
});