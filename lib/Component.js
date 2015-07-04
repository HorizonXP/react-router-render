var React = require('react');
var path = require('path');
var Router = require('react-router').Router;
var Location = require('react-router/lib/Location');
var _ = require('lodash');

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
      Router.run(component, new Location(location), function(error, initialState, transition) {
        initialState['createElement'] = function(Component, objProps) {
          return React.createElement(Component, _.extend(props, objProps));
        };
        markup = render(React.createElement(Router, initialState));
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
