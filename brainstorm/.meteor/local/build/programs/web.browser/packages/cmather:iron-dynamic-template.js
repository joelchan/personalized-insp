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
var Blaze = Package.blaze.Blaze;
var _ = Package.underscore._;
var UI = Package.ui.UI;
var Handlebars = Package.ui.Handlebars;
var Spacebars = Package.spacebars.Spacebars;
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;
var Deps = Package.deps.Deps;
var Template = Package.templating.Template;
var Iron = Package['cmather:iron-core'].Iron;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var debug, camelCase, typeOf, DynamicTemplate;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/cmather:iron-dynamic-template/dynamic_template.js                                                     //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/*****************************************************************************/                                   // 1
/* Imports */                                                                                                     // 2
/*****************************************************************************/                                   // 3
debug = Iron.utils.debug('iron:dynamic-template');                                                                // 4
camelCase = Iron.utils.camelCase;                                                                                 // 5
                                                                                                                  // 6
/*****************************************************************************/                                   // 7
/* Helpers */                                                                                                     // 8
/*****************************************************************************/                                   // 9
typeOf = function (value) {                                                                                       // 10
  return Object.prototype.toString.call(value);                                                                   // 11
};                                                                                                                // 12
                                                                                                                  // 13
/*****************************************************************************/                                   // 14
/* DynamicTemplate */                                                                                             // 15
/*****************************************************************************/                                   // 16
                                                                                                                  // 17
/**                                                                                                               // 18
 * Render a component to the page whose template and data context can change                                      // 19
 * dynamically, either from code or from helpers.                                                                 // 20
 *                                                                                                                // 21
 */                                                                                                               // 22
DynamicTemplate = function (options) {                                                                            // 23
  this.options = options = options || {};                                                                         // 24
  this._template = options.template;                                                                              // 25
  this._defaultTemplate = options.defaultTemplate;                                                                // 26
  this._content = options.content;                                                                                // 27
  this._data = options.data;                                                                                      // 28
  this._templateDep = new Deps.Dependency;                                                                        // 29
  this._dataDep = new Deps.Dependency;                                                                            // 30
  this._hasControllerDep = new Deps.Dependency;                                                                   // 31
  this._hooks = {};                                                                                               // 32
  this._controller = new Blaze.ReactiveVar;                                                                       // 33
  this.kind = options.kind || 'DynamicTemplate';                                                                  // 34
                                                                                                                  // 35
  // has the Blaze.View been created?                                                                             // 36
  this.isCreated = false;                                                                                         // 37
                                                                                                                  // 38
  // has the Blaze.View been destroyed and not created again?                                                     // 39
  this.isDestroyed = false;                                                                                       // 40
};                                                                                                                // 41
                                                                                                                  // 42
/**                                                                                                               // 43
 * Get or set the template.                                                                                       // 44
 */                                                                                                               // 45
DynamicTemplate.prototype.template = function (value) {                                                           // 46
  if (arguments.length === 1 && value !== this._template) {                                                       // 47
    this._template = value;                                                                                       // 48
    this._templateDep.changed();                                                                                  // 49
    return;                                                                                                       // 50
  }                                                                                                               // 51
                                                                                                                  // 52
  if (arguments.length > 0)                                                                                       // 53
    return;                                                                                                       // 54
                                                                                                                  // 55
  this._templateDep.depend();                                                                                     // 56
                                                                                                                  // 57
  // do we have a template?                                                                                       // 58
  if (this._template)                                                                                             // 59
    return (typeof this._template === 'function') ? this._template() : this._template;                            // 60
                                                                                                                  // 61
  // no template? ok let's see if we have a default one set                                                       // 62
  if (this._defaultTemplate)                                                                                      // 63
    return (typeof this._defaultTemplate === 'function') ? this._defaultTemplate() : this._defaultTemplate;       // 64
};                                                                                                                // 65
                                                                                                                  // 66
