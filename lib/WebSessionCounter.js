'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function isLocalStorageSupported() {
    var testKey = 'test',
        storage = window.localStorage;
    try {
        storage.setItem(testKey, '1');
        storage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
}

var canUseLocalStorage = isLocalStorageSupported();

var WebSessionCounter = function () {
    function WebSessionCounter() {
        _classCallCheck(this, WebSessionCounter);

        this.update();
    }

    _createClass(WebSessionCounter, [{
        key: 'update',
        value: function update() {
            if (canUseLocalStorage) {
                var count = this.count,
                    time = this.lastActive;

                if (count === 0 || this.isNewSession()) {
                    this.count = count + 1;
                    this.lastActive = new Date();
                    this.lastUtmCampaign = this.currentUtmCampaign;
                }
            }
        }
    }, {
        key: 'isNewSession',
        value: function isNewSession() {
            // use definition from https://support.google.com/analytics/answer/2731565?hl=en

            var time = this.lastActive,
                now = new Date();

            return [(now - time) / 1000 / 60 > 30, now.toDateString() !== time.toDateString(), this.lastUtmCampaign !== this.currentUtmCampaign].some(function (b) {
                return b;
            });
        }
    }, {
        key: 'count',
        get: function get() {
            if (canUseLocalStorage) {
                return Number(window.localStorage.getItem('user_web_session_count'));
            } else {
                return NaN;
            }
        },
        set: function set(val) {
            window.localStorage.setItem('user_web_session_count', val);
        }
    }, {
        key: 'lastActive',
        get: function get() {
            var time = window.localStorage.getItem('user_web_session_last_active');

            if (time) {
                return new Date(time);
            } else {
                return new Date();
            }
        },
        set: function set(time) {
            window.localStorage.setItem('user_web_session_last_active', time.toISOString());
        }
    }, {
        key: 'lastUtmCampaign',
        get: function get() {
            return window.localStorage.getItem('user_web_session_utm_campaign');
        },
        set: function set(val) {
            window.localStorage.setItem('user_web_session_utm_campaign', val);
        }
    }, {
        key: 'currentUtmCampaign',
        get: function get() {
            var _window$location$href = window.location.href.split('?'),
                _window$location$href2 = _slicedToArray(_window$location$href, 2),
                path = _window$location$href2[0],
                _window$location$href3 = _window$location$href2[1],
                query = _window$location$href3 === undefined ? '' : _window$location$href3,
                _querystring$parse = _querystring2.default.parse(query),
                _querystring$parse$ut = _querystring$parse.utm_campaign,
                utm_campaign = _querystring$parse$ut === undefined ? '' : _querystring$parse$ut;

            return utm_campaign;
        }
    }]);

    return WebSessionCounter;
}();

exports.default = new WebSessionCounter();