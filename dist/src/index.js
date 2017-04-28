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
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request-promise");
var denodeify = require("denodeify");
var dns = require("dns");
var xml2js_1 = require("xml2js");
var dnsResolve = denodeify(dns.resolve);
var parseString = denodeify(xml2js_1.parseString);
/**
 * Removes the potential prefix of a string and makes the first character
 * lower case to make it easier to work with.
 *
 * @param {String} string
 * @returns {String}
 */
function removePrefix(s) {
    var splitString = s.split(':');
    var withoutPrefix = splitString[1] || splitString[0];
    return withoutPrefix.charAt(0).toLowerCase() + withoutPrefix.slice(1);
}
function xmlToJson(xmlString) {
    return parseString(xmlString, {
        tagNameProcessors: [removePrefix],
        attrNameProcessors: [removePrefix],
        explicitArray: false,
        mergeAttrs: true
    });
}
function parseAutodiscoverResponse(json) {
    // TODO: use lodash _.get()?
    return json &&
        json.autodiscover &&
        json.autodiscover.response &&
        json.autodiscover.response.action &&
        json.autodiscover.response.action.settings &&
        json.autodiscover.response.action.settings.server &&
        json.autodiscover.response.action.settings.server.url;
}
function queryDns(domain, debug) {
    return __awaiter(this, void 0, void 0, function () {
        var response, names, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, dnsResolve("_autodiscover._tcp." + domain, 'SRV')];
                case 1:
                    response = _a.sent();
                    names = response.map(function (e) { return e.name; });
                    if (debug) {
                        console.log('queryDns, names', names);
                    }
                    return [2 /*return*/, names];
                case 2:
                    err_1 = _a.sent();
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getResponse(url, username, password, requestBody, debug) {
    return __awaiter(this, void 0, void 0, function () {
        var response, body, json;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request({
                        uri: url,
                        method: 'POST',
                        headers: {
                            'Content-Type': 'text/xml; charset=utf-8'
                        },
                        auth: {
                            user: username,
                            pass: password
                        },
                        body: requestBody,
                        followRedirect: false,
                        resolveWithFullResponse: true
                    }).catch(function (err) {
                        if (debug) {
                            console.log('Error in response', err);
                        }
                        return null;
                    })];
                case 1:
                    response = _a.sent();
                    if (!response) {
                        if (debug) {
                            console.log('NO RESPONSE for URL', url);
                        }
                        return [2 /*return*/, null];
                    }
                    body = response.body;
                    return [4 /*yield*/, xmlToJson(body)];
                case 2:
                    json = _a.sent();
                    if (debug) {
                        // console.log('RESPONSE', response);
                        console.log(JSON.stringify(json, null, 2));
                    }
                    if (!json.autodiscover.response.error) {
                        if (debug) {
                            console.log('GOOD', url);
                        }
                        return [2 /*return*/, json];
                    }
                    if (debug) {
                        console.log('NO GOOD', url);
                    }
                    return [2 /*return*/, null];
            }
        });
    });
}
function createAutodiscoverXml(emailAddress) {
    // Exchange XML parsing doesn't trim spaces: http://stackoverflow.com/questions/41825653/errors-during-autodiscover-procedure-on-microsoft-exchange-2016#comment70878946_41825653
    return "\n<Autodiscover xmlns=\"http://schemas.microsoft.com/exchange/autodiscover/mobilesync/requestschema/2006\">\n  <Request>\n    <EMailAddress>" + emailAddress + "</EMailAddress>\n    <AcceptableResponseSchema>http://schemas.microsoft.com/exchange/autodiscover/mobilesync/responseschema/2006</AcceptableResponseSchema>\n  </Request>\n</Autodiscover>";
}
/**
 * Tries differently possible autodiscover urls.
 *
 * https://msdn.microsoft.com/en-us/library/office/jj900169(v=exchg.150).aspx
 * https://msdn.microsoft.com/en-us/library/office/hh352638(v=exchg.140).aspx
 *
 * @param {String[]} domains
 * @param {String} emailAddress
 * @param {String} password
 * @param {String} username
 * @param {Boolean} debug
 *
 */