/**                                                                                                               // 67
 * Get or set the default template.                                                                               // 68
 *                                                                                                                // 69
 * This function does not change any dependencies.                                                                // 70
 */                                                                                                               // 71
DynamicTemplate.prototype.defaultTemplate = function (value) {                                                    // 72
  if (arguments.length === 1)                                                                                     // 73
    this._defaultTemplate = value;                                                                                // 74
  else                                                                                                            // 75
    return this._defaultTemplate;                                                                                 // 76
};                                                                                                                // 77
                                                                                                                  // 78
                                                                                                                  // 79
/**                                                                                                               // 80
 * Clear the template and data contexts.                                                                          // 81
 */                                                                                                               // 82
DynamicTemplate.prototype.clear = function () {                                                                   // 83
  //XXX do we need to clear dependencies here too?                                                                // 84
  this._template = undefined;                                                                                     // 85
  this._data = undefined;                                                                                         // 86
  this._templateDep.changed();                                                                                    // 87
};                                                                                                                // 88
                                                                                                                  // 89
                                                                                                                  // 90
/**                                                                                                               // 91
 * Get or set the data context.                                                                                   // 92
 */                                                                                                               // 93
DynamicTemplate.prototype.data = function (value) {                                                               // 94
  if (arguments.length === 1 && value !== this._data) {                                                           // 95
    this._data = value;                                                                                           // 96
    this._dataDep.changed();                                                                                      // 97
    return;                                                                                                       // 98
  }                                                                                                               // 99
                                                                                                                  // 100
  this._dataDep.depend();                                                                                         // 101
  return typeof this._data === 'function' ? this._data() : this._data;                                            // 102
};                                                                                                                // 103
                                                                                                                  // 104
/**                                                                                                               // 105
 * Create the view if it hasn't been created yet.                                                                 // 106
 */                                                                                                               // 107
