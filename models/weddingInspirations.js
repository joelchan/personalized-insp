// Configure logger for Filters
var logger = new Logger('Model:WeddingInspirations');
// Comment out to use global logging level
 Logger.setLevel('Model:WeddingInspirations', 'trace');
//Logger.setLevel('Model:WeddingInspirations', 'debug');
//Logger.setLevel('Model:WeddingInspirations', 'info');
//Logger.setLevel('Model:WeddingInspirations', 'warn');

WeddingInspirations = new Meteor.Collection("weddingInspirations");

WeddingInspiration = function(previous_id, content, type) {
    this.previous_id = previous_id;
    this.content = content;
    this.type = type;
}

WeddingInspManager = (function() {
  return {
    retrieveInsp: function(filterName, query, queryType, N, different) {
      FilterManager.reset(filterName, Session.get("currentUser"), "weddingInspirations");
      logger.trace("Retrieving " + N + " new " + filterName);
      Meteor.call('topN', "GloVe", query, queryType, function(err, res) {
        var data = JSON.parse(res.content);
        var matches = [];
        if (different) {
            slicedData = data.different.sort(function(a, b){ return a.similarity-b.similarity }).slice(0,N);
            logger.trace("Matches are: " + JSON.stringify(slicedData));
            slicedData.forEach(function(insp) {
                matches.push(insp);
                FilterManager.create(filterName, Session.get("currentUser"), 
                  "weddingInspirations", "previous_id", insp.id);
            });
            logger.trace(matches.length + " matches with average similarity: " + WeddingInspManager.averageSim(matches));
            // return matchIDs;
        } else {
            slicedData = data.similar.sort(function(a, b) { return b.similarity-a.similarity }).slice(0,N);
            logger.trace("Matches are: " + JSON.stringify(slicedData));
            slicedData.forEach(function(insp) {
                matches.push(insp);
                FilterManager.create(filterName, Session.get("currentUser"), 
                  "weddingInspirations", "previous_id", insp.id);
            });
            logger.trace(matches.length + " matches with average similarity: " + WeddingInspManager.averageSim(matches));
            // return matchIDs;
        }
      });
    },
    averageSim: function(matches) {
        simSum = 0.0;
        matches.forEach(function(match) {
            simSum += match.similarity;
        });
        return simSum/matches.length;
    }
  };
}());

