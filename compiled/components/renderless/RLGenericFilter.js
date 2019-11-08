"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  name: 'RLGenericFilter',
  inject: ['opts', 'theme', 'source', 'search', 'query', 'display', 'id'],
  render: function render() {
    return this.$scopedSlots["default"]({
      theme: this.theme,
      search: this.search,
      query: this.query(),
      display: this.display,
      id: this.id
    });
  }
};
exports["default"] = _default;