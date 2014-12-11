//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Random = Package.random.Random;
var EJSON = Package.ejson.EJSON;
var JSON = Package.json.JSON;
var _ = Package.underscore._;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var Log = Package.logging.Log;
var DDP = Package.livedata.DDP;
var Deps = Package.deps.Deps;
var check = Package.check.check;
var Match = Package.check.Match;

/* Package-scope variables */
var LocalCollectionDriver;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/mongo-livedata/local_collection_driver.js                                                  //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
LocalCollectionDriver = function () {                                                                  // 1
  var self = this;                                                                                     // 2
  self.noConnCollections = {};                                                                         // 3
};                                                                                                     // 4
                                                                                                       // 5
var ensureCollection = function (name, collections) {                                                  // 6
  if (!(name in collections))                                                                          // 7
    collections[name] = new LocalCollection(name);                                                     // 8
  return collections[name];                                                                            // 9
};                                                                                                     // 10
                                                                                                       // 11
_.extend(LocalCollectionDriver.prototype, {                                                            // 12
  open: function (name, conn) {                                                                        // 13
    var self = this;                                                                                   // 14
    if (!name)                                                                                         // 15
      return new LocalCollection;                                                                      // 16
    if (! conn) {                                                                                      // 17
      return ensureCollection(name, self.noConnCollections);                                           // 18
    }                                                                                                  // 19
    if (! conn._mongo_livedata_collections)                                                            // 20
      conn._mongo_livedata_collections = {};                                                           // 21
    // XXX is there a way to keep track of a connection's collections without                          // 22
    // dangling it off the connection object?                                                          // 23
    return ensureCollection(name, conn._mongo_livedata_collections);                                   // 24
  }                                                                                                    // 25
});                                                                                                    // 26
                                                                                                       // 27
// singleton                                                                                           // 28
LocalCollectionDriver = new LocalCollectionDriver;                                                     // 29
                                                                                                       // 30
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/mongo-livedata/collection.js                                                               //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
// options.connection, if given, is a LivedataClient or LivedataServer                                 // 1
// XXX presently there is no way to destroy/clean up a Collection                                      // 2
                                                                                                       // 3
