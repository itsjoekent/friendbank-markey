exports.ids = ["pages-EditPage~pages-Homepage"];
exports.modules = {

/***/ "./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var arrayLikeToArray = __webpack_require__(/*! ./arrayLikeToArray */ \"./node_modules/@babel/runtime/helpers/arrayLikeToArray.js\");\n\nfunction _arrayWithoutHoles(arr) {\n  if (Array.isArray(arr)) return arrayLikeToArray(arr);\n}\n\nmodule.exports = _arrayWithoutHoles;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/iterableToArray.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/iterableToArray.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _iterableToArray(iter) {\n  if (typeof Symbol !== \"undefined\" && Symbol.iterator in Object(iter)) return Array.from(iter);\n}\n\nmodule.exports = _iterableToArray;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/iterableToArray.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/nonIterableSpread.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/nonIterableSpread.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _nonIterableSpread() {\n  throw new TypeError(\"Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\");\n}\n\nmodule.exports = _nonIterableSpread;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/nonIterableSpread.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/toConsumableArray.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toConsumableArray.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var arrayWithoutHoles = __webpack_require__(/*! ./arrayWithoutHoles */ \"./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js\");\n\nvar iterableToArray = __webpack_require__(/*! ./iterableToArray */ \"./node_modules/@babel/runtime/helpers/iterableToArray.js\");\n\nvar unsupportedIterableToArray = __webpack_require__(/*! ./unsupportedIterableToArray */ \"./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js\");\n\nvar nonIterableSpread = __webpack_require__(/*! ./nonIterableSpread */ \"./node_modules/@babel/runtime/helpers/nonIterableSpread.js\");\n\nfunction _toConsumableArray(arr) {\n  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();\n}\n\nmodule.exports = _toConsumableArray;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/toConsumableArray.js?");

/***/ }),

