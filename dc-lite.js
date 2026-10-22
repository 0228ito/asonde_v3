/* dc-lite.js — デザインキャンバス(.dc.html)のテンプレートをブラウザ単体で動かす軽量ランタイム */
(function () {
  'use strict';

  function DCLogic(props) {
    this.props = props || {};
    this.state = {};
  }
  DCLogic.prototype.setState = function (patch) {
    var next = typeof patch === 'function' ? patch(this.state, this.props) : patch;
    this.state = Object.assign({}, this.state, next);
    schedule();
  };
  DCLogic.prototype.forceUpdate = function () { schedule(); };
  window.DCLogic = DCLogic;

  var host = null, tpl = null, inst = null, pending = false;
  var WHOLE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;
  var ANY = /\{\{\s*([^}]+?)\s*\}\}/g;

  function schedule() {
    if (pending || !inst) return;
    pending = true;
    requestAnimationFrame(function () { pending = false; render(); });
  }

  function lookup(path, scope) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (path === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    if (/^(['"]).*\1$/.test(path)) return path.slice(1, -1);
    var parts = path.split('.'), v = scope;
    for (var i = 0; i < parts.length; i++) {
      if (v == null) return undefined;
      v = v[parts[i]];
    }
    return v;
  }

  function interp(str, scope) {
    return str.replace(ANY, function (_, p) {
      var v = lookup(p, scope);
      return v == null ? '' : String(v);
    });
  }

  function proc(node, scope, out) {
    if (node.nodeType === 3) {
      out.appendChild(document.createTextNode(interp(node.nodeValue, scope)));
      return;
    }
    if (node.nodeType !== 1) return;
    var tag = node.localName;
    if (tag === 'helmet') return;
    var i, c;
    if (tag === 'sc-for') {
      var lm = WHOLE.exec(node.getAttribute('list') || '');
      var list = lm ? lookup(lm[1], scope) : [];
      var as = node.getAttribute('as') || 'item';
      (list || []).forEach(function (item, idx) {
        var s = Object.create(scope);
        s[as] = item;
        s.$index = idx;
        for (var j = 0; j < node.childNodes.length; j++) proc(node.childNodes[j], s, out);
      });
      return;
    }
    if (tag === 'sc-if') {
      var vm = WHOLE.exec(node.getAttribute('value') || '');
      if (vm && lookup(vm[1], scope)) {
        for (i = 0; i < node.childNodes.length; i++) proc(node.childNodes[i], scope, out);
      }
      return;
    }
    var el = node.cloneNode(false);
    var attrs = Array.prototype.slice.call(node.attributes);
    for (i = 0; i < attrs.length; i++) {
      var name = attrs[i].name, val = attrs[i].value;
      if (/^on[a-z]+$/i.test(name)) {
        el.removeAttribute(name);
        var fm = WHOLE.exec(val);
        var fn = fm ? lookup(fm[1], scope) : null;
        if (typeof fn === 'function') el.addEventListener(name.slice(2).toLowerCase(), fn);
        continue;
      }
      if (name.indexOf('hint-') === 0) { el.removeAttribute(name); continue; }
      if (val.indexOf('{{') >= 0) {
        var am = WHOLE.exec(val);
        var v = am ? lookup(am[1], scope) : interp(val, scope);
        /* "dc-d" のように dc- を付けた属性は、評価後に本来の名前（d）へ戻す（SVGの事前検証エラー回避） */
        var target = name.indexOf('dc-') === 0 ? name.slice(3) : name;
        if (target !== name) el.removeAttribute(name);
        if (v == null || v === false) el.removeAttribute(target);
        else el.setAttribute(target, v === true ? '' : String(v));
      }
    }
    for (i = 0; i < node.childNodes.length; i++) proc(node.childNodes[i], scope, el);
    out.appendChild(el);
  }

  function render() {
    var vals = inst.renderVals ? (inst.renderVals() || {}) : {};
    var frag = document.createDocumentFragment();
    for (var i = 0; i < tpl.childNodes.length; i++) proc(tpl.childNodes[i], vals, frag);
    host.replaceChildren(frag);
    document.body.classList.toggle('has-nav', !!host.querySelector('nav'));
  }

  function init() {
    host = document.querySelector('x-dc');
    if (!host) return;
    var helmet = host.querySelector('helmet');
    if (helmet) {
      Array.prototype.slice.call(helmet.children).forEach(function (c) { document.head.appendChild(c); });
      helmet.remove();
    }
    tpl = document.createDocumentFragment();
    while (host.firstChild) tpl.appendChild(host.firstChild);

    var sc = document.querySelector('script[type="text/x-dc"]');
    var props = {};
    try {
      var dp = JSON.parse(sc.getAttribute('data-props') || '{}');
      Object.keys(dp).forEach(function (k) {
        if (k.charAt(0) !== '$' && dp[k] && 'default' in dp[k]) props[k] = dp[k]['default'];
      });
    } catch (e) { /* 既定値なしで続行 */ }
    var Comp = new Function('DCLogic', sc.textContent + '\n;return Component;')(DCLogic);
    inst = new Comp(props);
    if (!inst.props) inst.props = props;
    render();
    host.style.visibility = 'visible';
    if (typeof inst.componentDidMount === 'function') inst.componentDidMount();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