function autodiscoverDomains(domains, emailAddress, password, username, debug) {
    return __awaiter(this, void 0, void 0, function () {
        var requestBody, autodiscoverUrl, _i, domains_1, domain, json, redirectUri, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    requestBody = createAutodiscoverXml(emailAddress);
                    if (debug) {
                        console.log('Request XML', requestBody);
                    }
                    _i = 0, domains_1 = domains;
                    _a.label = 1;
                case 1:
                    if (!(_i < domains_1.length)) return [3 /*break*/, 7];
                    domain = domains_1[_i];
                    return [4 /*yield*/, getResponse("https://" + domain + "/autodiscover/autodiscover.xml", username, password, requestBody, debug)];
                case 2:
                    json = _a.sent();
                    if ((autodiscoverUrl = parseAutodiscoverResponse(json))) {
                        return [2 /*return*/, autodiscoverUrl];
                    }
                    return [4 /*yield*/, getResponse("https://autodiscover." + domain + "/autodiscover/autodiscover.xml", username, password, requestBody, debug)];
                case 3:
                    json = _a.sent();
                    if ((autodiscoverUrl = parseAutodiscoverResponse(json))) {
                        return [2 /*return*/, autodiscoverUrl];
                    }
                    redirectUri = "http://autodiscover." + domain + "/autodiscover/autodiscover.xml";
                    return [4 /*yield*/, request({
                            uri: redirectUri,
                            method: 'GET',
                            followRedirect: false,
                            simple: false,
                            resolveWithFullResponse: true
                        })];
                case 4:
                    response = _a.sent();
                    if (response.statusCode !== 302) {
                        throw new Error("Redirect method: " + redirectUri + " did not return status 302");
                    }
                    if (!response.headers.location) {
                        throw new Error("Redirect method: " + redirectUri + " did not include Location header");
                    }
                    return [4 /*yield*/, getResponse(response.headers.location, username, password, requestBody, debug)];
                case 5:
                    json = _a.sent();
                    if ((autodiscoverUrl = parseAutodiscoverResponse(json))) {
                        return [2 /*return*/, autodiscoverUrl];
                    }
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/, null];
            }
        });
    });
}
/**
 * Tries to find the url of the Active Sync Server.
 *
 * @param {Object} params
 * @param {String} [params.emailAddress]
 * @param {String} [params.password]
 * @param {String} [params.username]
 * @param {Boolean} [params.queryDns]
 * @param {Boolean} [params.debug]
 */
function autodiscover(params) {
    return __awaiter(this, void 0, void 0, function () {
        var emailAddress, password, _a, username, _b, query, _c, debug, domain, domains, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    emailAddress = params.emailAddress, password = params.password, _a = params.username, username = _a === void 0 ? params.emailAddress : _a, _b = params.queryDns, query = _b === void 0 ? true : _b, _c = params.debug, debug = _c === void 0 ? false : _c;
                    domain = emailAddress.substr(emailAddress.indexOf('@') + 1);
                    domains = [domain];
                    if (!query) return [3 /*break*/, 2];
                    _e = (_d = domains.concat).apply;
                    _f = [domains];
                    return [4 /*yield*/, queryDns(domain, debug)];
                case 1:
                    domains = _e.apply(_d, _f.concat([_g.sent()]));
                    _g.label = 2;
                case 2: return [4 /*yield*/, autodiscoverDomains(domains, emailAddress, password, username, debug)];
                case 3: return [2 /*return*/, _g.sent()];
            }
        });
    });
}
;
exports.default = autodiscover;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUEyQztBQUMzQyxxQ0FBdUM7QUFDdkMseUJBQTJCO0FBQzNCLGlDQUlnQjtBQWNoQixJQUFNLFVBQVUsR0FBMEIsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqRSxJQUFNLFdBQVcsR0FBMkIsU0FBUyxDQUFDLG9CQUFhLENBQUMsQ0FBQztBQUVyRTs7Ozs7O0dBTUc7QUFDSCxzQkFBc0IsQ0FBUztJQUM3QixJQUFNLFdBQVcsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pDLElBQU0sYUFBYSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4RSxDQUFDO0FBRUQsbUJBQW1CLFNBQWlCO0lBQ2xDLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFO1FBQzVCLGlCQUFpQixFQUFFLENBQUMsWUFBWSxDQUFDO1FBQ2pDLGtCQUFrQixFQUFFLENBQUMsWUFBWSxDQUFDO1FBQ2xDLGFBQWEsRUFBRSxLQUFLO1FBQ3BCLFVBQVUsRUFBRSxJQUFJO0tBQ2pCLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxtQ0FBbUMsSUFBUztJQUMxQyw0QkFBNEI7SUFDNUIsTUFBTSxDQUFDLElBQUk7UUFDVCxJQUFJLENBQUMsWUFBWTtRQUNqQixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVE7UUFDMUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsTUFBTTtR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