Meteor.Collection = function (name, options) {                                                         // 4
  var self = this;                                                                                     // 5
  if (! (self instanceof Meteor.Collection))                                                           // 6
    throw new Error('use "new" to construct a Meteor.Collection');                                     // 7
                                                                                                       // 8
  if (!name && (name !== null)) {                                                                      // 9
    Meteor._debug("Warning: creating anonymous collection. It will not be " +                          // 10
                  "saved or synchronized over the network. (Pass null for " +                          // 11
                  "the collection name to turn off this warning.)");                                   // 12
    name = null;                                                                                       // 13
  }                                                                                                    // 14
                                                                                                       // 15
  if (name !== null && typeof name !== "string") {                                                     // 16
    throw new Error(                                                                                   // 17
      "First argument to new Meteor.Collection must be a string or null");                             // 18
  }                                                                                                    // 19
                                                                                                       // 20
  if (options && options.methods) {                                                                    // 21
    // Backwards compatibility hack with original signature (which passed                              // 22
    // "connection" directly instead of in options. (Connections must have a "methods"                 // 23
    // method.)                                                                                        // 24
    // XXX remove before 1.0                                                                           // 25
    options = {connection: options};                                                                   // 26
  }                                                                                                    // 27
  // Backwards compatibility: "connection" used to be called "manager".                                // 28
  if (options && options.manager && !options.connection) {                                             // 29
    options.connection = options.manager;                                                              // 30
  }                                                                                                    // 31
  options = _.extend({                                                                                 // 32
    connection: undefined,                                                                             // 33
    idGeneration: 'STRING',                                                                            // 34
    transform: null,                                                                                   // 35
    _driver: undefined,                                                                                // 36
    _preventAutopublish: false                                                                         // 37
  }, options);                                                                                         // 38
                                                                                                       // 39
  switch (options.idGeneration) {                                                                      // 40
  case 'MONGO':                                                                                        // 41
    self._makeNewID = function () {                                                                    // 42
      var src = name ? DDP.randomStream('/collection/' + name) : Random;                               // 43
      return new Meteor.Collection.ObjectID(src.hexString(24));                                        // 44
    };                                                                                                 // 45
    break;                                                                                             // 46
  case 'STRING':                                                                                       // 47
  default:                                                                                             // 48
    self._makeNewID = function () {                                                                    // 49
      var src = name ? DDP.randomStream('/collection/' + name) : Random;                               // 50
      return src.id();                                                                                 // 51
    };                                                                                                 // 52
    break;                                                                                             // 53
  }                                                                                                    // 54
                                                                                                       // 55
  self._transform = LocalCollection.wrapTransform(options.transform);                                  // 56
                                                                                                       // 57
  if (! name || options.connection === null)                                                           // 58
    // note: nameless collections never have a connection                                              // 59
    self._connection = null;                                                                           // 60
  else if (options.connection)                                                                         // 61
    self._connection = options.connection;                                                             // 62
  else if (Meteor.isClient)                                                                            // 63
    self._connection = Meteor.connection;                                                              // 64
  else                                                                                                 // 65
    self._connection = Meteor.server;                                                                  // 66
                                                                                                       // 67
  if (!options._driver) {                                                                              // 68
    // XXX This check assumes that webapp is loaded so that Meteor.server !==                          // 69
    // null. We should fully support the case of "want to use a Mongo-backed                           // 70
    // collection from Node code without webapp", but we don't yet.                                    // 71
    // #MeteorServerNull                                                                               // 72
    if (name && self._connection === Meteor.server &&                                                  // 73
        typeof MongoInternals !== "undefined" &&                                                       // 74
        MongoInternals.defaultRemoteCollectionDriver) {                                                // 75
      options._driver = MongoInternals.defaultRemoteCollectionDriver();                                // 76
    } else {                                                                                           // 77
      options._driver = LocalCollectionDriver;                                                         // 78
    }                                                                                                  // 79
  }                                                                                                    // 80
                                                                                                       // 81
  self._collection = options._driver.open(name, self._connection);                                     // 82
  self._name = name;                                                                                   // 83
                                                                                                       // 84
  if (self._connection && self._connection.registerStore) {                                            // 85
    // OK, we're going to be a slave, replicating some remote                                          // 86
    // database, except possibly with some temporary divergence while                                  // 87
    // we have unacknowledged RPC's.                                                                   // 88
    var ok = self._connection.registerStore(name, {                                                    // 89
      // Called at the beginning of a batch of updates. batchSize is the number                        // 90
      // of update calls to expect.                                                                    // 91
      //                                                                                               // 92
      // XXX This interface is pretty janky. reset probably ought to go back to                        // 93
      // being its own function, and callers shouldn't have to calculate                               // 94
      // batchSize. The optimization of not calling pause/remove should be                             // 95
      // delayed until later: the first call to update() should buffer its                             // 96
      // message, and then we can either directly apply it at endUpdate time if                        // 97
      // it was the only update, or do pauseObservers/apply/apply at the next                          // 98
      // update() if there's another one.                                                              // 99
      beginUpdate: function (batchSize, reset) {                                                       // 100
        // pause observers so users don't see flicker when updating several                            // 101
        // objects at once (including the post-reconnect reset-and-reapply                             // 102
        // stage), and so that a re-sorting of a query can take advantage of the                       // 103
        // full _diffQuery moved calculation instead of applying change one at a                       // 104
        // time.                                                                                       // 105
        if (batchSize > 1 || reset)                                                                    // 106
          self._collection.pauseObservers();                                                           // 107
                                                                                                       // 108
        if (reset)                                                                                     // 109
          self._collection.remove({});                                                                 // 110
      },                                                                                               // 111
                                                                                                       // 112
      // Apply an update.                                                                              // 113
      // XXX better specify this interface (not in terms of a wire message)?                           // 114
      update: function (msg) {                                                                         // 115
        var mongoId = LocalCollection._idParse(msg.id);                                                // 116
        var doc = self._collection.findOne(mongoId);                                                   // 117
                                                                                                       // 118
        // Is this a "replace the whole doc" message coming from the quiescence                        // 119
        // of method writes to an object? (Note that 'undefined' is a valid                            // 120
        // value meaning "remove it".)                                                                 // 121
        if (msg.msg === 'replace') {                                                                   // 122
          var replace = msg.replace;                                                                   // 123
          if (!replace) {                                                                              // 124
            if (doc)                                                                                   // 125
              self._collection.remove(mongoId);                                                        // 126
          } else if (!doc) {                                                                           // 127
            self._collection.insert(replace);                                                          // 128
          } else {                                                                                     // 129
            // XXX check that replace has no $ ops                                                     // 130
            self._collection.update(mongoId, replace);                                                 // 131
          }                                                                                            // 132
          return;                                                                                      // 133
        } else if (msg.msg === 'added') {                                                              // 134
          if (doc) {                                                                                   // 135
            throw new Error("Expected not to find a document already present for an add");             // 136
          }                                                                                            // 137
          self._collection.insert(_.extend({_id: mongoId}, msg.fields));                               // 138
        } else if (msg.msg === 'removed') {                                                            // 139
          if (!doc)                                                                                    // 140
            throw new Error("Expected to find a document already present for removed");                // 141
          self._collection.remove(mongoId);                                                            // 142
        } else if (msg.msg === 'changed') {                                                            // 143
          if (!doc)                                                                                    // 144
            throw new Error("Expected to find a document to change");                                  // 145
          if (!_.isEmpty(msg.fields)) {                                                                // 146
            var modifier = {};                                                                         // 147
            _.each(msg.fields, function (value, key) {                                                 // 148
              if (value === undefined) {                                                               // 149
                if (!modifier.$unset)                                                                  // 150
                  modifier.$unset = {};                                                                // 151
                modifier.$unset[key] = 1;                                                              // 152
              } else {                                                                                 // 153
                if (!modifier.$set)                                                                    // 154
                  modifier.$set = {};                                                                  // 155
                modifier.$set[key] = value;                                                            // 156
              }                                                                                        // 157
            });                                                                                        // 158
            self._collection.update(mongoId, modifier);                                                // 159
          }                                                                                            // 160
        } else {                                                                                       // 161
          throw new Error("I don't know how to deal with this message");                               // 162
        }                                                                                              // 163
                                                                                                       // 164
      },                                                                                               // 165
                                                                                                       // 166
      // Called at the end of a batch of updates.                                                      // 167
      endUpdate: function () {                                                                         // 168
        self._collection.resumeObservers();                                                            // 169
      },                                                                                               // 170
                                                                                                       // 171
      // Called around method stub invocations to capture the original versions                        // 172
      // of modified documents.                                                                        // 173
      saveOriginals: function () {                                                                     // 174
        self._collection.saveOriginals();                                                              // 175
      },                                                                                               // 176
      retrieveOriginals: function () {                                                                 // 177
        return self._collection.retrieveOriginals();                                                   // 178
      }                                                                                                // 179
    });                                                                                                // 180
                                                                                                       // 181
    if (!ok)                                                                                           // 182
      throw new Error("There is already a collection named '" + name + "'");                           // 183
  }                                                                                                    // 184
                                                                                                       // 185
  self._defineMutationMethods();                                                                       // 186
                                                                                                       // 187
  // autopublish                                                                                       // 188
  if (Package.autopublish && !options._preventAutopublish && self._connection                          // 189
      && self._connection.publish) {                                                                   // 190
    self._connection.publish(null, function () {                                                       // 191
      return self.find();                                                                              // 192
    }, {is_auto: true});                                                                               // 193
  }                                                                                                    // 194
};                                                                                                     // 195
                                                                                                       // 196
///                                                                                                    // 197
/// Main collection API                                                                                // 198
///                                                                                                    // 199
                                                                                                       // 200
                                                                                                       // 201
