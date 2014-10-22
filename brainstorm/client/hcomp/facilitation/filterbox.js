Template.filterbox.rendered = function(){
	//Create isInCluster filter
	// console.log("rendering");
}
var filterName;
Template.filterbox.helpers({
	setFilterName : function(name){
		filterName = name + "IdeasFilter";
		console.log(filterName);
		//doesn't work
	},
	participants : function(){
		// return MyUsers.find({type: "Experiment Participant"});
		return MyUsers.find({type: "Ideator"});
		// return MyUsers.find({_id: 
		// 	{$in: getIDs(Session.get("currentIdeators"))}
		// });
	},
	ideas : function(){
		// return Ideas.find();
		// var cursor = FilterManager.performQuery("Ideas Filter", Session.get("currentUser"),"ideas");
		var filteredIdeas = FilterManager.performQuery("Ideas Filter", 
		  Session.get("currentUser"), 	
		  "ideas").fetch();
		// return filteredIdeas;
		// var filteredIdeas = FilterManager.performQuery("Ideas Filter", Session.get("currentUser"),"ideas").fetch();
		// sort the array
		var sortedIdeas = filteredIdeas.sort(function(a,b) { return b.time - a.time});
		// return the sorted array
		// console.log("FilterBoxHelper says there are " + filteredIdeas.count() + " ideas");
		return sortedIdeas;
		// return cursor;
	},
	currentClusters: function(){
		return Clusters.find({_id: {$ne: "-1"}});
	},
});

Template.FilterBoxIdeaItem.helpers({
	gameChangerStatus: function() {
		return this.isGamechanger;
	}
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
		// console.log(this);
		// console.log("Active filters for clusters: " + this.clusterIDs);
		// return this._id;
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
			    selectedVal = $.parseJSON(selected.val());
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

		var startDur= parseInt($menu.find("select.select-start option:selected").text());
		var endDur= parseInt($menu.find("select.select-end option:selected").text());
		console.log("startDur: " + startDur);
		console.log("endDur: " + endDur);
		// var start = moment(Date.now()).subtract('minutes', startDur)._d;
		// var end = moment(Date.now()).subtract('minutes', endDur)._d;
		var start = moment(Date.now()).subtract('minutes', startDur).valueOf();
		var end = moment(Date.now()).subtract('minutes', endDur).valueOf();
		console.log("start: " + start);
		console.log("end: " + end);
		// console.log(start.unix());
		FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", 'time', start, 'lt');
		FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", 'time', end, 'gt');
	},


	'click .gamechange-filter' : function(){
		var $icon = $('.gamechange-filter').children('i');
		FilterManager.remove("Ideas Filter", Session.get("currentUser"), "ideas", "isGamechanger");		

		if($icon.hasClass('fa-star-o')){
			$icon.switchClass('fa-star-o', 'fa-star');
			FilterManager.create("Ideas Filter", Session.get("currentUser"), "ideas", "isGamechanger", true);
		} else if($icon.hasClass('fa-star')){
			$icon.switchClass('fa-star', 'fa-star-o');
		}
	},

	'mouseover .idea-item' : function(){
		var id = $(event.target).attr("id");
		// id = id.split("-")[1];
		var thisIdea = Ideas.findOne({_id: id});
		var thisIdeaAuthor = thisIdea.userName;
		if (thisIdea.clusterIDs.length > 0) {
			var thisIdeaTheme = Clusters.findOne({_id: thisIdea.clusterIDs[0]}).name;	
		} else {
			var thisIdeaTheme = "Not in a theme";
		}
		
		$('<span class="idea-tip"></span>')
			.appendTo('body')
			.css('top', (event.pageY- 10) + 'px')
			.css('left', (event.pageX + 20) + 'px')
			.fadeIn('slow');
		$('<span></span>').text("Author: " + thisIdeaAuthor)
			.appendTo('.idea-tip');
		$('<br>')
			.appendTo('.idea-tip');
		$('<span></span>').text("Theme: " + thisIdeaTheme)
			.appendTo('.idea-tip');
	},

	'mouseout .idea-item' : function(){
		$('.idea-tip').remove();
	},

	'mousemove .idea-item' : function(){
		$('.idea-tip')
		.css('top', (event.pageY - 10) + 'px')
		.css('left', (event.pageX + 20) + 'px');
	},
});

Template.activefilters.events({
	'click .reset-filters' : function(){
		//console.log("resetting filters");
		FilterManager.reset("Ideas Filter", Session.get("currentUser"), "ideas", Session.get("groupIdeasFilter"));
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