WeddingData = [
  {
    "content": "alcohol", 
    "previous_id": "wedding-theme-49", 
    "type": "theme"
  }, 
  {
    "content": "animals", 
    "previous_id": "wedding-theme-31", 
    "type": "theme"
  }, 
  {
    "content": "archaeology", 
    "previous_id": "wedding-theme-56", 
    "type": "theme"
  }, 
  {
    "content": "art", 
    "previous_id": "wedding-theme-42", 
    "type": "theme"
  }, 
  {
    "content": "Babies", 
    "previous_id": "wedding-theme-19", 
    "type": "theme"
  }, 
  {
    "content": "Ballroom", 
    "previous_id": "wedding-theme-26", 
    "type": "theme"
  }, 
  {
    "content": "baseball", 
    "previous_id": "wedding-theme-41", 
    "type": "theme"
  }, 
  {
    "content": "beach", 
    "previous_id": "wedding-theme-35", 
    "type": "theme"
  }, 
  {
    "content": "Books", 
    "previous_id": "wedding-theme-33", 
    "type": "theme"
  }, 
  {
    "content": "butterflies", 
    "previous_id": "wedding-theme-61", 
    "type": "theme"
  }, 
  {
    "content": "Cakes", 
    "previous_id": "wedding-theme-14", 
    "type": "theme"
  }, 
  {
    "content": "candy", 
    "previous_id": "wedding-theme-34", 
    "type": "theme"
  }, 
  {
    "content": "carnival", 
    "previous_id": "wedding-theme-62", 
    "type": "theme"
  }, 
  {
    "content": "charity", 
    "previous_id": "wedding-theme-60", 
    "type": "theme"
  }, 
  {
    "content": "Circus", 
    "previous_id": "wedding-theme-8", 
    "type": "theme"
  }, 
  {
    "content": "Disco", 
    "previous_id": "wedding-theme-10", 
    "type": "theme"
  }, 
  {
    "content": "divination", 
    "previous_id": "wedding-theme-64", 
    "type": "theme"
  }, 
  {
    "content": "Fantasy", 
    "previous_id": "wedding-theme-27", 
    "type": "theme"
  }, 
  {
    "content": "feet", 
    "previous_id": "wedding-theme-32", 
    "type": "theme"
  }, 
  {
    "content": "Firefighter", 
    "previous_id": "wedding-theme-5", 
    "type": "theme"
  }, 
  {
    "content": "Fishing", 
    "previous_id": "wedding-theme-2", 
    "type": "theme"
  }, 
  {
    "content": "food", 
    "previous_id": "wedding-theme-45", 
    "type": "theme"
  }, 
  {
    "content": "Football", 
    "previous_id": "wedding-theme-6", 
    "type": "theme"
  }, 
  {
    "content": "Futuristic", 
    "previous_id": "wedding-theme-28", 
    "type": "theme"
  }, 
  {
    "content": "Galaxy", 
    "previous_id": "wedding-theme-21", 
    "type": "theme"
  }, 
  {
    "content": "games", 
    "previous_id": "wedding-theme-53", 
    "type": "theme"
  }, 
  {
    "content": "Hawaiian", 
    "previous_id": "wedding-theme-29", 
    "type": "theme"
  }, 
  {
    "content": "hearts", 
    "previous_id": "wedding-theme-68", 
    "type": "theme"
  }, 
  {
    "content": "Hockey", 
    "previous_id": "wedding-theme-22", 
    "type": "theme"
  }, 
  {
    "content": "holiday", 
    "previous_id": "wedding-theme-44", 
    "type": "theme"
  }, 
  {
    "content": "jungle", 
    "previous_id": "wedding-theme-51", 
    "type": "theme"
  }, 
  {
    "content": "knots", 
    "previous_id": "wedding-theme-66", 
    "type": "theme"
  }, 
  {
    "content": "literary", 
    "previous_id": "wedding-theme-59", 
    "type": "theme"
  }, 
  {
    "content": "Lookalikes", 
    "previous_id": "wedding-theme-15", 
    "type": "theme"
  }, 
  {
    "content": "Masquerade", 
    "previous_id": "wedding-theme-7", 
    "type": "theme"
  }, 
  {
    "content": "Memories", 
    "previous_id": "wedding-theme-18", 
    "type": "theme"
  }, 
  {
    "content": "monkeys", 
    "previous_id": "wedding-theme-70", 
    "type": "theme"
  }, 
  {
    "content": "movie", 
    "previous_id": "wedding-theme-43", 
    "type": "theme"
  }, 
  {
    "content": "music", 
    "previous_id": "wedding-theme-47", 
    "type": "theme"
  }, 
  {
    "content": "nuts", 
    "previous_id": "wedding-theme-36", 
    "type": "theme"
  }, 
  {
    "content": "Paintings", 
    "previous_id": "wedding-theme-13", 
    "type": "theme"
  }, 
  {
    "content": "Photography", 
    "previous_id": "wedding-theme-16", 
    "type": "theme"
  }, 
  {
    "content": "Pirate", 
    "previous_id": "wedding-theme-9", 
    "type": "theme"
  }, 
  {
    "content": "Pizza", 
    "previous_id": "wedding-theme-39", 
    "type": "theme"
  }, 
  {
    "content": "Reminders", 
    "previous_id": "wedding-theme-20", 
    "type": "theme"
  }, 
  {
    "content": "Space", 
    "previous_id": "wedding-theme-4", 
    "type": "theme"
  }, 
  {
    "content": "spring", 
    "previous_id": "wedding-theme-69", 
    "type": "theme"
  }, 
  {
    "content": "stories", 
    "previous_id": "wedding-theme-65", 
    "type": "theme"
  }, 
  {
    "content": "Suggestions", 
    "previous_id": "wedding-theme-17", 
    "type": "theme"
  }, 
  {
    "content": "Summer", 
    "previous_id": "wedding-theme-24", 
    "type": "theme"
  }, 
  {
    "content": "superheroes", 
    "previous_id": "wedding-theme-58", 
    "type": "theme"
  }, 
  {
    "content": "sweets", 
    "previous_id": "wedding-theme-50", 
    "type": "theme"
  }, 
  {
    "content": "Swimming", 
    "previous_id": "wedding-theme-12", 
    "type": "theme"
  }, 
  {
    "content": "technology", 
    "previous_id": "wedding-theme-38", 
    "type": "theme"
  }, 
  {
    "content": "Trivia", 
    "previous_id": "wedding-theme-11", 
    "type": "theme"
  }, 
  {
    "content": "Tropical", 
    "previous_id": "wedding-theme-1", 
    "type": "theme"
  }, 
  {
    "content": "Underwater", 
    "previous_id": "wedding-theme-30", 
    "type": "theme"
  }, 
  {
    "content": "water", 
    "previous_id": "wedding-theme-55", 
    "type": "theme"
  }, 
  {
    "content": "Western", 
    "previous_id": "wedding-theme-3", 
    "type": "theme"
  }, 
  {
    "content": "Winter", 
    "previous_id": "wedding-theme-25", 
    "type": "theme"
  }, 
  {
    "content": "artificial snow", 
    "previous_id": "wedding-prop-40", 
    "type": "prop"
  }, 
  {
    "content": "bag of cashews", 
    "previous_id": "wedding-prop-36", 
    "type": "prop"
  }, 
  {
    "content": "banana", 
    "previous_id": "wedding-prop-70", 
    "type": "prop"
  }, 
  {
    "content": "beverage", 
    "previous_id": "wedding-prop-49", 
    "type": "prop"
  }, 
  {
    "content": "book", 
    "previous_id": "wedding-prop-65", 
    "type": "prop"
  }, 
  {
    "content": "bookmarks", 
    "previous_id": "wedding-prop-33", 
    "type": "prop"
  }, 
  {
    "content": "camera", 
    "previous_id": "wedding-prop-43", 
    "type": "prop"
  }, 
  {
    "content": "cap", 
    "previous_id": "wedding-prop-52", 
    "type": "prop"
  }, 
  {
    "content": "coin", 
    "previous_id": "wedding-prop-62", 
    "type": "prop"
  }, 
  {
    "content": "comic", 
    "previous_id": "wedding-prop-58", 
    "type": "prop"
  }, 
  {
    "content": "costume", 
    "previous_id": "wedding-prop-7", 
    "type": "prop"
  }, 
  {
    "content": "Decoration", 
    "previous_id": "wedding-prop-14", 
    "type": "prop"
  }, 
  {
    "content": "diapers", 
    "previous_id": "wedding-prop-37", 
    "type": "prop"
  }, 
  {
    "content": "dinosaur", 
    "previous_id": "wedding-prop-56", 
    "type": "prop"
  }, 
  {
    "content": "dish", 
    "previous_id": "wedding-prop-45", 
    "type": "prop"
  }, 
  {
    "content": "donation", 
    "previous_id": "wedding-prop-60", 
    "type": "prop"
  }, 
  {
    "content": "DVD", 
    "previous_id": "wedding-prop-54", 
    "type": "prop"
  }, 
  {
    "content": "EL wire", 
    "previous_id": "wedding-prop-28", 
    "type": "prop"
  }, 
  {
    "content": "Fake swords", 
    "previous_id": "wedding-prop-27", 
    "type": "prop"
  }, 
  {
    "content": "Furry hats", 
    "previous_id": "wedding-prop-25", 
    "type": "prop"
  }, 
  {
    "content": "game", 
    "previous_id": "wedding-prop-53", 
    "type": "prop"
  }, 
  {
    "content": "gift", 
    "previous_id": "wedding-prop-44", 
    "type": "prop"
  }, 
  {
    "content": "Hat", 
    "previous_id": "wedding-prop-3", 
    "type": "prop"
  }, 
  {
    "content": "helmet", 
    "previous_id": "wedding-prop-4", 
    "type": "prop"
  }, 
  {
    "content": "hose", 
    "previous_id": "wedding-prop-5", 
    "type": "prop"
  }, 
  {
    "content": "instruments", 
    "previous_id": "wedding-prop-57", 
    "type": "prop"
  }, 
  {
    "content": "jelly beans", 
    "previous_id": "wedding-prop-34", 
    "type": "prop"
  }, 
  {
    "content": "jersey", 
    "previous_id": "wedding-prop-6", 
    "type": "prop"
  }, 
  {
    "content": "lei", 
    "previous_id": "wedding-prop-1", 
    "type": "prop"
  }, 
  {
    "content": "makeup", 
    "previous_id": "wedding-prop-8", 
    "type": "prop"
  }, 
  {
    "content": "Masquerade masks", 
    "previous_id": "wedding-prop-26", 
    "type": "prop"
  }, 
  {
    "content": "mitt", 
    "previous_id": "wedding-prop-41", 
    "type": "prop"
  }, 
  {
    "content": "net", 
    "previous_id": "wedding-prop-61", 
    "type": "prop"
  }, 
  {
    "content": "nutcracker", 
    "previous_id": "wedding-prop-67", 
    "type": "prop"
  }, 
  {
    "content": "Pens", 
    "previous_id": "wedding-prop-11", 
    "type": "prop"
  }, 
  {
    "content": "pepperoni", 
    "previous_id": "wedding-prop-39", 
    "type": "prop"
  }, 
  {
    "content": "photo", 
    "previous_id": "wedding-prop-46", 
    "type": "prop"
  }, 
  {
    "content": "planets", 
    "previous_id": "wedding-prop-21", 
    "type": "prop"
  }, 
  {
    "content": "pole", 
    "previous_id": "wedding-prop-2", 
    "type": "prop"
  }, 
  {
    "content": "Puck", 
    "previous_id": "wedding-prop-22", 
    "type": "prop"
  }, 
  {
    "content": "puppies", 
    "previous_id": "wedding-prop-31", 
    "type": "prop"
  }, 
  {
    "content": "Rattles", 
    "previous_id": "wedding-prop-19", 
    "type": "prop"
  }, 
  {
    "content": "recipe", 
    "previous_id": "wedding-prop-50", 
    "type": "prop"
  }, 
  {
    "content": "rope", 
    "previous_id": "wedding-prop-66", 
    "type": "prop"
  }, 
  {
    "content": "sand in a bottle.", 
    "previous_id": "wedding-prop-35", 
    "type": "prop"
  }, 
  {
    "content": "seashells", 
    "previous_id": "wedding-prop-30", 
    "type": "prop"
  }, 
  {
    "content": "smock", 
    "previous_id": "wedding-prop-42", 
    "type": "prop"
  }, 
  {
    "content": "song", 
    "previous_id": "wedding-prop-47", 
    "type": "prop"
  }, 
  {
    "content": "stethescope", 
    "previous_id": "wedding-prop-68", 
    "type": "prop"
  }, 
  {
    "content": "Sunglasses", 
    "previous_id": "wedding-prop-24", 
    "type": "prop"
  }, 
  {
    "content": "swimsuit", 
    "previous_id": "wedding-prop-48", 
    "type": "prop"
  }, 
  {
    "content": "tablet", 
    "previous_id": "wedding-prop-38", 
    "type": "prop"
  }, 
  {
    "content": "teacup", 
    "previous_id": "wedding-prop-64", 
    "type": "prop"
  }, 
  {
    "content": "toe rings", 
    "previous_id": "wedding-prop-32", 
    "type": "prop"
  }, 
  {
    "content": "toy", 
    "previous_id": "wedding-prop-51", 
    "type": "prop"
  }, 
  {
    "content": "Toys", 
    "previous_id": "wedding-prop-20", 
    "type": "prop"
  }, 
  {
    "content": "trowel", 
    "previous_id": "wedding-prop-69", 
    "type": "prop"
  }, 
  {
    "content": "Watercolors", 
    "previous_id": "wedding-prop-13", 
    "type": "prop"
  }
]