_.extend(Meteor.Collection.prototype, {                                                                // 202
                                                                                                       // 203
  _getFindSelector: function (args) {                                                                  // 204
    if (args.length == 0)                                                                              // 205
      return {};                                                                                       // 206
    else                                                                                               // 207
      return args[0];                                                                                  // 208
  },                                                                                                   // 209
                                                                                                       // 210
  _getFindOptions: function (args) {                                                                   // 211
    var self = this;                                                                                   // 212
    if (args.length < 2) {                                                                             // 213
      return { transform: self._transform };                                                           // 214
    } else {                                                                                           // 215
      check(args[1], Match.Optional(Match.ObjectIncluding({                                            // 216
        fields: Match.Optional(Match.OneOf(Object, undefined)),                                        // 217
        sort: Match.Optional(Match.OneOf(Object, Array, undefined)),                                   // 218
        limit: Match.Optional(Match.OneOf(Number, undefined)),                                         // 219
        skip: Match.Optional(Match.OneOf(Number, undefined))                                           // 220
     })));                                                                                             // 221
                                                                                                       // 222
      return _.extend({                                                                                // 223
        transform: self._transform                                                                     // 224
      }, args[1]);                                                                                     // 225
    }                                                                                                  // 226
  },                                                                                                   // 227
                                                                                                       // 228
  find: function (/* selector, options */) {                                                           // 229
    // Collection.find() (return all docs) behaves differently                                         // 230
    // from Collection.find(undefined) (return 0 docs).  so be                                         // 231
    // careful about the length of arguments.                                                          // 232
    var self = this;                                                                                   // 233
    var argArray = _.toArray(arguments);                                                               // 234
    return self._collection.find(self._getFindSelector(argArray),                                      // 235
                                 self._getFindOptions(argArray));                                      // 236
  },                                                                                                   // 237
                                                                                                       // 238
  findOne: function (/* selector, options */) {                                                        // 239
    var self = this;                                                                                   // 240
    var argArray = _.toArray(arguments);                                                               // 241
    return self._collection.findOne(self._getFindSelector(argArray),                                   // 242
                                    self._getFindOptions(argArray));                                   // 243
  }                                                                                                    // 244
                                                                                                       // 245
});                                                                                                    // 246
                                                                                                       // 247
Meteor.Collection._publishCursor = function (cursor, sub, collection) {                                // 248
  var observeHandle = cursor.observeChanges({                                                          // 249
    added: function (id, fields) {                                                                     // 250
      sub.added(collection, id, fields);                                                               // 251
    },                                                                                                 // 252
    changed: function (id, fields) {                                                                   // 253
      sub.changed(collection, id, fields);                                                             // 254
    },                                                                                                 // 255
    removed: function (id) {                                                                           // 256
      sub.removed(collection, id);                                                                     // 257
    }                                                                                                  // 258
  });                                                                                                  // 259
                                                                                                       // 260
  // We don't call sub.ready() here: it gets called in livedata_server, after                          // 261
  // possibly calling _publishCursor on multiple returned cursors.                                     // 262
                                                                                                       // 263
  // register stop callback (expects lambda w/ no args).                                               // 264
  sub.onStop(function () {observeHandle.stop();});                                                     // 265
};                                                                                                     // 266
                                                                                                       // 267
// protect against dangerous selectors.  falsey and {_id: falsey} are both                             // 268
// likely programmer error, and not what you want, particularly for destructive                        // 269
// operations.  JS regexps don't serialize over DDP but can be trivially                               // 270
// replaced by $regex.                                                                                 // 271
Meteor.Collection._rewriteSelector = function (selector) {                                             // 272
  // shorthand -- scalars match _id                                                                    // 273
  if (LocalCollection._selectorIsId(selector))                                                         // 274
    selector = {_id: selector};                                                                        // 275
                                                                                                       // 276
  if (!selector || (('_id' in selector) && !selector._id))                                             // 277
    // can't match anything                                                                            // 278
    return {_id: Random.id()};                                                                         // 279
                                                                                                       // 280
  var ret = {};                                                                                        // 281
  _.each(selector, function (value, key) {                                                             // 282
    // Mongo supports both {field: /foo/} and {field: {$regex: /foo/}}                                 // 283
    if (value instanceof RegExp) {                                                                     // 284
      ret[key] = convertRegexpToMongoSelector(value);                                                  // 285
    } else if (value && value.$regex instanceof RegExp) {                                              // 286
      ret[key] = convertRegexpToMongoSelector(value.$regex);                                           // 287
      // if value is {$regex: /foo/, $options: ...} then $options                                      // 288
      // override the ones set on $regex.                                                              // 289
      if (value.$options !== undefined)                                                                // 290
        ret[key].$options = value.$options;                                                            // 291
    }                                                                                                  // 292
    else if (_.contains(['$or','$and','$nor'], key)) {                                                 // 293
      // Translate lower levels of $and/$or/$nor                                                       // 294
      ret[key] = _.map(value, function (v) {                                                           // 295
        return Meteor.Collection._rewriteSelector(v);                                                  // 296
      });                                                                                              // 297
    } else {                                                                                           // 298
      ret[key] = value;                                                                                // 299
    }                                                                                                  // 300
  });                                                                                                  // 301
  return ret;                                                                                          // 302
};                                                                                                     // 303
                                                                                                       // 304
// convert a JS RegExp object to a Mongo {$regex: ..., $options: ...}                                  // 305
// selector                                                                                            // 306
var convertRegexpToMongoSelector = function (regexp) {                                                 // 307
  check(regexp, RegExp); // safety belt                                                                // 308
                                                                                                       // 309
  var selector = {$regex: regexp.source};                                                              // 310
  var regexOptions = '';                                                                               // 311
  // JS RegExp objects support 'i', 'm', and 'g'. Mongo regex $options                                 // 312
  // support 'i', 'm', 'x', and 's'. So we support 'i' and 'm' here.                                   // 313
  if (regexp.ignoreCase)                                                                               // 314
    regexOptions += 'i';                                                                               // 315
  if (regexp.multiline)                                                                                // 316
    regexOptions += 'm';                                                                               // 317
  if (regexOptions)                                                                                    // 318
    selector.$options = regexOptions;                                                                  // 319
                                                                                                       // 320
  return selector;                                                                                     // 321
};                                                                                                     // 322
                                                                                                       // 323
var throwIfSelectorIsNotId = function (selector, methodName) {                                         // 324
  if (!LocalCollection._selectorIsIdPerhapsAsObject(selector)) {                                       // 325
    throw new Meteor.Error(                                                                            // 326
      403, "Not permitted. Untrusted code may only " + methodName +                                    // 327
        " documents by ID.");                                                                          // 328
  }                                                                                                    // 329
};                                                                                                     // 330
                                                                                                       // 331
