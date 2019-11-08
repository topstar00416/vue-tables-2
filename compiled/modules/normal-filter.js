"use strict";

var debounce = require('debounce');

module.exports = function (h) {
  var _this = this;

  return function (classes, id) {
    var search = _this.source == 'client' ? _this.search.bind(_this, _this.data) : _this.serverSearch.bind(_this);
    return h("input", {
      "class": "VueTables__search__input ".concat(classes.input, " ").concat(classes.small),
      attrs: {
        type: "text",
        placeholder: _this.display('filterPlaceholder'),
<<<<<<< HEAD
        id: "VueTables__search_".concat(props.id)
      },
      domProps: {
        "value": _this.query
=======
        id: id,
        autocomplete: "off"
>>>>>>> master
      },
      on: {
        "keyup": _this.opts.debounce ? debounce(search, _this.opts.debounce) : search
      }
    });
  };
};