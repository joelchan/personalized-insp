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
var Template = Package.templating.Template;
var UI = Package.ui.UI;
var Handlebars = Package.ui.Handlebars;
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var Iron = Package['cmather:iron-core'].Iron;
var HTML = Package.htmljs.HTML;
var Blaze = Package.blaze.Blaze;

/* Package-scope variables */
var findFirstLayout, Layout, DEFAULT_REGION;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                               //
// packages/cmather:iron-layout/blaze_layout_errors.js                                           //
//                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                 //
// If the user still has blaze-layout throw  an error. Let's get rid of that                     // 1
// package so it's not lingering around with all its nastiness.                                  // 2
if (Package['blaze-layout']) {                                                                   // 3
  throw new Error(                                                                               // 4
    "Sorry! The blaze-layout package has been replaced by iron-layout. Please remove the package like this:\n> mrt remove blaze-layout\n> meteor remove blaze-layout"
  );                                                                                             // 6
}                                                                                                // 7
                                                                                                 // 8
///////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                               //
// packages/cmather:iron-layout/template.default_layout.js                                       //
//                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                 //
                                                                                                 // 1
Template.__define__("__IronDefaultLayout__", (function() {                                       // 2
  var view = this;                                                                               // 3
  return Spacebars.include(view.lookupTemplate("yield"));                                        // 4
}));                                                                                             // 5
                                                                                                 // 6
///////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                               //
// packages/cmather:iron-layout/layout.js                                                        //
//                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                 //
/*****************************************************************************/                  // 1
/* Imports */                                                                                    // 2
/*****************************************************************************/                  // 3
var DynamicTemplate = Iron.DynamicTemplate;                                                      // 4
                                                                                                 // 5
/*****************************************************************************/                  // 6
/* Helpers */                                                                                    // 7
/*****************************************************************************/                  // 8
/**                                                                                              // 9
 * Find the first Layout in the rendered parent hierarchy.                                       // 10
 */                                                                                              // 11
findFirstLayout = function (view) {                                                              // 12
  while (view) {                                                                                 // 13
    if (view.kind === 'Iron.Layout')                                                             // 14
      return view.__dynamicTemplate__;                                                           // 15
    else                                                                                         // 16
      view = view.parentView;                                                                    // 17
  }                                                                                              // 18
                                                                                                 // 19
  return null;                                                                                   // 20
};                                                                                               // 21
                                                                                                 // 22
/*****************************************************************************/                  // 23
/* Layout */                                                                                     // 24
/*****************************************************************************/                  // 25
                                                                                                 // 26
/**                                                                                              // 27
 * Dynamically render templates into regions.                                                    // 28
 *                                                                                               // 29
 * Layout inherits from Iron.DynamicTemplate and provides the ability to create                  // 30
 * regions that a user can render templates or content blocks into. The layout                   // 31
 * and each region is an instance of DynamicTemplate so the template and data                    // 32
 * contexts are completely dynamic and programmable in javascript.                               // 33
 */                                                                                              // 34
Layout = function (options) {                                                                    // 35
  var self = this;                                                                               // 36
                                                                                                 // 37
  Layout.__super__.constructor.apply(this, arguments);                                           // 38
                                                                                                 // 39
  options = options || {};                                                                       // 40
  this.kind = 'Iron.Layout';                                                                     // 41
  this._regions = {};                                                                            // 42
  this._regionHooks = {};                                                                        // 43
  this.defaultTemplate('__IronDefaultLayout__');                                                 // 44
                                                                                                 // 45
  // if there's block content then render that                                                   // 46
  // to the main region                                                                          // 47
  if (options.content)                                                                           // 48
    this.render(options.content);                                                                // 49
};                                                                                               // 50
                                                                                                 // 51
/**                                                                                              // 52
 * The default region for a layout where the main content will go.                               // 53
 */                                                                                              // 54
DEFAULT_REGION = Layout.DEFAULT_REGION = 'main';                                                 // 55
                                                                                                 // 56