/***/ "./src/frontend/components/SplitScreen.js":
/*!************************************************!*\
  !*** ./src/frontend/components/SplitScreen.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return SplitScreen; });\n/* harmony import */ var _babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/taggedTemplateLiteral */ \"./node_modules/@babel/runtime/helpers/taggedTemplateLiteral.js\");\n/* harmony import */ var _babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! styled-components */ \"./node_modules/styled-components/dist/styled-components.esm.js\");\n/* harmony import */ var _Nav__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Nav */ \"./src/frontend/components/Nav.js\");\n\n\nfunction _templateObject() {\n  var data = _babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0___default()([\"\\n  \", \" {\\n    color: \", \";\\n  }\\n\"]);\n\n  _templateObject = function _templateObject() {\n    return data;\n  };\n\n  return data;\n}\n\n\n\n\nvar Layout = styled_components__WEBPACK_IMPORTED_MODULE_2__[\"default\"].div.withConfig({\n  displayName: \"SplitScreen__Layout\",\n  componentId: \"fq8bf5-0\"\n})([\"display:flex;flex-direction:column-reverse;justify-content:flex-end;width:100%;box-shadow:\", \";margin-bottom:48px;@media \", \"{min-height:80vh;}@media \", \"{flex-direction:row;justify-content:flex-start;}\"], function (_ref) {\n  var theme = _ref.theme;\n  return theme.shadow;\n}, function (_ref2) {\n  var theme = _ref2.theme;\n  return theme.media.tablet;\n}, function (_ref3) {\n  var theme = _ref3.theme;\n  return theme.media.desktop;\n});\nvar ContentPanel = styled_components__WEBPACK_IMPORTED_MODULE_2__[\"default\"].main.withConfig({\n  displayName: \"SplitScreen__ContentPanel\",\n  componentId: \"fq8bf5-1\"\n})([\"display:flex;flex-direction:row;width:100%;background-color:\", \";@media \", \"{width:40%;height:100%;overflow-y:scroll;overflow-x:visible;justify-content:center;}\"], function (_ref4) {\n  var theme = _ref4.theme;\n  return theme.colors.white;\n}, function (_ref5) {\n  var theme = _ref5.theme;\n  return theme.media.desktop;\n});\nvar ContentPanelContainer = styled_components__WEBPACK_IMPORTED_MODULE_2__[\"default\"].div.withConfig({\n  displayName: \"SplitScreen__ContentPanelContainer\",\n  componentId: \"fq8bf5-2\"\n})([\"display:flex;flex-direction:column;overflow-x:visible;padding:24px 16px;@media \", \"{width:100%;max-width:500px;padding:32px 24px;overflow-y:scroll;}\"], function (_ref6) {\n  var theme = _ref6.theme;\n  return theme.media.desktop;\n});\nvar MediaPanel = styled_components__WEBPACK_IMPORTED_MODULE_2__[\"default\"].div.withConfig({\n  displayName: \"SplitScreen__MediaPanel\",\n  componentId: \"fq8bf5-3\"\n})([\"display:block;width:100%;height:40vh;position:relative;@media \", \"{height:60vh;}@media \", \"{width:60%;height:auto;}\"], function (_ref7) {\n  var theme = _ref7.theme;\n  return theme.media.tablet;\n}, function (_ref8) {\n  var theme = _ref8.theme;\n  return theme.media.desktop;\n});\nvar MediaImage = styled_components__WEBPACK_IMPORTED_MODULE_2__[\"default\"].img.withConfig({\n  displayName: \"SplitScreen__MediaImage\",\n  componentId: \"fq8bf5-4\"\n})([\"display:block;width:100%;height:100%;object-fit:cover;object-position:center;\"]);\nvar GlobalNavOverride = Object(styled_components__WEBPACK_IMPORTED_MODULE_2__[\"createGlobalStyle\"])(_templateObject(), _Nav__WEBPACK_IMPORTED_MODULE_3__[\"Redirect\"], function (_ref9) {\n  var theme = _ref9.theme;\n  return theme.colors.white;\n});\nfunction SplitScreen(props) {\n  var children = props.children,\n      media = props.media;\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Layout, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(GlobalNavOverride, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(ContentPanel, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(ContentPanelContainer, null, children)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(MediaPanel, null, media && media.type === 'image' && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(MediaImage, {\n    src: media.source,\n    alt: media.alt\n  })));\n}\n\n//# sourceURL=webpack:///./src/frontend/components/SplitScreen.js?");

/***/ }),

/***/ "./src/frontend/hooks/useGetUserRole.js":
/*!**********************************************!*\
  !*** ./src/frontend/hooks/useGetUserRole.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return useGetUserRole; });\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ \"./node_modules/@babel/runtime/helpers/slicedToArray.js\");\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _utils_makeApiRequest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/makeApiRequest */ \"./src/frontend/utils/makeApiRequest.js\");\n\n\n\nfunction useGetUserRole() {\n  var _React$useState = react__WEBPACK_IMPORTED_MODULE_1___default.a.useState(null),\n      _React$useState2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_React$useState, 2),\n      role = _React$useState2[0],\n      setRole = _React$useState2[1];\n\n  react__WEBPACK_IMPORTED_MODULE_1___default.a.useEffect(function () {\n    if (role) return;\n\n    if (localStorage.getItem('role')) {\n      setRole(localStorage.getItem('role'));\n    }\n\n    Object(_utils_makeApiRequest__WEBPACK_IMPORTED_MODULE_2__[\"default\"])('/api/v1/user', 'get', null, false).then(function (_ref) {\n      var json = _ref.json;\n\n      if (!role && json && json.user && json.user.role) {\n        setRole(json.user.role);\n        localStorage.setItem('role', json.user.role);\n      }\n    });\n  }, [role, setRole]);\n  return role;\n}\n\n//# sourceURL=webpack:///./src/frontend/hooks/useGetUserRole.js?");

/***/ }),