// 'insert' immediately returns the inserted document's new _id.                                       // 332
// The others return values immediately if you are in a stub, an in-memory                             // 333
// unmanaged collection, or a mongo-backed collection and you don't pass a                             // 334
// callback. 'update' and 'remove' return the number of affected                                       // 335
// documents. 'upsert' returns an object with keys 'numberAffected' and, if an                         // 336
// insert happened, 'insertedId'.                                                                      // 337
//                                                                                                     // 338
// Otherwise, the semantics are exactly like other methods: they take                                  // 339
// a callback as an optional last argument; if no callback is                                          // 340
// provided, they block until the operation is complete, and throw an                                  // 341
// exception if it fails; if a callback is provided, then they don't                                   // 342
// necessarily block, and they call the callback when they finish with error and                       // 343
// result arguments.  (The insert method provides the document ID as its result;                       // 344
// update and remove provide the number of affected docs as the result; upsert                         // 345
// provides an object with numberAffected and maybe insertedId.)                                       // 346
//                                                                                                     // 347
// On the client, blocking is impossible, so if a callback                                             // 348
// isn't provided, they just return immediately and any error                                          // 349
// information is lost.                                                                                // 350
//                                                                                                     // 351
// There's one more tweak. On the client, if you don't provide a                                       // 352
// callback, then if there is an error, a message will be logged with                                  // 353
// Meteor._debug.                                                                                      // 354
//                                                                                                     // 355
// The intent (though this is actually determined by the underlying                                    // 356
// drivers) is that the operations should be done synchronously, not                                   // 357
// generating their result until the database has acknowledged                                         // 358
// them. In the future maybe we should provide a flag to turn this                                     // 359
// off.                                                                                                // 360
_.each(["insert", "update", "remove"], function (name) {                                               // 361
  Meteor.Collection.prototype[name] = function (/* arguments */) {                                     // 362
    var self = this;                                                                                   // 363
    var args = _.toArray(arguments);                                                                   // 364
    var callback;                                                                                      // 365
    var insertId;                                                                                      // 366
    var ret;                                                                                           // 367
                                                                                                       // 368
    // Pull off any callback (or perhaps a 'callback' variable that was passed                         // 369
    // in undefined, like how 'upsert' does it).                                                       // 370
    if (args.length &&                                                                                 // 371
        (args[args.length - 1] === undefined ||                                                        // 372
         args[args.length - 1] instanceof Function)) {                                                 // 373
      callback = args.pop();                                                                           // 374
    }                                                                                                  // 375
                                                                                                       // 376
    if (name === "insert") {                                                                           // 377
      if (!args.length)                                                                                // 378
        throw new Error("insert requires an argument");                                                // 379
      // shallow-copy the document and generate an ID                                                  // 380
      args[0] = _.extend({}, args[0]);                                                                 // 381
      if ('_id' in args[0]) {                                                                          // 382
        insertId = args[0]._id;                                                                        // 383
        if (!insertId || !(typeof insertId === 'string'                                                // 384
              || insertId instanceof Meteor.Collection.ObjectID))                                      // 385
          throw new Error("Meteor requires document _id fields to be non-empty strings or ObjectIDs"); // 386
      } else {                                                                                         // 387
        var generateId = true;                                                                         // 388
        // Don't generate the id if we're the client and the 'outermost' call                          // 389
        // This optimization saves us passing both the randomSeed and the id                           // 390
        // Passing both is redundant.                                                                  // 391
        if (self._connection && self._connection !== Meteor.server) {                                  // 392
          var enclosing = DDP._CurrentInvocation.get();                                                // 393
          if (!enclosing) {                                                                            // 394
            generateId = false;                                                                        // 395
          }                                                                                            // 396
        }                                                                                              // 397
        if (generateId) {                                                                              // 398
          insertId = args[0]._id = self._makeNewID();                                                  // 399
        }                                                                                              // 400
      }                                                                                                // 401
    } else {                                                                                           // 402
      args[0] = Meteor.Collection._rewriteSelector(args[0]);                                           // 403
                                                                                                       // 404
      if (name === "update") {                                                                         // 405
        // Mutate args but copy the original options object. We need to add                            // 406
        // insertedId to options, but don't want to mutate the caller's options                        // 407
        // object. We need to mutate `args` because we pass `args` into the                            // 408
        // driver below.                                                                               // 409
        var options = args[2] = _.clone(args[2]) || {};                                                // 410
        if (options && typeof options !== "function" && options.upsert) {                              // 411
          // set `insertedId` if absent.  `insertedId` is a Meteor extension.                          // 412
          if (options.insertedId) {                                                                    // 413
            if (!(typeof options.insertedId === 'string'                                               // 414
                  || options.insertedId instanceof Meteor.Collection.ObjectID))                        // 415
              throw new Error("insertedId must be string or ObjectID");                                // 416
          } else {                                                                                     // 417
            options.insertedId = self._makeNewID();                                                    // 418
          }                                                                                            // 419
        }                                                                                              // 420
      }                                                                                                // 421
    }                                                                                                  // 422
                                                                                                       // 423
    // On inserts, always return the id that we generated; on all other                                // 424
    // operations, just return the result from the collection.                                         // 425
    var chooseReturnValueFromCollectionResult = function (result) {                                    // 426
      if (name === "insert") {                                                                         // 427
        if (!insertId && result) {                                                                     // 428
          insertId = result;                                                                           // 429
        }                                                                                              // 430
        return insertId;                                                                               // 431
      } else {                                                                                         // 432
        return result;                                                                                 // 433
      }                                                                                                // 434
    };                                                                                                 // 435
                                                                                                       // 436
    var wrappedCallback;                                                                               // 437
    if (callback) {                                                                                    // 438
      wrappedCallback = function (error, result) {                                                     // 439
        callback(error, ! error && chooseReturnValueFromCollectionResult(result));                     // 440
      };                                                                                               // 441
    }                                                                                                  // 442
                                                                                                       // 443
    // XXX see #MeteorServerNull                                                                       // 444
    if (self._connection && self._connection !== Meteor.server) {                                      // 445
      // just remote to another endpoint, propagate return value or                                    // 446
      // exception.                                                                                    // 447
                                                                                                       // 448
      var enclosing = DDP._CurrentInvocation.get();                                                    // 449
      var alreadyInSimulation = enclosing && enclosing.isSimulation;                                   // 450
                                                                                                       // 451
      if (Meteor.isClient && !wrappedCallback && ! alreadyInSimulation) {                              // 452
        // Client can't block, so it can't report errors by exception,                                 // 453
        // only by callback. If they forget the callback, give them a                                  // 454
        // default one that logs the error, so they aren't totally                                     // 455
        // baffled if their writes don't work because their database is                                // 456
        // down.                                                                                       // 457
        // Don't give a default callback in simulation, because inside stubs we                        // 458
        // want to return the results from the local collection immediately and                        // 459
        // not force a callback.                                                                       // 460
        wrappedCallback = function (err) {                                                             // 461
          if (err)                                                                                     // 462
            Meteor._debug(name + " failed: " + (err.reason || err.stack));                             // 463
        };                                                                                             // 464
      }                                                                                                // 465
                                                                                                       // 466
      if (!alreadyInSimulation && name !== "insert") {                                                 // 467
        // If we're about to actually send an RPC, we should throw an error if                         // 468
        // this is a non-ID selector, because the mutation methods only allow                          // 469
        // single-ID selectors. (If we don't throw here, we'll see flicker.)                           // 470
        throwIfSelectorIsNotId(args[0], name);                                                         // 471
      }                                                                                                // 472
                                                                                                       // 473
      ret = chooseReturnValueFromCollectionResult(                                                     // 474
        self._connection.apply(self._prefix + name, args, {returnStubValue: true}, wrappedCallback)    // 475
      );                                                                                               // 476
                                                                                                       // 477
    } else {                                                                                           // 478
      // it's my collection.  descend into the collection object                                       // 479
      // and propagate any exception.                                                                  // 480
      args.push(wrappedCallback);                                                                      // 481
      try {                                                                                            // 482
        // If the user provided a callback and the collection implements this                          // 483
        // operation asynchronously, then queryRet will be undefined, and the                          // 484
        // result will be returned through the callback instead.                                       // 485
        var queryRet = self._collection[name].apply(self._collection, args);                           // 486
        ret = chooseReturnValueFromCollectionResult(queryRet);                                         // 487
      } catch (e) {                                                                                    // 488
        if (callback) {                                                                                // 489
          callback(e);                                                                                 // 490
          return null;                                                                                 // 491
        }                                                                                              // 492
        throw e;                                                                                       // 493
      }                                                                                                // 494
    }                                                                                                  // 495
                                                                                                       // 496
    // both sync and async, unless we threw an exception, return ret                                   // 497
    // (new document ID for insert, num affected for update/remove, object with                        // 498
    // numberAffected and maybe insertedId for upsert).                                                // 499
    return ret;                                                                                        // 500
  };                                                                                                   // 501
});                                                                                                    // 502
                                                                                                       // 503