/**                                                                                              // 57
 * Inherits from Iron.DynamicTemplate which gives us the ability to set the                      // 58
 * template and data context dynamically.                                                        // 59
 */                                                                                              // 60
Meteor._inherits(Layout, Iron.DynamicTemplate);                                                  // 61
                                                                                                 // 62
/**                                                                                              // 63
 * Return the DynamicTemplate instance for a given region. If the region doesn't                 // 64
 * exist it is created.                                                                          // 65
 *                                                                                               // 66
 * The regions object looks like this:                                                           // 67
 *                                                                                               // 68
 *  {                                                                                            // 69
 *    "main": DynamicTemplate,                                                                   // 70
 *    "footer": DynamicTemplate,                                                                 // 71
 *    .                                                                                          // 72
 *    .                                                                                          // 73
 *    .                                                                                          // 74
 *  }                                                                                            // 75
 */                                                                                              // 76
Layout.prototype.region = function (name, options) {                                             // 77
  return this._ensureRegion(name, options);                                                      // 78
};                                                                                               // 79
                                                                                                 // 80
/**                                                                                              // 81
 * Destroy all child regions and reset the regions map.                                          // 82
 */                                                                                              // 83
Layout.prototype.destroyRegions = function () {                                                  // 84
  _.each(this._regions, function (dynamicTemplate) {                                             // 85
    dynamicTemplate.destroy();                                                                   // 86
  });                                                                                            // 87
                                                                                                 // 88
  this._regions = {};                                                                            // 89
};                                                                                               // 90
                                                                                                 // 91
/**                                                                                              // 92
 * Set the template for a region.                                                                // 93
 */                                                                                              // 94
Layout.prototype.render = function (template, options) {                                         // 95
  // having options is usually good                                                              // 96
  options = options || {};                                                                       // 97
                                                                                                 // 98
  // let the user specify the region to render the template into                                 // 99
  var region = options.to || options.region || DEFAULT_REGION;                                   // 100
                                                                                                 // 101
  // get the DynamicTemplate for this region                                                     // 102
  var dynamicTemplate = this.region(region);                                                     // 103
                                                                                                 // 104
  // if we're in a rendering transaction, track that we've rendered this                         // 105
  // particular region                                                                           // 106
  this._trackRenderedRegion(region);                                                             // 107
                                                                                                 // 108
  // set the template value for the dynamic template                                             // 109
  dynamicTemplate.template(template);                                                            // 110
                                                                                                 // 111
  // set the data for the region. If options.data is not defined, this will                      // 112
  // clear the data, which is what we want                                                       // 113
  dynamicTemplate.data(options.data);                                                            // 114
};                                                                                               // 115
                                                                                                 // 116
/**                                                                                              // 117
 * Returns true if the given region is defined and false otherwise.                              // 118
 */                                                                                              // 119
Layout.prototype.has = function (region) {                                                       // 120
  region = region || Layout.DEFAULT_REGION;                                                      // 121
  return !!this._regions[region];                                                                // 122
};                                                                                               // 123
                                                                                                 // 124
/**                                                                                              // 125
 * Returns an array of region keys.                                                              // 126
 */                                                                                              // 127
Layout.prototype.regionKeys = function () {                                                      // 128
  return _.keys(this._regions);                                                                  // 129
};                                                                                               // 130
                                                                                                 // 131
/**                                                                                              // 132
 * Clear a given region or the "main" region by default.                                         // 133
 */                                                                                              // 134
Layout.prototype.clear = function (region) {                                                     // 135
  region = region || Layout.DEFAULT_REGION;                                                      // 136
                                                                                                 // 137
  // we don't want to create a region if it didn't exist before                                  // 138
  if (this.has(region))                                                                          // 139
    this.region(region).template(null);                                                          // 140
                                                                                                 // 141
  // chain it up                                                                                 // 142
  return this;                                                                                   // 143
};                                                                                               // 144
                                                                                                 // 145
