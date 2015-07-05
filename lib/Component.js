var React = require('react');
var path = require('path');

var Component = function Component(opts) {
  this.opts = opts;
  this.path = null;
  this.component = null;
};

Component.prototype.getPath = function getPath(cb) {
  if (this.path) {
    return cb(null, this.path);
  }
  if (!this.opts.path) {
    return cb(new Error('Component missing `path` property'));
  }
  this.path = this.opts.path;
  cb(null, this.path);
};

Component.prototype.getComponent = function getComponent(cb) {
  if (this.component) {
    return cb(null, this.component);
  }

  if (this.opts.component) {
    this.component = this.opts.component;
    return cb(null, this.component);
  }

  this.getPath(function(err, path) {
    if (err) return cb(err);

    if (!path) {
      return cb(new Error('Component options missing `path` and `component` properties'));
    }

    try {
      this.component = require(this.path);
    } catch(err) {
      return cb(err);
    }

    cb(null, this.component);
  }.bind(this));
};

Component.prototype._renderRouter = function _renderRouter(props, location, toStaticMarkup, cb) {
  this.getComponent(function(err, component) {
    if (err) return cb(err);

    var render = (
      toStaticMarkup ? React.renderToStaticMarkup : React.renderToString
    ).bind(React);

    try {
      var markup;
      var routes = component.routes;
      var Router = component.Router;
      var router = component.router;
      var locObj = new component.Location(location);
      Router.run(routes, locObj, function(error, initialState, transition) {
        markup = render(router(initialState, props));
      })
    } catch(err) {
      return cb(err);
    }

    cb(null, markup);
  }.bind(this));
};

Component.prototype.renderToString = function renderToString(props, location, cb) {
  this._renderRouter(props, location, false, cb);
};

Component.prototype.renderToStaticMarkup = function renderToStaticMarkup(props, location, cb) {
  this._renderRouter(props, location, true, cb);
};

module.exports = Component;