Meteor.Collection.prototype.upsert = function (selector, modifier,                                     // 504
                                               options, callback) {                                    // 505
  var self = this;                                                                                     // 506
  if (! callback && typeof options === "function") {                                                   // 507
    callback = options;                                                                                // 508
    options = {};                                                                                      // 509
  }                                                                                                    // 510
  return self.update(selector, modifier,                                                               // 511
              _.extend({}, options, { _returnObject: true, upsert: true }),                            // 512
              callback);                                                                               // 513
};                                                                                                     // 514
                                                                                                       // 515
// We'll actually design an index API later. For now, we just pass through to                          // 516
// Mongo's, but make it synchronous.                                                                   // 517
Meteor.Collection.prototype._ensureIndex = function (index, options) {                                 // 518
  var self = this;                                                                                     // 519
  if (!self._collection._ensureIndex)                                                                  // 520
    throw new Error("Can only call _ensureIndex on server collections");                               // 521
  self._collection._ensureIndex(index, options);                                                       // 522
};                                                                                                     // 523
Meteor.Collection.prototype._dropIndex = function (index) {                                            // 524
  var self = this;                                                                                     // 525
  if (!self._collection._dropIndex)                                                                    // 526
    throw new Error("Can only call _dropIndex on server collections");                                 // 527
  self._collection._dropIndex(index);                                                                  // 528
};                                                                                                     // 529
Meteor.Collection.prototype._dropCollection = function () {                                            // 530
  var self = this;                                                                                     // 531
  if (!self._collection.dropCollection)                                                                // 532
    throw new Error("Can only call _dropCollection on server collections");                            // 533
  self._collection.dropCollection();                                                                   // 534
};                                                                                                     // 535
Meteor.Collection.prototype._createCappedCollection = function (byteSize) {                            // 536
  var self = this;                                                                                     // 537
  if (!self._collection._createCappedCollection)                                                       // 538
    throw new Error("Can only call _createCappedCollection on server collections");                    // 539
  self._collection._createCappedCollection(byteSize);                                                  // 540
};                                                                                                     // 541
                                                                                                       // 542
Meteor.Collection.ObjectID = LocalCollection._ObjectID;                                                // 543
                                                                                                       // 544
///                                                                                                    // 545
/// Remote methods and access control.                                                                 // 546
///                                                                                                    // 547
                                                                                                       // 548
// Restrict default mutators on collection. allow() and deny() take the                                // 549
// same options:                                                                                       // 550
//                                                                                                     // 551
// options.insert {Function(userId, doc)}                                                              // 552
//   return true to allow/deny adding this document                                                    // 553
//                                                                                                     // 554
// options.update {Function(userId, docs, fields, modifier)}                                           // 555
//   return true to allow/deny updating these documents.                                               // 556
//   `fields` is passed as an array of fields that are to be modified                                  // 557
//                                                                                                     // 558
// options.remove {Function(userId, docs)}                                                             // 559
//   return true to allow/deny removing these documents                                                // 560
//                                                                                                     // 561
// options.fetch {Array}                                                                               // 562
//   Fields to fetch for these validators. If any call to allow or deny                                // 563
//   does not have this option then all fields are loaded.                                             // 564
//                                                                                                     // 565
// allow and deny can be called multiple times. The validators are                                     // 566
// evaluated as follows:                                                                               // 567
// - If neither deny() nor allow() has been called on the collection,                                  // 568
//   then the request is allowed if and only if the "insecure" smart                                   // 569
//   package is in use.                                                                                // 570
// - Otherwise, if any deny() function returns true, the request is denied.                            // 571
// - Otherwise, if any allow() function returns true, the request is allowed.                          // 572
// - Otherwise, the request is denied.                                                                 // 573
//                                                                                                     // 574
// Meteor may call your deny() and allow() functions in any order, and may not                         // 575
// call all of them if it is able to make a decision without calling them all                          // 576
// (so don't include side effects).                                                                    // 577
                                                                                                       // 578