/**                                                                                              // 146
 * Clear all regions.                                                                            // 147
 */                                                                                              // 148
Layout.prototype.clearAll = function () {                                                        // 149
  _.each(this._regions, function (dynamicTemplate) {                                             // 150
    dynamicTemplate.template(null);                                                              // 151
  });                                                                                            // 152
                                                                                                 // 153
  // chain it up                                                                                 // 154
  return this;                                                                                   // 155
};                                                                                               // 156
                                                                                                 // 157
/**                                                                                              // 158
 * Start tracking rendered regions.                                                              // 159
 */                                                                                              // 160
Layout.prototype.beginRendering = function (onComplete) {                                        // 161
  var self = this;                                                                               // 162
  if (this._finishRenderingTransaction)                                                          // 163
    this._finishRenderingTransaction();                                                          // 164
                                                                                                 // 165
  this._finishRenderingTransaction = _.once(function () {                                        // 166
    var regions = self._endRendering({flush: false});                                            // 167
    onComplete && onComplete(regions);                                                           // 168
  });                                                                                            // 169
                                                                                                 // 170
  Deps.afterFlush(this._finishRenderingTransaction);                                             // 171
                                                                                                 // 172
  if (this._renderedRegions)                                                                     // 173
    throw new Error("You called beginRendering again before calling endRendering");              // 174
  this._renderedRegions = {};                                                                    // 175
};                                                                                               // 176
                                                                                                 // 177
/**                                                                                              // 178
 * Track a rendered region if we're in a transaction.                                            // 179
 */                                                                                              // 180
Layout.prototype._trackRenderedRegion = function (region) {                                      // 181
  if (!this._renderedRegions)                                                                    // 182
    return;                                                                                      // 183
  this._renderedRegions[region] = true;                                                          // 184
};                                                                                               // 185
                                                                                                 // 186
/**                                                                                              // 187
 * Stop a rendering transaction and retrieve the rendered regions. This                          // 188
 * shouldn't be called directly. Instead, pass an onComplete callback to the                     // 189
 * beginRendering method.                                                                        // 190
 */                                                                                              // 191
Layout.prototype._endRendering = function (opts) {                                               // 192
  // we flush here to ensure all of the {{#contentFor}} inclusions have had a                    // 193
  // chance to render from our templates, otherwise we'll never know about                       // 194
  // them.                                                                                       // 195
  opts = opts || {};                                                                             // 196
  if (opts.flush !== false)                                                                      // 197
    Deps.flush();                                                                                // 198
  var renderedRegions = this._renderedRegions || {};                                             // 199
  this._renderedRegions = null;                                                                  // 200
  return _.keys(renderedRegions);                                                                // 201
};                                                                                               // 202
                                                                                                 // 203
/**                                                                                              // 204
 * View lifecycle hooks for regions.                                                             // 205
 */                                                                                              // 206
_.each(                                                                                          // 207
  [                                                                                              // 208
    'onRegionCreated',                                                                           // 209
    'onRegionMaterialized',                                                                      // 210
    'onRegionRendered',                                                                          // 211
    'onRegionDestroyed'                                                                          // 212
  ],                                                                                             // 213
  function (hook) {                                                                              // 214
    Layout.prototype[hook] = function (cb) {                                                     // 215
      var hooks = this._regionHooks[hook] = this._regionHooks[hook] || [];                       // 216
      hooks.push(cb);                                                                            // 217
      return this;                                                                               // 218
    }                                                                                            // 219
  }                                                                                              // 220
);                                                                                               // 221
                                                                                                 // 222
/**                                                                                              // 223
 * Returns the DynamicTemplate for a given region or creates it if it doesn't                    // 224
 * exists yet.                                                                                   // 225
 */                                                                                              // 226
Layout.prototype._ensureRegion = function (name, options) {                                      // 227
 return this._regions[name] = this._regions[name] || this._createDynamicTemplate(name, options); // 228
};                                                                                               // 229
                                                                                                 // 230
