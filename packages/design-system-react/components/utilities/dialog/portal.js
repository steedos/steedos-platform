"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDom = _interopRequireDefault(require("react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/*
 * This component mounts its children within a disconnected render tree (portal).
 */
var documentDefined = typeof document !== 'undefined';

var Portal = /*#__PURE__*/function (_Component) {
  _inherits(Portal, _Component);

  var _super = _createSuper(Portal);

  function Portal(props) {
    var _this;

    _classCallCheck(this, Portal);

    _this = _super.call(this, props);
    _this.portalNode = null;
    _this.state = {
      isOpen: false
    };
    return _this;
  }

  _createClass(Portal, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.renderPortal();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.renderPortal();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.unmountPortal();
    }
  }, {
    key: "getChildren",
    value: function getChildren() {
      return _react.Children.only(this.props.children);
    }
  }, {
    key: "getPortalParentNode",
    value: function getPortalParentNode() {
      var element;

      if (typeof this.props.renderTo === 'string') {
        element = document.querySelector(this.props.renderTo);
      } else {
        element = this.props.renderTo || documentDefined && document.body;
      }

      return element;
    }
  }, {
    key: "setupPortalNode",
    value: function setupPortalNode() {
      var parentParentNode = this.getPortalParentNode();
      this.portalNode = {};

      if (documentDefined) {
        this.portalNode = document.createElement(this.props.renderTag);
        this.portalNode.setAttribute('style', 'display: block; height: 0px; width: 0px;');
        this.portalNode.setAttribute('className', 'design-system-react-portal');
        parentParentNode.appendChild(this.portalNode);
        this.portalNodeInstance = this.props.onMount ? this.props.onMount(undefined, {
          portal: this.portalNode
        }) : this.portalNode;
      }
    }
  }, {
    key: "unmountPortal",
    value: function unmountPortal() {
      if (this.portalNode) {
        _reactDom.default.unmountComponentAtNode(this.portalNode);

        this.portalNode.parentNode.removeChild(this.portalNode);
      }

      this.portalNode = null;
    }
  }, {
    key: "updatePortal",
    value: function updatePortal() {
      var _this2 = this;

      if (this.props.id) {
        this.portalNode.id = this.props.id;
      }

      if (this.props.className) {
        this.portalNode.className = this.props.className;
      }

      if (this.props.style) {
        Object.keys(this.props.style).forEach(function (key) {
          _this2.portalNode.style[key] = _this2.props.style[key];
        });
      }

      if (this.props.onUpdate) {
        this.portalNodeInstance = this.props.onUpdate(this.portalNodeInstance);
      }
    }
  }, {
    key: "renderPortal",
    value: function renderPortal() {
      var _this3 = this;

      // if no portal contents, then unmount
      if (!this.getChildren() || !documentDefined) {
        this.unmountPortal();
        return;
      }

      if (!this.portalNode) {
        this.setupPortalNode();
      }

      if (this.props.portalMount) {
        this.props.portalMount({
          instance: this,
          reactElement: this.getChildren(),
          domContainerNode: this.portalNode,
          updateCallback: function updateCallback() {
            _this3.updatePortal(); // update after subtree renders

          }
        });
      } else {
        // actual render
        _reactDom.default.unstable_renderSubtreeIntoContainer(this, this.getChildren(), this.portalNode, function () {
          _this3.updatePortal(); // update after subtree renders


          if (_this3.state.isOpen === false) {
            if (_this3.props.onOpen) {
              _this3.props.onOpen(undefined, {
                portal: _this3.getChildren()
              });
            }

            _this3.setState({
              isOpen: true
            });
          }
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      return null;
    }
  }]);

  return Portal;
}(_react.Component);

Portal.displayName = 'Portal';
Portal.propTypes = {
  /*
   * What tag to use for the portal, defaults to `div`.
   */
  renderTag: _propTypes.default.string,

  /*
   * What node the portal is rendered to, defaults to `document.body`.
   */
  renderTo: _propTypes.default.any,

  /*
   * React id prop.
   */
  id: _propTypes.default.string,

  /*
   * Accepts a _single_ element or component.
   */
  children: _propTypes.default.node,

  /*
   * ClassName added to .
   */
  className: _propTypes.default.any,

  /*
   * An object of styles that are applied to the portal.
   */
  style: _propTypes.default.object,

  /*
   * Triggers when Portal render tree mounts. Pass in an undefined event and `{ portal: [node] }``
   */
  onMount: _propTypes.default.func,

  /*
   * Triggers when the portal is mounted.
   */
  onOpen: _propTypes.default.func,

  /*
   * Triggers when Portal re-renders its tree.
   */
  onUpdate: _propTypes.default.func,

  /**
   * If a dialog is `positione="overflowBoundaryElement"`, it will be rendered in a portal or separate render tree. This `portalMount` callback will be triggered instead of the the default `ReactDOM.unstable_renderSubtreeIntoContainer` and the function will mount the portal itself. Consider the following code that bypasses the internal mount and uses an Enzyme wrapper to mount the React root tree to the DOM.
   *
   * ```
   * <Popover
   *   isOpen
   *   portalMount={({ instance, reactElement, domContainerNode }) => {
   *     portalWrapper = Enzyme.mount(reactElement, { attachTo: domContainerNode });
   *   }}
   *   onOpen={() => {
   *     expect(portalWrapper.find(`#my-heading`)).to.exist;
   *     done();
   *   }}
   * />
   * ```
   */
  portalMount: _propTypes.default.func
};
Portal.defaultProps = {
  renderTag: 'span',
  renderTo: null,
  onMount: function onMount() {
    return null;
  },
  onOpen: function onOpen() {
    return null;
  },
  onUpdate: function onUpdate() {
    return null;
  },
  onUnmount: function onUnmount() {
    return null;
  }
};
var _default = Portal;
exports.default = _default;