(function () {                                                                                         // 579
  var addValidator = function(allowOrDeny, options) {                                                  // 580
    // validate keys                                                                                   // 581
    var VALID_KEYS = ['insert', 'update', 'remove', 'fetch', 'transform'];                             // 582
    _.each(_.keys(options), function (key) {                                                           // 583
      if (!_.contains(VALID_KEYS, key))                                                                // 584
        throw new Error(allowOrDeny + ": Invalid key: " + key);                                        // 585
    });                                                                                                // 586
                                                                                                       // 587
    var self = this;                                                                                   // 588
    self._restricted = true;                                                                           // 589
                                                                                                       // 590
    _.each(['insert', 'update', 'remove'], function (name) {                                           // 591
      if (options[name]) {                                                                             // 592
        if (!(options[name] instanceof Function)) {                                                    // 593
          throw new Error(allowOrDeny + ": Value for `" + name + "` must be a function");              // 594
        }                                                                                              // 595
                                                                                                       // 596
        // If the transform is specified at all (including as 'null') in this                          // 597
        // call, then take that; otherwise, take the transform from the                                // 598
        // collection.                                                                                 // 599
        if (options.transform === undefined) {                                                         // 600
          options[name].transform = self._transform;  // already wrapped                               // 601
        } else {                                                                                       // 602
          options[name].transform = LocalCollection.wrapTransform(                                     // 603
            options.transform);                                                                        // 604
        }                                                                                              // 605
                                                                                                       // 606
        self._validators[name][allowOrDeny].push(options[name]);                                       // 607
      }                                                                                                // 608
    });                                                                                                // 609
                                                                                                       // 610
    // Only update the fetch fields if we're passed things that affect                                 // 611
    // fetching. This way allow({}) and allow({insert: f}) don't result in                             // 612
    // setting fetchAllFields                                                                          // 613
    if (options.update || options.remove || options.fetch) {                                           // 614
      if (options.fetch && !(options.fetch instanceof Array)) {                                        // 615
        throw new Error(allowOrDeny + ": Value for `fetch` must be an array");                         // 616
      }                                                                                                // 617
      self._updateFetch(options.fetch);                                                                // 618
    }                                                                                                  // 619
  };                                                                                                   // 620
                                                                                                       // 621
  Meteor.Collection.prototype.allow = function(options) {                                              // 622
    addValidator.call(this, 'allow', options);                                                         // 623
  };                                                                                                   // 624
  Meteor.Collection.prototype.deny = function(options) {                                               // 625
    addValidator.call(this, 'deny', options);                                                          // 626
  };                                                                                                   // 627
})();                                                                                                  // 628
                                                                                                       // 629
                                                                                                       // 630
Meteor.Collection.prototype._defineMutationMethods = function() {                                      // 631
  var self = this;                                                                                     // 632
                                                                                                       // 633
  // set to true once we call any allow or deny methods. If true, use                                  // 634
  // allow/deny semantics. If false, use insecure mode semantics.                                      // 635
  self._restricted = false;                                                                            // 636
                                                                                                       // 637
  // Insecure mode (default to allowing writes). Defaults to 'undefined' which                         // 638
  // means insecure iff the insecure package is loaded. This property can be                           // 639
  // overriden by tests or packages wishing to change insecure mode behavior of                        // 640
  // their collections.                                                                                // 641
  self._insecure = undefined;                                                                          // 642
                                                                                                       // 643
  self._validators = {                                                                                 // 644
    insert: {allow: [], deny: []},                                                                     // 645
    update: {allow: [], deny: []},                                                                     // 646
    remove: {allow: [], deny: []},                                                                     // 647
    upsert: {allow: [], deny: []}, // dummy arrays; can't set these!                                   // 648
    fetch: [],                                                                                         // 649
    fetchAllFields: false                                                                              // 650
  };                                                                                                   // 651
                                                                                                       // 652
  if (!self._name)                                                                                     // 653
    return; // anonymous collection                                                                    // 654
                                                                                                       // 655
  // XXX Think about method namespacing. Maybe methods should be                                       // 656
  // "Meteor:Mongo:insert/NAME"?                                                                       // 657
  self._prefix = '/' + self._name + '/';                                                               // 658
                                                                                                       // 659
  // mutation methods                                                                                  // 660
  if (self._connection) {                                                                              // 661
    var m = {};                                                                                        // 662
                                                                                                       // 663
    _.each(['insert', 'update', 'remove'], function (method) {                                         // 664
      m[self._prefix + method] = function (/* ... */) {                                                // 665
        // All the methods do their own validation, instead of using check().                          // 666
        check(arguments, [Match.Any]);                                                                 // 667
        var args = _.toArray(arguments);                                                               // 668
        try {                                                                                          // 669
          // For an insert, if the client didn't specify an _id, generate one                          // 670
          // now; because this uses DDP.randomStream, it will be consistent with                       // 671
          // what the client generated. We generate it now rather than later so                        // 672
          // that if (eg) an allow/deny rule does an insert to the same                                // 673
          // collection (not that it really should), the generated _id will                            // 674
          // still be the first use of the stream and will be consistent.                              // 675
          //                                                                                           // 676
          // However, we don't actually stick the _id onto the document yet,                           // 677
          // because we want allow/deny rules to be able to differentiate                              // 678
          // between arbitrary client-specified _id fields and merely                                  // 679
          // client-controlled-via-randomSeed fields.                                                  // 680
          var generatedId = null;                                                                      // 681
          if (method === "insert" && !_.has(args[0], '_id')) {                                         // 682
            generatedId = self._makeNewID();                                                           // 683
          }                                                                                            // 684
                                                                                                       // 685
          if (this.isSimulation) {                                                                     // 686
            // In a client simulation, you can do any mutation (even with a                            // 687
            // complex selector).                                                                      // 688
            if (generatedId !== null)                                                                  // 689
              args[0]._id = generatedId;                                                               // 690
            return self._collection[method].apply(                                                     // 691
              self._collection, args);                                                                 // 692
          }                                                                                            // 693
                                                                                                       // 694
          // This is the server receiving a method call from the client.                               // 695
                                                                                                       // 696
          // We don't allow arbitrary selectors in mutations from the client: only                     // 697
          // single-ID selectors.                                                                      // 698
          if (method !== 'insert')                                                                     // 699
            throwIfSelectorIsNotId(args[0], method);                                                   // 700
                                                                                                       // 701
          if (self._restricted) {                                                                      // 702
            // short circuit if there is no way it will pass.                                          // 703
            if (self._validators[method].allow.length === 0) {                                         // 704
              throw new Meteor.Error(                                                                  // 705
                403, "Access denied. No allow validators set on restricted " +                         // 706
                  "collection for method '" + method + "'.");                                          // 707
            }                                                                                          // 708
                                                                                                       // 709
            var validatedMethodName =                                                                  // 710
                  '_validated' + method.charAt(0).toUpperCase() + method.slice(1);                     // 711
            args.unshift(this.userId);                                                                 // 712
            method === 'insert' && args.push(generatedId);                                             // 713
            return self[validatedMethodName].apply(self, args);                                        // 714
          } else if (self._isInsecure()) {                                                             // 715
            if (generatedId !== null)                                                                  // 716
              args[0]._id = generatedId;                                                               // 717
            // In insecure mode, allow any mutation (with a simple selector).                          // 718
            // XXX This is kind of bogus.  Instead of blindly passing whatever                         // 719
            //     we get from the network to this function, we should actually                        // 720
            //     know the correct arguments for the function and pass just                           // 721
            //     them.  For example, if you have an extraneous extra null                            // 722
            //     argument and this is Mongo on the server, the _wrapAsync'd                          // 723
            //     functions like update will get confused and pass the                                // 724
            //     "fut.resolver()" in the wrong slot, where _update will never                        // 725
            //     invoke it. Bam, broken DDP connection.  Probably should just                        // 726
            //     take this whole method and write it three times, invoking                           // 727
            //     helpers for the common code.                                                        // 728
            return self._collection[method].apply(self._collection, args);                             // 729
          } else {                                                                                     // 730
            // In secure mode, if we haven't called allow or deny, then nothing                        // 731
            // is permitted.                                                                           // 732
            throw new Meteor.Error(403, "Access denied");                                              // 733
          }                                                                                            // 734
        } catch (e) {                                                                                  // 735
          if (e.name === 'MongoError' || e.name === 'MinimongoError') {                                // 736
            throw new Meteor.Error(409, e.toString());                                                 // 737
          } else {                                                                                     // 738
            throw e;                                                                                   // 739
          }                                                                                            // 740
        }                                                                                              // 741
      };                                                                                               // 742
    });                                                                                                // 743
    // Minimongo on the server gets no stubs; instead, by default                                      // 744
    // it wait()s until its result is ready, yielding.                                                 // 745
    // This matches the behavior of macromongo on the server better.                                   // 746
    // XXX see #MeteorServerNull                                                                       // 747
    if (Meteor.isClient || self._connection === Meteor.server)                                         // 748
      self._connection.methods(m);                                                                     // 749
  }                                                                                                    // 750
};                                                                                                     // 751
                                                                                                       // 752
                                                                                                       // 753