DynamicTemplate.prototype.create = function (options) {                                                           // 108
  var self = this;                                                                                                // 109
                                                                                                                  // 110
  if (this.isCreated) {                                                                                           // 111
    throw new Error("DynamicTemplate view is already created");                                                   // 112
  }                                                                                                               // 113
                                                                                                                  // 114
  this.isCreated = true;                                                                                          // 115
  this.isDestroyed = false;                                                                                       // 116
                                                                                                                  // 117
  var templateVar = Blaze.ReactiveVar(null);                                                                      // 118
                                                                                                                  // 119
  var view = Blaze.View('DynamicTemplate', function () {                                                          // 120
    var thisView = this;                                                                                          // 121
    var template = templateVar.get();                                                                             // 122
                                                                                                                  // 123
    return Blaze.With(function () {                                                                               // 124
      debug(self.kind + " <region: " + (self._region || "none") + "> data computation: " + Deps.currentComputation._id);
      // NOTE: This will rerun anytime the data function invalidates this                                         // 126
      // computation OR if created from an inclusion helper (see note below) any                                  // 127
      // time any of the argument functions invlidate the computation. For                                        // 128
      // example, when the template changes this function will rerun also. But                                    // 129
      // it's probably generally ok. The more serious use case is to not                                          // 130
      // re-render the entire template every time the data context changes.                                       // 131
      var result = self.data();                                                                                   // 132
                                                                                                                  // 133
      if (typeof result !== 'undefined')                                                                          // 134
        // looks like data was set directly on this dynamic template                                              // 135
        return result;                                                                                            // 136
      else                                                                                                        // 137
        // return the first parent data context that is not inclusion arguments                                   // 138
        return DynamicTemplate.getParentDataContext(thisView);                                                    // 139
    }, function () {                                                                                              // 140
      // NOTE: When DynamicTemplate is used from a template inclusion helper                                      // 141
      // like this {{> DynamicTemplate template=getTemplate data=getData}} the                                    // 142
      // function below will rerun any time the getData function invalidates the                                  // 143
      // argument data computation. BUT, Spacebars.include will only re-render                                    // 144
      // the template if the template has actually changed. This is why we use                                    // 145
      // Spacebars.include here: To create a computation, and to only re-render                                   // 146
      // if the template changes.                                                                                 // 147
      debug(self.kind + " <region: " + (self._region || "none") + "> spacebars include: " + Deps.currentComputation._id);
                                                                                                                  // 149
      var tmpl = null;                                                                                            // 150
                                                                                                                  // 151
      // is it a template name like "MyTemplate"?                                                                 // 152
      if (typeof template === 'string') {                                                                         // 153
        tmpl = Template[template];                                                                                // 154
                                                                                                                  // 155
        if (!tmpl)                                                                                                // 156
          // as a fallback double check the user didn't actually define                                           // 157
          // a camelCase version of the template.                                                                 // 158
          tmpl = Template[camelCase(template)];                                                                   // 159
                                                                                                                  // 160
        if (!tmpl)                                                                                                // 161
          throw new Error("Couldn't find a template named " + JSON.stringify(template) + " or " + JSON.stringify(camelCase(template))+ ". Are you sure you defined it?");
      } else if (typeOf(template) === '[object Object]') {                                                        // 163
        // or maybe a view already?                                                                               // 164
        tmpl = template;                                                                                          // 165
      } else if (typeof self._content !== 'undefined') {                                                          // 166
        // or maybe its block content like                                                                        // 167
        // {{#DynamicTemplate}}                                                                                   // 168
        //  Some block                                                                                            // 169
        // {{/DynamicTemplate}}                                                                                   // 170
        tmpl = self._content;                                                                                     // 171
      }                                                                                                           // 172
                                                                                                                  // 173
      return tmpl;                                                                                                // 174
    });                                                                                                           // 175
  });                                                                                                             // 176
                                                                                                                  // 177
  view.onCreated(function () {                                                                                    // 178
    this.autorun(function () {                                                                                    // 179
      templateVar.set(self.template());                                                                           // 180
    });                                                                                                           // 181
  });                                                                                                             // 182
                                                                                                                  // 183
  // wire up the view lifecycle callbacks                                                                         // 184
  _.each(['onCreated', 'onMaterialized', 'onRendered', 'onDestroyed'], function (hook) {                          // 185
    view[hook](function () {                                                                                      // 186
      // "this" is the view instance                                                                              // 187
      self._runHooks(hook, this);                                                                                 // 188
    });                                                                                                           // 189
  });                                                                                                             // 190
                                                                                                                  // 191
  view.onMaterialized(function () {                                                                               // 192
    // avoid inserting the view twice by accident.                                                                // 193
    self.isInserted = true;                                                                                       // 194
  });                                                                                                             // 195
                                                                                                                  // 196
  this.view = view;                                                                                               // 197
  view.__dynamicTemplate__ = this;                                                                                // 198
  view.kind = this.kind;                                                                                          // 199
  return view;                                                                                                    // 200
};                                                                                                                // 201
                                                                                                                  // 202
/**                                                                                                               // 203
 * Destroy the dynamic template, also destroying the view if it exists.                                           // 204
 */                                                                                                               // 205
DynamicTemplate.prototype.destroy = function () {                                                                 // 206
  if (this.isCreated) {                                                                                           // 207
    Blaze.destroyView(this.view);                                                                                 // 208
    this.view = null;                                                                                             // 209
    this.isDestroyed = true;                                                                                      // 210
    this.isCreated = false;                                                                                       // 211
  }                                                                                                               // 212
};                                                                                                                // 213
                                                                                                                  // 214
/**                                                                                                               // 215
 * View lifecycle hooks.                                                                                          // 216
 */                                                                                                               // 217
_.each(['onCreated', 'onMaterialized', 'onRendered', 'onDestroyed'], function (hook) {                            // 218
  DynamicTemplate.prototype[hook] = function (cb) {                                                               // 219
    var hooks = this._hooks[hook] = this._hooks[hook] || [];                                                      // 220
    hooks.push(cb);                                                                                               // 221
    return this;                                                                                                  // 222
  };                                                                                                              // 223
});                                                                                                               // 224
                                                                                                                  // 225
