(function(){
Template.__checkName("HcompFilterbox");
Template["HcompFilterbox"] = new Template("Template.HcompFilterbox", (function() {
  var view = this;
  return HTML.DIV({
    "class": "Hcomp-filterbox-container"
  }, HTML.Raw('\n		<!-- <i class="fa fa-filter"></i> -->\n		'), Spacebars.include(view.lookupTemplate("HcompFilterBoxHeader")), "\n\n		", HTML.DIV({
    "class": "idea-box-header"
  }, "\n		  ", HTML.SPAN("\n		    ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("numIdeas"));
  }), " Ideas\n		  "), "\n		"), "\n		", HTML.DIV({
    "class": "ideadeck-container"
  }, "\n			", HTML.UL({
    id: "hcomp-idealist",
    "class": "ideadeck ui-sortable"
  }, "\n				", HTML.Raw('<li class="sort-disabled"></li>'), "\n					", Blaze.Each(function() {
    return Spacebars.call(view.lookup("ideas"));
  }, function() {
    return [ "\n						", Spacebars.include(view.lookupTemplate("HcompFilterBoxIdeaItem")), "\n					" ];
  }), "\n			"), "\n		"), "\n	");
}));

Template.__checkName("HcompFilterBoxHeader");
Template["HcompFilterBoxHeader"] = new Template("Template.HcompFilterBoxHeader", (function() {
  var view = this;
  return HTML.Raw('<div id="filterbox-header">\n	    <label>Show: </label>\n		<div class="btn-group filter-buttons">\n			<button type="button" class="btn btn-default all-ideas-filter-btn btn-success">Everything</button>\n			<button type="button" class="btn btn-default misc-ideas-filter-btn">Un-categorized</button>\n			<button type="button" class="btn btn-default starred-ideas-filter-btn">Liked</button>\n		</div>\n		<br>\n	    <div class="input-group input-group-sm idea-search">\n	      <span class="input-group-btn">\n	        <button class="btn btn-default search-apply-btn" type="button">\n	        	<i class="fa fa-search"></i>\n	        </button>\n	      </span>\n	      <input type="text" id="search-query" class="form-control" placeholder="Search...">\n	      <span class="input-group-btn">\n	        <button class="btn btn-default search-remove-btn" type="button">\n	        	<i class="fa fa-times"></i>\n	        </button>\n	      </span>\n	    </div> <!--close search bar input group-->	\n	</div> <!--close filterbox header-->');
}));

Template.__checkName("HcompFilterBoxIdeaItem");
Template["HcompFilterBoxIdeaItem"] = new Template("Template.HcompFilterBoxIdeaItem", (function() {
  var view = this;
  return HTML.LI({
    id: function() {
      return Spacebars.mustache(view.lookup("_id"));
    },
    "class": "idea-item"
  }, HTML.Raw('\n<!-- <i class="sort-disabled fa fa-lg {{#if gameChangerStatus}} fa-star {{else}} fa-star-o {{/if}} gamechangestar"></i> -->\n  '), Blaze.View(function() {
    return Spacebars.mustache(view.lookup("content"));
  }), " \n  ", HTML.SPAN({
    "class": "vote-box"
  }, " \n    ", HTML.Raw('<span class="up-vote vote glyphicon glyphicon-thumbs-up"></span>'), "\n    ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("voteNum"));
  }), "\n  "), "\n");
}));

Template.__checkName("HcompActivefilters");
Template["HcompActivefilters"] = new Template("Template.HcompActivefilters", (function() {
  var view = this;
  return HTML.DIV({
    "class": "active-filters"
  }, "\n	", Blaze.Each(function() {
    return Spacebars.call(view.lookup("getMappedFilters"));
  }, function() {
    return [ "\n		", Blaze.If(function() {
      return Spacebars.call(view.lookup("users"));
    }, function() {
      return [ "\n			", Blaze.Each(function() {
        return Spacebars.call(view.lookup("users"));
      }, function() {
        return [ "\n				", HTML.SPAN({
          "class": "partfilter-label filter-label label-success",
          id: function() {
            return Spacebars.mustache(Spacebars.dot(view.lookup("."), "_id"));
          }
        }, "\n					", HTML.I({
          "class": "fa fa-times-circle cancel-filter cancel-user"
        }), "\n					", Blaze.View(function() {
          return Spacebars.mustache(Spacebars.dot(view.lookup("."), "name"));
        }), "\n				"), "\n				", HTML.Comment(" <br> "), "\n			" ];
      }), "\n		" ];
    }), "\n		", Blaze.If(function() {
      return Spacebars.call(view.lookup("inClusterFilter"));
    }, function() {
      return [ "\n			", HTML.SPAN({
        "class": "themedfilter-label filter-label label-default"
      }, "\n				", HTML.I({
        "class": "fa fa-times-circle cancel-filter cancel-themed"
      }), "\n				", Blaze.If(function() {
        return Spacebars.call(view.lookup("inCluster"));
      }, function() {
        return " In Themes ";
      }, function() {
        return " Not in Themes ";
      }), "\n			"), "\n			", HTML.Comment(" <br> "), "\n		" ];
    }), "\n		", Blaze.If(function() {
      return Spacebars.call(view.lookup("clusters"));
    }, function() {
      return [ "\n			", Blaze.Each(function() {
        return Spacebars.call(view.lookup("clusters"));
      }, function() {
        return [ "\n				", HTML.SPAN({
          "class": "partfilter-label filter-label label-primary",
          id: function() {
            return Spacebars.mustache(Spacebars.dot(view.lookup("."), "_id"));
          }
        }, "\n					", HTML.I({
          "class": "fa fa-times-circle cancel-filter cancel-cluster"
        }), "\n					", Blaze.View(function() {
          return Spacebars.mustache(Spacebars.dot(view.lookup("."), "name"));
        }), "\n				"), "\n				", HTML.Comment(" <br> "), "\n			" ];
      }), "\n		" ];
    }), "\n		", Blaze.If(function() {
      return Spacebars.call(view.lookup("time"));
    }, function() {
      return [ "\n			", HTML.SPAN({
        "class": "timefilter-label filter-label label-warning",
        style: "display: inline-block"
      }, "\n				", HTML.I({
        "class": "fa fa-times-circle cancel-filter cancel-time"
      }), "\n				 ", Blaze.View(function() {
        return Spacebars.mustache(view.lookup("end"));
      }), " to ", Blaze.View(function() {
        return Spacebars.mustache(view.lookup("begin"));
      }), "\n			"), "\n			", HTML.Comment(" <br> "), "\n		" ];
    }), "\n	" ];
  }), "\n	", Blaze.If(function() {
    return Spacebars.call(view.lookup("isFilter"));
  }, function() {
    return [ "\n		", HTML.DIV({
      "class": "filter-reset"
    }, "\n			", HTML.BUTTON({
      href: "#",
      "class": "reset-filters btn btn-info btn-xs filter-reset"
    }, "Reset all filters"), "\n		"), "\n	" ];
  }), "\n	");
}));

})();