Meteor.Collection.prototype._updateFetch = function (fields) {                                         // 754
  var self = this;                                                                                     // 755
                                                                                                       // 756
  if (!self._validators.fetchAllFields) {                                                              // 757
    if (fields) {                                                                                      // 758
      self._validators.fetch = _.union(self._validators.fetch, fields);                                // 759
    } else {                                                                                           // 760
      self._validators.fetchAllFields = true;                                                          // 761
      // clear fetch just to make sure we don't accidentally read it                                   // 762
      self._validators.fetch = null;                                                                   // 763
    }                                                                                                  // 764
  }                                                                                                    // 765
};                                                                                                     // 766
                                                                                                       // 767
Meteor.Collection.prototype._isInsecure = function () {                                                // 768
  var self = this;                                                                                     // 769
  if (self._insecure === undefined)                                                                    // 770
    return !!Package.insecure;                                                                         // 771
  return self._insecure;                                                                               // 772
};                                                                                                     // 773
                                                                                                       // 774
var docToValidate = function (validator, doc, generatedId) {                                           // 775
  var ret = doc;                                                                                       // 776
  if (validator.transform) {                                                                           // 777
    ret = EJSON.clone(doc);                                                                            // 778
    // If you set a server-side transform on your collection, then you don't get                       // 779
    // to tell the difference between "client specified the ID" and "server                            // 780
    // generated the ID", because transforms expect to get _id.  If you want to                        // 781
    // do that check, you can do it with a specific                                                    // 782
    // `C.allow({insert: f, transform: null})` validator.                                              // 783
    if (generatedId !== null) {                                                                        // 784
      ret._id = generatedId;                                                                           // 785
    }                                                                                                  // 786
    ret = validator.transform(ret);                                                                    // 787
  }                                                                                                    // 788
  return ret;                                                                                          // 789
};                                                                                                     // 790
                                                                                                       // 791
Meteor.Collection.prototype._validatedInsert = function (userId, doc,                                  // 792
                                                         generatedId) {                                // 793
  var self = this;                                                                                     // 794
                                                                                                       // 795
  // call user validators.                                                                             // 796
  // Any deny returns true means denied.                                                               // 797
  if (_.any(self._validators.insert.deny, function(validator) {                                        // 798
    return validator(userId, docToValidate(validator, doc, generatedId));                              // 799
  })) {                                                                                                // 800
    throw new Meteor.Error(403, "Access denied");                                                      // 801
  }                                                                                                    // 802
  // Any allow returns true means proceed. Throw error if they all fail.                               // 803
  if (_.all(self._validators.insert.allow, function(validator) {                                       // 804
    return !validator(userId, docToValidate(validator, doc, generatedId));                             // 805
  })) {                                                                                                // 806
    throw new Meteor.Error(403, "Access denied");                                                      // 807
  }                                                                                                    // 808
                                                                                                       // 809
  // If we generated an ID above, insert it now: after the validation, but                             // 810
  // before actually inserting.                                                                        // 811
  if (generatedId !== null)                                                                            // 812
    doc._id = generatedId;                                                                             // 813
                                                                                                       // 814
  self._collection.insert.call(self._collection, doc);                                                 // 815
};                                                                                                     // 816
                                                                                                       // 817
var transformDoc = function (validator, doc) {                                                         // 818
  if (validator.transform)                                                                             // 819
    return validator.transform(doc);                                                                   // 820
  return doc;                                                                                          // 821
};                                                                                                     // 822
                                                                                                       // 823