/**                                                                                              // 231
 * Create a new DynamicTemplate instance.                                                        // 232
 */                                                                                              // 233
Layout.prototype._createDynamicTemplate = function (name, options) {                             // 234
  var self = this;                                                                               // 235
  var tmpl = new Iron.DynamicTemplate(options);                                                  // 236
  var capitalize = Iron.utils.capitalize;                                                        // 237
  tmpl._region = name;                                                                           // 238
                                                                                                 // 239
  _.each(['created', 'materialized', 'rendered', 'destroyed'], function (hook) {                 // 240
    hook = capitalize(hook);                                                                     // 241
    tmpl['on' + hook](function (dynamicTemplate) {                                               // 242
      // "this" is the view instance                                                             // 243
      var view = this;                                                                           // 244
      self._runRegionHooks('on' + 'Region' + hook, view, dynamicTemplate);                       // 245
    });                                                                                          // 246
  });                                                                                            // 247
                                                                                                 // 248
  return tmpl;                                                                                   // 249
};                                                                                               // 250
                                                                                                 // 251
Layout.prototype._runRegionHooks = function (name, regionView, regionDynamicTemplate) {          // 252
  var layout = this;                                                                             // 253
  var hooks = this._regionHooks[name] || [];                                                     // 254
  var hook;                                                                                      // 255
                                                                                                 // 256
  for (var i = 0; i < hooks.length; i++) {                                                       // 257
    hook = hooks[i];                                                                             // 258
    // keep the "thisArg" pointing to the view, but make the first parameter to                  // 259
    // the callback teh dynamic template instance.                                               // 260
    hook.call(regionView, regionDynamicTemplate.region, regionDynamicTemplate, this);            // 261
  }                                                                                              // 262
};                                                                                               // 263
                                                                                                 // 264
/*****************************************************************************/                  // 265
/* UI Helpers */                                                                                 // 266
/*****************************************************************************/                  // 267
                                                                                                 // 268
/**                                                                                              // 269
 * Create a region in the closest layout ancestor.                                               // 270
 *                                                                                               // 271
 * Examples:                                                                                     // 272
 *    <aside>                                                                                    // 273
 *      {{> yield "aside"}}                                                                      // 274
 *    </aside>                                                                                   // 275
 *                                                                                               // 276
 *    <article>                                                                                  // 277
 *      {{> yield}}                                                                              // 278
 *    </article>                                                                                 // 279
 *                                                                                               // 280
 *    <footer>                                                                                   // 281
 *      {{> yield "footer"}}                                                                     // 282
 *    </footer>                                                                                  // 283
 */                                                                                              // 284
UI.registerHelper('yield', Template.__create__('yield', function () {                            // 285
  var layout = findFirstLayout(this);                                                            // 286
                                                                                                 // 287
  if (!layout)                                                                                   // 288
    throw new Error("No Iron.Layout found so you can't use yield!");                             // 289
                                                                                                 // 290
  // Example options: {{> yield region="footer"}} or {{> yield "footer"}}                        // 291
  var options = DynamicTemplate.getInclusionArguments(this);                                     // 292
  var region;                                                                                    // 293
  var dynamicTemplate;                                                                           // 294
                                                                                                 // 295
  if (_.isString(options)) {                                                                     // 296
    region = options;                                                                            // 297
  } else if (_.isObject(options)) {                                                              // 298
    region = options.region;                                                                     // 299
  }                                                                                              // 300
                                                                                                 // 301
  // if there's no region specified we'll assume you meant the main region                       // 302
  region = region || DEFAULT_REGION;                                                             // 303
                                                                                                 // 304
  // get or create the region                                                                    // 305
  dynamicTemplate = layout.region(region);                                                       // 306
                                                                                                 // 307
  // if the dynamicTemplate had already been inserted, let's                                     // 308
  // destroy it before creating a new one.                                                       // 309
  if (dynamicTemplate.isCreated)                                                                 // 310
    dynamicTemplate.destroy();                                                                   // 311
                                                                                                 // 312
  // now return a newly created view                                                             // 313
  return dynamicTemplate.create();                                                               // 314
}));                                                                                             // 315
                                                                                                 // 316