DynamicTemplate.prototype._runHooks = function (name, view) {                                                     // 226
  var hooks = this._hooks[name] || [];                                                                            // 227
  var hook;                                                                                                       // 228
                                                                                                                  // 229
  for (var i = 0; i < hooks.length; i++) {                                                                        // 230
    hook = hooks[i];                                                                                              // 231
    // keep the "thisArg" pointing to the view, but make the first parameter to                                   // 232
    // the callback teh dynamic template instance.                                                                // 233
    hook.call(view, this);                                                                                        // 234
  }                                                                                                               // 235
};                                                                                                                // 236
                                                                                                                  // 237
/**                                                                                                               // 238
 * Insert the Layout view into the dom.                                                                           // 239
 */                                                                                                               // 240
DynamicTemplate.prototype.insert = function (options) {                                                           // 241
  options = options || {};                                                                                        // 242
                                                                                                                  // 243
  if (this.isInserted)                                                                                            // 244
    return;                                                                                                       // 245
  this.isInserted = true;                                                                                         // 246
                                                                                                                  // 247
  var el = options.el || document.body;                                                                           // 248
  var $el = $(el);                                                                                                // 249
                                                                                                                  // 250
  if ($el.length === 0)                                                                                           // 251
    throw new Error("No element to insert layout into. Is your element defined? Try a Meteor.startup callback."); // 252
                                                                                                                  // 253
  if (!this.view)                                                                                                 // 254
    this.create(options);                                                                                         // 255
                                                                                                                  // 256
  if (!this.range)                                                                                                // 257
    this.range = Blaze.render(this.view, options.parentView);                                                     // 258
                                                                                                                  // 259
  this.range.attach($el[0], options.nextNode);                                                                    // 260
  return this;                                                                                                    // 261
};                                                                                                                // 262
                                                                                                                  // 263
/**                                                                                                               // 264
 * Reactively return the value of the current controller.                                                         // 265
 */                                                                                                               // 266
DynamicTemplate.prototype.getController = function () {                                                           // 267
  return this._controller.get();                                                                                  // 268
};                                                                                                                // 269
                                                                                                                  // 270
/**                                                                                                               // 271
 * Set the reactive value of the controller.                                                                      // 272
 */                                                                                                               // 273
DynamicTemplate.prototype.setController = function (controller) {                                                 // 274
  var didHaveController = !!this._hasController;                                                                  // 275
  this._hasController = (typeof controller !== 'undefined');                                                      // 276
                                                                                                                  // 277
  if (didHaveController !== this._hasController)                                                                  // 278
    this._hasControllerDep.changed();                                                                             // 279
                                                                                                                  // 280
  return this._controller.set(controller);                                                                        // 281
};                                                                                                                // 282
                                                                                                                  // 283
/**                                                                                                               // 284
 * Reactively returns true if the template has a controller and false otherwise.                                  // 285
 */                                                                                                               // 286
DynamicTemplate.prototype.hasController = function () {                                                           // 287
  this._hasControllerDep.depend();                                                                                // 288
  return this._hasController;                                                                                     // 289
};                                                                                                                // 290
                                                                                                                  // 291
/*****************************************************************************/                                   // 292
/* DynamicTemplate Static Methods */                                                                              // 293
/*****************************************************************************/                                   // 294
                                                                                                                  // 295
/**                                                                                                               // 296
 * Get the first parent data context that are not inclusion arguments                                             // 297
 * (see above function). Note: This function can create reactive dependencies.                                    // 298
 */                                                                                                               // 299