// Simulate a mongo `update` operation while validating that the access                                // 824
// control rules set by calls to `allow/deny` are satisfied. If all                                    // 825
// pass, rewrite the mongo operation to use $in to set the list of                                     // 826
// document ids to change ##ValidatedChange                                                            // 827
Meteor.Collection.prototype._validatedUpdate = function(                                               // 828
    userId, selector, mutator, options) {                                                              // 829
  var self = this;                                                                                     // 830
                                                                                                       // 831
  options = options || {};                                                                             // 832
                                                                                                       // 833
  if (!LocalCollection._selectorIsIdPerhapsAsObject(selector))                                         // 834
    throw new Error("validated update should be of a single ID");                                      // 835
                                                                                                       // 836
  // We don't support upserts because they don't fit nicely into allow/deny                            // 837
  // rules.                                                                                            // 838
  if (options.upsert)                                                                                  // 839
    throw new Meteor.Error(403, "Access denied. Upserts not " +                                        // 840
                           "allowed in a restricted collection.");                                     // 841
                                                                                                       // 842
  // compute modified fields                                                                           // 843
  var fields = [];                                                                                     // 844
  _.each(mutator, function (params, op) {                                                              // 845
    if (op.charAt(0) !== '$') {                                                                        // 846
      throw new Meteor.Error(                                                                          // 847
        403, "Access denied. In a restricted collection you can only update documents, not replace them. Use a Mongo update operator, such as '$set'.");
    } else if (!_.has(ALLOWED_UPDATE_OPERATIONS, op)) {                                                // 849
      throw new Meteor.Error(                                                                          // 850
        403, "Access denied. Operator " + op + " not allowed in a restricted collection.");            // 851
    } else {                                                                                           // 852
      _.each(_.keys(params), function (field) {                                                        // 853
        // treat dotted fields as if they are replacing their                                          // 854
        // top-level part                                                                              // 855
        if (field.indexOf('.') !== -1)                                                                 // 856
          field = field.substring(0, field.indexOf('.'));                                              // 857
                                                                                                       // 858
        // record the field we are trying to change                                                    // 859
        if (!_.contains(fields, field))                                                                // 860
          fields.push(field);                                                                          // 861
      });                                                                                              // 862
    }                                                                                                  // 863
  });                                                                                                  // 864
                                                                                                       // 865
  var findOptions = {transform: null};                                                                 // 866
  if (!self._validators.fetchAllFields) {                                                              // 867
    findOptions.fields = {};                                                                           // 868
    _.each(self._validators.fetch, function(fieldName) {                                               // 869
      findOptions.fields[fieldName] = 1;                                                               // 870
    });                                                                                                // 871
  }                                                                                                    // 872
                                                                                                       // 873
  var doc = self._collection.findOne(selector, findOptions);                                           // 874
  if (!doc)  // none satisfied!                                                                        // 875
    return 0;                                                                                          // 876
                                                                                                       // 877
  var factoriedDoc;                                                                                    // 878
                                                                                                       // 879
  // call user validators.                                                                             // 880
  // Any deny returns true means denied.                                                               // 881
  if (_.any(self._validators.update.deny, function(validator) {                                        // 882
    if (!factoriedDoc)                                                                                 // 883
      factoriedDoc = transformDoc(validator, doc);                                                     // 884
    return validator(userId,                                                                           // 885
                     factoriedDoc,                                                                     // 886
                     fields,                                                                           // 887
                     mutator);                                                                         // 888
  })) {                                                                                                // 889
    throw new Meteor.Error(403, "Access denied");                                                      // 890
  }                                                                                                    // 891
  // Any allow returns true means proceed. Throw error if they all fail.                               // 892
  if (_.all(self._validators.update.allow, function(validator) {                                       // 893
    if (!factoriedDoc)                                                                                 // 894
      factoriedDoc = transformDoc(validator, doc);                                                     // 895
    return !validator(userId,                                                                          // 896
                      factoriedDoc,                                                                    // 897
                      fields,                                                                          // 898
                      mutator);                                                                        // 899
  })) {                                                                                                // 900
    throw new Meteor.Error(403, "Access denied");                                                      // 901
  }                                                                                                    // 902
                                                                                                       // 903
  // Back when we supported arbitrary client-provided selectors, we actually                           // 904
  // rewrote the selector to include an _id clause before passing to Mongo to                          // 905
  // avoid races, but since selector is guaranteed to already just be an ID, we                        // 906
  // don't have to any more.                                                                           // 907
                                                                                                       // 908
  return self._collection.update.call(                                                                 // 909
    self._collection, selector, mutator, options);                                                     // 910
};                                                                                                     // 911
                                                                                                       // 912
// Only allow these operations in validated updates. Specifically                                      // 913
// whitelist operations, rather than blacklist, so new complex                                         // 914
// operations that are added aren't automatically allowed. A complex                                   // 915
// operation is one that does more than just modify its target                                         // 916
// field. For now this contains all update operations except '$rename'.                                // 917
// http://docs.mongodb.org/manual/reference/operators/#update                                          // 918
var ALLOWED_UPDATE_OPERATIONS = {                                                                      // 919
  $inc:1, $set:1, $unset:1, $addToSet:1, $pop:1, $pullAll:1, $pull:1,                                  // 920
  $pushAll:1, $push:1, $bit:1                                                                          // 921
};                                                                                                     // 922
                                                                                                       // 923
// Simulate a mongo `remove` operation while validating access control                                 // 924
// rules. See #ValidatedChange                                                                         // 925
Meteor.Collection.prototype._validatedRemove = function(userId, selector) {                            // 926
  var self = this;                                                                                     // 927
                                                                                                       // 928
  var findOptions = {transform: null};                                                                 // 929
  if (!self._validators.fetchAllFields) {                                                              // 930
    findOptions.fields = {};                                                                           // 931
    _.each(self._validators.fetch, function(fieldName) {                                               // 932
      findOptions.fields[fieldName] = 1;                                                               // 933
    });                                                                                                // 934
  }                                                                                                    // 935
                                                                                                       // 936
  var doc = self._collection.findOne(selector, findOptions);                                           // 937
  if (!doc)                                                                                            // 938
    return 0;                                                                                          // 939
                                                                                                       // 940
  // call user validators.                                                                             // 941
  // Any deny returns true means denied.                                                               // 942
  if (_.any(self._validators.remove.deny, function(validator) {                                        // 943
    return validator(userId, transformDoc(validator, doc));                                            // 944
  })) {                                                                                                // 945
    throw new Meteor.Error(403, "Access denied");                                                      // 946
  }                                                                                                    // 947
  // Any allow returns true means proceed. Throw error if they all fail.                               // 948
  if (_.all(self._validators.remove.allow, function(validator) {                                       // 949
    return !validator(userId, transformDoc(validator, doc));                                           // 950
  })) {                                                                                                // 951
    throw new Meteor.Error(403, "Access denied");                                                      // 952
  }                                                                                                    // 953
                                                                                                       // 954
  // Back when we supported arbitrary client-provided selectors, we actually                           // 955
  // rewrote the selector to {_id: {$in: [ids that we found]}} before passing to                       // 956
  // Mongo to avoid races, but since selector is guaranteed to already just be                         // 957
  // an ID, we don't have to any more.                                                                 // 958
                                                                                                       // 959
  return self._collection.remove.call(self._collection, selector);                                     // 960
};                                                                                                     // 961
                                                                                                       // 962
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['mongo-livedata'] = {};

})();

//# sourceMappingURL=9213dc77ff40001575341a02827a8f1ed3200d98.map