/***/ "./src/frontend/utils/makeFormApiRequest.js":
/*!**************************************************!*\
  !*** ./src/frontend/utils/makeFormApiRequest.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return makeFormApiRequest; });\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ \"./node_modules/@babel/runtime/regenerator/index.js\");\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ \"./node_modules/@babel/runtime/helpers/asyncToGenerator.js\");\n/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _getCopy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getCopy */ \"./src/frontend/utils/getCopy.js\");\n/* harmony import */ var _makeApiRequest__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./makeApiRequest */ \"./src/frontend/utils/makeApiRequest.js\");\n\n\n\n\nfunction makeFormApiRequest(_x, _x2, _x3, _x4) {\n  return _makeFormApiRequest.apply(this, arguments);\n}\n\nfunction _makeFormApiRequest() {\n  _makeFormApiRequest = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(path, method, data, afterRequest) {\n    var enableAuthorizationRedirect,\n        _yield$makeApiRequest,\n        errorMessage,\n        json,\n        response,\n        _args = arguments;\n\n    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            enableAuthorizationRedirect = _args.length > 4 && _args[4] !== undefined ? _args[4] : true;\n            _context.prev = 1;\n            _context.next = 4;\n            return Object(_makeApiRequest__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(path, method, data, enableAuthorizationRedirect);\n\n          case 4:\n            _yield$makeApiRequest = _context.sent;\n            errorMessage = _yield$makeApiRequest.errorMessage;\n            json = _yield$makeApiRequest.json;\n            response = _yield$makeApiRequest.response;\n\n            if (!(errorMessage && errorMessage.length)) {\n              _context.next = 10;\n              break;\n            }\n\n            return _context.abrupt(\"return\", errorMessage);\n\n          case 10:\n            if (!afterRequest) {\n              _context.next = 13;\n              break;\n            }\n\n            _context.next = 13;\n            return afterRequest(json, response);\n\n          case 13:\n            return _context.abrupt(\"return\", null);\n\n          case 16:\n            _context.prev = 16;\n            _context.t0 = _context[\"catch\"](1);\n            console.error(_context.t0);\n            return _context.abrupt(\"return\", [Object(_getCopy__WEBPACK_IMPORTED_MODULE_2__[\"default\"])('genericError'), null]);\n\n          case 20:\n          case \"end\":\n            return _context.stop();\n        }\n      }\n    }, _callee, null, [[1, 16]]);\n  }));\n  return _makeFormApiRequest.apply(this, arguments);\n}\n\n//# sourceURL=webpack:///./src/frontend/utils/makeFormApiRequest.js?");

/***/ }),

/***/ "./src/shared/emailFrequency.js":
/*!**************************************!*\
  !*** ./src/shared/emailFrequency.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = {\n  WEEKLY_EMAIL: 'WEEKLY_EMAIL',\n  TRANSACTIONAL_EMAIL: 'TRANSACTIONAL_EMAIL',\n  UNSUBSCRIBED: 'UNSUBSCRIBED'\n};\n\n//# sourceURL=webpack:///./src/shared/emailFrequency.js?");

/***/ }),

