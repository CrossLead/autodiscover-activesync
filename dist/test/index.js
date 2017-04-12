"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var ava_1 = require("ava");
var index_1 = require("../src/index");
ava_1.default('get auto discover url', function () { return __awaiter(_this, void 0, void 0, function () {
    var emailAddress, password, url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                emailAddress = 'mark.bradley@crosslead.com';
                password = 'PASSWORD';
                return [4 /*yield*/, index_1.default({
                        username: emailAddress,
                        emailAddress: emailAddress,
                        password: password,
                        debug: true
                    })];
            case 1:
                url = _a.sent();
                chai_1.expect(url, 'should find correct active sync url').to.equal('https://outlook.office365.com/Microsoft-Server-ActiveSync');
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlCQWdCRzs7QUFoQkgsNkJBQThCO0FBQzlCLDJCQUF1QjtBQUN2QixzQ0FBd0M7QUFFeEMsYUFBSSxDQUFDLHVCQUF1QixFQUFFO1FBQ3RCLFlBQVksRUFDWixRQUFROzs7OytCQURlLDRCQUE0QjsyQkFDaEMsVUFBVTtnQkFFUixxQkFBTSxlQUFZLENBQUM7d0JBQzVDLFFBQVEsRUFBRyxZQUFZO3dCQUN2QixZQUFZLGNBQUE7d0JBQ1osUUFBUSxVQUFBO3dCQUNSLEtBQUssRUFBRSxJQUFJO3FCQUNaLENBQUMsRUFBQTs7c0JBTHlCLFNBS3pCO2dCQUVGLGFBQU0sQ0FBQyxHQUFHLEVBQUUscUNBQXFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLDJEQUEyRCxDQUFDLENBQUM7Ozs7S0FDMUgsQ0FBQyxDQUFDIn0=