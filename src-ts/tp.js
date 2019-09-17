var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
;
var defaultoptions = {
    mounted: 'body',
    speed: '1s',
    width: '2px'
};
var TP = /** @class */ (function () {
    function TP(inputoptions) {
        this.settings = defaultoptions;
        this.settings = __assign(__assign({}, this.settings), inputoptions);
        this.main = this.mount();
        this.init();
    }
    TP.prototype.mount = function () {
        var bodyelemet = document.querySelector('body');
        var topprogress = document.createElement('section');
        topprogress.setAttribute('id', 'topprogress');
        topprogress.innerHTML = "\n            <div class=\"bar\">\n                <div class=\"barshadow\"></div>\n            </div>\n        ";
        bodyelemet.appendChild(topprogress);
        return document.querySelector('#topprogress .bar');
    };
    TP.prototype.init = function () {
        this.state = 'stop';
        this.lengthpercent = 0;
        this.main.style.transform = "translateX(-100%)";
    };
    TP.prototype.changeto = function (pos) {
        if (pos >= 0 && pos <= 100) {
            this.lengthpercent = pos;
            this.main.style.transform = "translateX(-" + (100 - pos) + "%)";
            return;
        }
        else {
            return;
        }
    };
    TP.prototype.start = function () {
        this.state = 'run';
        var that = this;
        function run() {
            setTimeout(function () {
                if (that.state === 'run') {
                    if (that.lengthpercent <= 60 && that.lengthpercent >= 0) {
                        that.changeto(that.lengthpercent + 10);
                    }
                    else if (that.lengthpercent <= 80) {
                        that.changeto(that.lengthpercent + 5);
                    }
                    else if (that.lengthpercent <= 95) {
                        that.changeto(that.lengthpercent + 3);
                    }
                    else {
                        return;
                    }
                    run();
                }
                return;
            }, 1000);
        }
        run();
    };
    TP.prototype.done = function () {
        var _this = this;
        this.changeto(100);
        if (this.settings.speed != '1s') {
            setTimeout(function () { return _this.init(); }, 1000);
        }
        else {
            setTimeout(function () { return _this.init(); }, 1000);
        }
    };
    return TP;
}());
