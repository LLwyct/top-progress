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
    width: '2px',
    color: '#c471f5'
};
var TP = /** @class */ (function () {
    function TP(inputoptions) {
        this.settings = defaultoptions;
        this.settings = __assign(__assign({}, this.settings), inputoptions);
        this.main = this.mount();
        this.init();
    }
    TP.prototype.mount = function () {
        /**
         * 把tp挂载到body上
         */
        var bodyelemet = document.querySelector('body');
        var topprogress = document.createElement('section');
        topprogress.style.height = this.settings.width;
        topprogress.style.transform = "translateX(-100%)";
        topprogress.style.backgroundColor = this.settings.color;
        topprogress.setAttribute('id', 'topprogress');
        topprogress.innerHTML = "\n        <div class=\"bar\">\n        <div class=\"barshadow\"></div>\n        </div>\n        ";
        /**
         * 后续可以作为异常抛出
         */
        if (bodyelemet) {
            bodyelemet.appendChild(topprogress);
        }
        return topprogress;
    };
    TP.prototype.init = function () {
        this.state = 'stop';
        this.lengthpercent = 0;
        this.main.style.transition = "transform " + this.settings.speed + "s ease";
    };
    TP.prototype.changeto = function (pos) {
        /**
         * 可以考虑写成观察者，在修改lengthpercent的同时，同步修改tp的translate属性
         */
        if (pos >= 0 && pos <= 100) {
            this.lengthpercent = pos;
            this.main.style.transform = "translateX(-" + (100 - pos) + "%)";
        }
        return;
    };
    TP.prototype.start = function () {
        this.state = 'run';
        var that = this;
        function run() {
            if (that.state === 'run') {
                if (0 <= that.lengthpercent && that.lengthpercent <= 60) {
                    that.changeto(that.lengthpercent + 10);
                }
                else if (that.lengthpercent <= 75) {
                    that.changeto(that.lengthpercent + 5);
                }
                else if (that.lengthpercent <= 90) {
                    that.changeto(that.lengthpercent + 3);
                }
                else if (that.lengthpercent <= 95) {
                    that.changeto(that.lengthpercent + 1);
                }
                else {
                    return;
                }
                run();
            }
        }
        requestAnimationFrame(run);
    };
    TP.prototype.done = function () {
        var _this = this;
        this.main.style.transition = "transform 0.5s ease";
        this.changeto(100);
        setTimeout(function () {
            _this.lengthpercent = 0;
            _this.changeto(0);
        }, Number(this.settings.speed) * 1000);
    };
    return TP;
}());
