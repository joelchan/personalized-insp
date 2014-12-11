(function(){
Template.__define__("filterbox", (function() {
  var view = this;
  return [ HTML.Raw('<div class="filterbox-container">\n		<!-- <i class="fa fa-filter"></i> -->\n		<div id="filterbox-header">\n			<label>Filter by: </label>\n			<br>\n			<span id="filter-box" class="btn-group btn-group-xs">\n				<button class="parts-filters filter-drop-button btn btn-primary">\n					User <span class="caret"></span>\n				</button>\n				<button class="memberOf-filters filter-drop-button btn btn-primary">\n					Theme <span class="caret"></span>\n				</button>\n				<!-- <button class="themed-filters filter-drop-button btn btn-primary">\n					Status <span class="caret"></span>\n				</button> -->\n				<button class="time-filters filter-drop-button btn btn-primary">\n					Time<span class="caret"></span>\n				</button>\n				<button class="gamechange-filter filter-drop-button btn btn-primary">\n					<i id="star-toggle-icon" class="fa fa-lg fa-star-o"></i>\n				</button>\n			</span>\n		</div>\n	</div>\n\n	<!--Participant Filter Dropdown-->\n	'), HTML.DIV({
    "class": "select-parts-filters filter-dropdown col-md-3"
  }, "\n		", HTML.Raw("<h5>Select Participants</h5>"), "\n		", HTML.DIV({
    "class": "filter-list"
  }, "\n			", HTML.SELECT({
    multiple: "",
    "class": "select-participants form-control"
  }, "\n				", Blaze.Each(function() {
    return Spacebars.call(view.lookup("participants"));
  }, function() {
    return [ "\n					", HTML.OPTION({
      val: function() {
        return [ "pf-", Spacebars.mustache(Spacebars.dot(view.lookup("."), "_id")) ];
      }
    }, Blaze.View(function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("."), "name"));
    })), "\n				" ];
  }), "\n			"), "\n		"), "\n		", HTML.Raw('<div class="apply-filter">\n			<button class="btn btn-default">Cancel</button>\n			<button class="btn btn-primary apply">Apply</button>\n		</div>'), "\n	"), HTML.Raw('\n\n	<!--Themed Filter Dropdown-->\n	<!-- <div class="select-themed-filters filter-dropdown col-md-3">\n		<h5>Select Status</h5>\n		<div class="filter-list">\n			<div class="radio">\n			  <label>\n			    <input type="radio" name="themedRadios" id="themedRadios1" value="true">\n			   	In a theme\n			  </label>\n			</div>\n			<div class="radio">\n			  <label>\n			    <input type="radio" name="themedRadios" id="themedRadios2" value="false">\n			    Not in a theme\n			  </label>\n			</div>\n			<div class="radio disabled">\n			  <label>\n			    <input type="radio" name="themedRadios" id="themedRadios3" value="neither">\n			    Both\n			  </label>\n			</div>\n		</div>\n		<div class="apply-filter">\n			<button class="btn btn-default">Cancel</button>\n			<button class="btn btn-primary apply">Apply</button>\n		</div>\n	</div> -->\n\n	<!--Member Of Selection Filter-->\n	'), HTML.DIV({
    "class": "select-memberOf-filters filter-dropdown col-md-3"
  }, "\n		", HTML.Raw("<h5>Select Themes</h5>"), "\n		", HTML.DIV({
    "class": "filter-list"
  }, "\n			", HTML.SELECT({
    multiple: "",
    "class": "select-themes form-control"
  }, "\n				", Blaze.Each(function() {
    return Spacebars.call(view.lookup("currentClusters"));
  }, function() {
    return [ "\n					", HTML.OPTION({
      val: function() {
        return [ "mo-", Spacebars.mustache(Spacebars.dot(view.lookup("."), "_id")) ];
      }
    }, Blaze.View(function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("."), "name"));
    })), "\n				" ];
  }), "\n			"), "\n		"), "\n		", HTML.Raw('<div class="apply-filter">\n			<button class="btn btn-default">Cancel</button>\n			<button class="btn btn-primary apply">Apply</button>\n		</div>'), "\n	"), HTML.Raw('\n\n	<!--Time Filter Dropdown-->\n	<div class="select-time-filters filter-dropdown col-md-3">\n		<div class="filter-list">\n			<h5>Select Time Window</h5>\n			<!-- <div class="time-select-box"> -->\n				Between\n				<select class="select-start form-control time-select">\n					<option>0</option>\n  					<option>1</option>\n					<option>2</option>\n					<option>3</option>\n					<option>4</option>\n					<option>5</option>\n					<option>6</option>\n					<option>7</option>\n					<option>8</option>\n					<option>9</option>\n					<option>10</option>\n					<option>11</option>\n					<option>12</option>\n					<option>13</option>\n					<option>14</option>\n				</select>\n				<span> minutes ago and</span>\n			\n				<select class="select-end form-control time-select">\n  					<option>1</option>\n					<option>2</option>\n					<option>3</option>\n					<option>4</option>\n					<option>5</option>\n					<option>6</option>\n					<option>7</option>\n					<option>8</option>\n					<option>9</option>\n					<option>10</option>\n					<option>11</option>\n					<option>12</option>\n					<option>13</option>\n					<option>14</option>\n					<option>15</option>\n				</select>\n				<span> minutes ago.</span>\n			<!-- </div> -->\n		</div>\n		<div class="apply-filter">\n			<button class="btn btn-default">Cancel</button>\n			<button class="btn btn-primary apply">Apply</button>\n		</div>\n	</div>\n\n	'), HTML.UL({
    id: "idealist",
    "class": "ideadeck ui-sortable"
  }, "\n		", HTML.Raw('<li class="sort-disabled"></li>'), "\n			", Blaze.Each(function() {
    return Spacebars.call(view.lookup("ideas"));
  }, function() {
    return [ "\n				", Spacebars.include(view.lookupTemplate("FilterBoxIdeaItem")), "\n			" ];
  }), "\n	") ];
}));

Template.__define__("FilterBoxIdeaItem", (function() {
  var view = this;
  return HTML.LI({
    id: function() {
      return Spacebars.mustache(view.lookup("_id"));
    },
    "class": "idea-item"
  }, "\n  ", HTML.I({
    "class": function() {
      return [ "sort-disabled fa fa-lg ", Blaze.If(function() {
        return Spacebars.call(view.lookup("gameChangerStatus"));
      }, function() {
        return " fa-star ";
      }, function() {
        return " fa-star-o ";
      }), " gamechangestar" ];
    }
  }), "\n  ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("content"));
  }), " \n");
}));

Template.__define__("activefilters", (function() {
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
