
    (function (modules) {
      function require(id) {
        const [fn,mapping] =modules[id]
        const localRequire =function (str) {
          const findedId =mapping[str]
          return require(findedId)
        }
        const module ={exports:{}}
         fn(localRequire,module,module.exports)
         return module.exports
      }

      return require(0)
      
    })({
      0:[
        function (require,module,exports) {
          "use strict";

var _message = _interopRequireDefault(require("./message.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
(0, _message["default"])();
setTimeout(function () {
  (0, _message["default"])();
}, 5000); 
        },
        {"./message.js":1}
      ],
    
      1:[
        function (require,module,exports) {
          "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _name = require("./name.js");
function _default() {
  console.log(_name.name);
} 
        },
        {"./name.js":2}
      ],
    
      2:[
        function (require,module,exports) {
          "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.name = void 0;
var name = 'my name is yjl';
exports.name = name;
setTimeout(function () {
  exports.name = name = 'hello';
}, 2000); 
        },
        {}
      ],
    })
  