/**                                                                                              // 317
 * Render a template into a region in the closest layout ancestor from within                    // 318
 * your template markup.                                                                         // 319
 *                                                                                               // 320
 * Examples:                                                                                     // 321
 *                                                                                               // 322
 *  {{#contentFor "footer"}}                                                                     // 323
 *    Footer stuff                                                                               // 324
 *  {{/contentFor}}                                                                              // 325
 *                                                                                               // 326
 *  {{> contentFor region="footer" template="SomeTemplate" data=someData}}                       // 327
 *                                                                                               // 328
 * Note: The helper is a UI.Component object instead of a function so that                       // 329
 * Meteor UI does not create a Deps.Dependency.                                                  // 330
 */                                                                                              // 331
UI.registerHelper('contentFor', Template.__create__('contentFor', function () {                  // 332
  var layout = findFirstLayout(this);                                                            // 333
                                                                                                 // 334
  if (!layout)                                                                                   // 335
    throw new Error("No Iron.Layout found so you can't use contentFor!");                        // 336
                                                                                                 // 337
  var options = DynamicTemplate.getInclusionArguments(this) || {}                                // 338
  var content = this.templateContentBlock;                                                       // 339
  var template = options.template;                                                               // 340
  var data = options.data;                                                                       // 341
  var region;                                                                                    // 342
                                                                                                 // 343
  if (_.isString(options))                                                                       // 344
    region = options;                                                                            // 345
  else if (_.isObject(options))                                                                  // 346
    region = options.region;                                                                     // 347
  else                                                                                           // 348
    throw new Error("Which region is this contentFor block supposed to be for?");                // 349
                                                                                                 // 350
  // set the region to a provided template or the content directly.                              // 351
  layout.region(region).template(template || content);                                           // 352
                                                                                                 // 353
  // tell the layout to track this as a rendered region if we're in a                            // 354
  // rendering transaction.                                                                      // 355
  layout._trackRenderedRegion(region);                                                           // 356
                                                                                                 // 357
  // if we have some data then set the data context                                              // 358
  if (data)                                                                                      // 359
    layout.region(region).data(data);                                                            // 360
                                                                                                 // 361
  // just render nothing into this area of the page since the dynamic template                   // 362
  // will do the actual rendering into the right region.                                         // 363
  return null;                                                                                   // 364
}));                                                                                             // 365
                                                                                                 // 366
/**                                                                                              // 367
 * Let people use Layout directly from their templates!                                          // 368
 *                                                                                               // 369
 * Example:                                                                                      // 370
 *  {{#Layout template="MyTemplate"}}                                                            // 371
 *    Main content goes here                                                                     // 372
 *                                                                                               // 373
 *    {{#contentFor "footer"}}                                                                   // 374
 *      footer goes here                                                                         // 375
 *    {{/contentFor}}                                                                            // 376
 *  {{/Layout}}                                                                                  // 377
 */                                                                                              // 378
UI.registerHelper('Layout', Template.__create__('layout', function () {                          // 379
  var args = Iron.DynamicTemplate.args(this);                                                    // 380
                                                                                                 // 381
  var layout = new Layout({                                                                      // 382
    template: function () { return args('template'); },                                          // 383
    data: function () { return args('data'); },                                                  // 384
    content: this.templateContentBlock                                                           // 385
  });                                                                                            // 386
                                                                                                 // 387
  return layout.create();                                                                        // 388
}));                                                                                             // 389
                                                                                                 // 390
/*****************************************************************************/                  // 391
/* Namespacing */                                                                                // 392
/*****************************************************************************/                  // 393
Iron.Layout = Layout;                                                                            // 394
                                                                                                 // 395
///////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['cmather:iron-layout'] = {};

})();

//# sourceMappingURL=6de786c2ec886f74226de3be4c69cccc6996aba9.map