DynamicTemplate.getParentDataContext = function (view) {                                                          // 300
  // start off with the parent.                                                                                   // 301
  view = view.parentView;                                                                                         // 302
                                                                                                                  // 303
  while (view) {                                                                                                  // 304
    if (view.kind === 'with' && !view.__isTemplateWith)                                                           // 305
      return view.dataVar.get();                                                                                  // 306
    else                                                                                                          // 307
      view = view.parentView;                                                                                     // 308
  }                                                                                                               // 309
                                                                                                                  // 310
  return null;                                                                                                    // 311
};                                                                                                                // 312
                                                                                                                  // 313
                                                                                                                  // 314
/**                                                                                                               // 315
 * Get inclusion arguments, if any, from a view.                                                                  // 316
 *                                                                                                                // 317
 * Uses the __isTemplateWith property set when a parent view is used                                              // 318
 * specificially for a data context with inclusion args.                                                          // 319
 *                                                                                                                // 320
 * Inclusion arguments are arguments provided in a template like this:                                            // 321
 * {{> yield "inclusionArg"}}                                                                                     // 322
 * or                                                                                                             // 323
 * {{> yield region="inclusionArgValue"}}                                                                         // 324
 */                                                                                                               // 325
DynamicTemplate.getInclusionArguments = function (view) {                                                         // 326
  var parent = view && view.parentView;                                                                           // 327
                                                                                                                  // 328
  if (!parent)                                                                                                    // 329
    return null;                                                                                                  // 330
                                                                                                                  // 331
  if (parent.__isTemplateWith && parent.kind === 'with')                                                          // 332
    return parent.dataVar.get();                                                                                  // 333
                                                                                                                  // 334
  return null;                                                                                                    // 335
};                                                                                                                // 336
                                                                                                                  // 337
/**                                                                                                               // 338
 * Given a view, return a function that can be used to access argument values at                                  // 339
 * the time the view was rendered. There are two key benefits:                                                    // 340
 *                                                                                                                // 341
 * 1. Save the argument data at the time of rendering. When you use lookup(...)                                   // 342
 *    it starts from the current data context which can change.                                                   // 343
 * 2. Defer creating a dependency on inclusion arguments until later.                                             // 344
 *                                                                                                                // 345
 * Example:                                                                                                       // 346
 *                                                                                                                // 347
 *   {{> MyTemplate template="MyTemplate"                                                                         // 348
 *   var args = DynamicTemplate.args(view);                                                                       // 349
 *   var tmplValue = args('template');                                                                            // 350
 *     => "MyTemplate"                                                                                            // 351
 */                                                                                                               // 352
DynamicTemplate.args = function (view) {                                                                          // 353
  return function (key) {                                                                                         // 354
    var data = DynamicTemplate.getInclusionArguments(view);                                                       // 355
                                                                                                                  // 356
    if (data) {                                                                                                   // 357
      if (key)                                                                                                    // 358
        return data[key];                                                                                         // 359
      else                                                                                                        // 360
        return data;                                                                                              // 361
    }                                                                                                             // 362
                                                                                                                  // 363
    return null;                                                                                                  // 364
  };                                                                                                              // 365
};                                                                                                                // 366
                                                                                                                  // 367
/*****************************************************************************/                                   // 368
/* UI Helpers */                                                                                                  // 369
/*****************************************************************************/                                   // 370
UI.registerHelper('DynamicTemplate', Template.__create__('DynamicTemplateHelper', function () {                   // 371
  var args = DynamicTemplate.args(this);                                                                          // 372
                                                                                                                  // 373
  return new DynamicTemplate({                                                                                    // 374
    data: function () { return args('data'); },                                                                   // 375
    template: function () { return args('template'); },                                                           // 376
    content: this.templateContentBlock                                                                            // 377
  }).create();                                                                                                    // 378
}));                                                                                                              // 379
                                                                                                                  // 380
/*****************************************************************************/                                   // 381
/* Namespacing */                                                                                                 // 382
/*****************************************************************************/                                   // 383
Iron.DynamicTemplate = DynamicTemplate;                                                                           // 384
                                                                                                                  // 385
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['cmather:iron-dynamic-template'] = {};

})();

//# sourceMappingURL=f77af893ec5baab5f8205614325355553b5d0e48.map