/***/ "./src/shared/fieldValidations.js":
/*!****************************************!*\
  !*** ./src/shared/fieldValidations.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var backgrounds = __webpack_require__(/*! ./backgrounds */ \"./src/shared/backgrounds.js\");\n\nvar emailFrequency = __webpack_require__(/*! ./emailFrequency */ \"./src/shared/emailFrequency.js\");\n\nfunction validateName(value) {\n  if (!value) {\n    return 'validations.required';\n  }\n\n  if (value.length > 50) {\n    return 'validations.nameLength';\n  }\n\n  return false;\n}\n\nfunction validateZip(value) {\n  if (!value) {\n    return 'validations.required';\n  }\n\n  if (value.length !== 5) {\n    return 'validations.zipFormat';\n  }\n\n  if (!/^\\d+$/.test(value)) {\n    return 'validations.zipFormat';\n  }\n\n  return false;\n}\n\nfunction validateZipNotRequired(value) {\n  if (!value) {\n    return false;\n  }\n\n  if (value.length !== 5) {\n    return 'validations.zipFormat';\n  }\n\n  if (!/^\\d+$/.test(value)) {\n    return 'validations.zipFormat';\n  }\n\n  return false;\n}\n\nfunction validatePhone(value) {\n  if (!value) {\n    return 'validations.required';\n  }\n\n  if (!/^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$/im.test(value)) {\n    return 'validations.phoneFormat';\n  }\n\n  return false;\n}\n\nfunction validatePhoneNotRequired(value) {\n  if (!value) {\n    return false;\n  }\n\n  if (!/^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$/im.test(value)) {\n    return 'validations.phoneFormat';\n  }\n\n  return false;\n}\n\nfunction validateEmail(value) {\n  if (!value) {\n    return 'validations.required';\n  }\n\n  if (!/\\S+@\\S+\\.\\S+/.test(value)) {\n    return 'validations.emailFormat';\n  }\n\n  return false;\n}\n\nfunction validateEmailNotRequired(value) {\n  if (!value) {\n    return false;\n  }\n\n  if (!/\\S+@\\S+\\.\\S+/.test(value)) {\n    return 'validations.emailFormat';\n  }\n\n  return false;\n}\n\nfunction validateCode(value) {\n  if (!value) {\n    return 'validations.required';\n  }\n\n  if (value.length > 50) {\n    return 'validations.codeLength';\n  }\n\n  if (!/^[a-zA-Z0-9-_]+$/.test(value)) {\n    return 'validations.codeFormat';\n  }\n\n  return false;\n}\n\nfunction validateRequired(value) {\n  if (!value) {\n    return 'validations.required';\n  }\n\n  return false;\n}\n\nfunction validateTitle(value) {\n  if (!value) {\n    return 'validations.required';\n  }\n\n  if (value.length > 450) {\n    return 'validations.titleLength';\n  }\n\n  return false;\n}\n\nfunction validateSubtitle(value) {\n  if (!value) {\n    return 'validations.required';\n  }\n\n  if (value.length > 2000) {\n    return 'validations.subtitleLength';\n  }\n\n  return false;\n}\n\nfunction validateBackground(value) {\n  if (!value) {\n    return 'validations.required';\n  }\n\n  return false;\n}\n\nfunction validateEmailFrequency(value) {\n  if (!value) {\n    return 'validations.required';\n  }\n\n  if (!emailFrequency[value]) {\n    return 'validations.required';\n  }\n\n  return false;\n}\n\nfunction validatePassword(value) {\n  if (!value) {\n    return 'validations.required';\n  }\n\n  if (value.length < 8) {\n    return 'validations.passwordLength';\n  }\n\n  return false;\n}\n\nfunction validateNote(value) {\n  if (value && value.length > 2000) {\n    return 'validations.noteLength';\n  }\n\n  return false;\n}\n\nmodule.exports = {\n  validateName: validateName,\n  validateZip: validateZip,\n  validateZipNotRequired: validateZipNotRequired,\n  validatePhone: validatePhone,\n  validatePhoneNotRequired: validatePhoneNotRequired,\n  validateEmail: validateEmail,\n  validateEmailNotRequired: validateEmailNotRequired,\n  validateCode: validateCode,\n  validateRequired: validateRequired,\n  validateTitle: validateTitle,\n  validateSubtitle: validateSubtitle,\n  validateBackground: validateBackground,\n  validateEmailFrequency: validateEmailFrequency,\n  validatePassword: validatePassword,\n  validateNote: validateNote\n};\n\n//# sourceURL=webpack:///./src/shared/fieldValidations.js?");

/***/ }),

/***/ "./src/shared/roles.js":
/*!*****************************!*\
  !*** ./src/shared/roles.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var USER_ROLE = 'USER_ROLE';\nvar STAFF_ROLE = 'STAFF_ROLE';\nmodule.exports = {\n  USER_ROLE: USER_ROLE,\n  STAFF_ROLE: STAFF_ROLE\n};\n\n//# sourceURL=webpack:///./src/shared/roles.js?");

/***/ })

};;