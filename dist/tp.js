var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
;
let defaultOptions = {
    mounted: 'body',
    width: '2px',
    color: '#22d1ee'
};
class TP {
    constructor(inputoptions) {
        this.settings = defaultOptions;
        /**
         * 初始化进度条相关信息
         */
        this.settings = Object.assign(Object.assign({}, this.settings), inputoptions);
        this.main = this.mount();
        this.init();
    }
    mount() {
        /**
         * 把tp挂载到body上
         */
        let bodyelemet = document.querySelector("body");
        let topprogress = document.createElement("section");
        topprogress.style.height = this.settings.width;
        topprogress.style.backgroundColor = this.settings.color;
        topprogress.setAttribute("id", "topprogress");
        topprogress.innerHTML = `
                    <div class="barshadow"></div>
            `;
        if (bodyelemet) {
            bodyelemet.append(topprogress);
        }
        return topprogress;
    }
    init() {
        this.state = "stop";
        this.lengthpercent = 0;
    }
    changeTo(pos) {
        let that = this;
        let lp = this.lengthpercent;
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            if (pos >= 0 && pos <= 100) {
                let res = yield this.animate({
                    // 每个独立的动画耗时500ms
                    duration: 500,
                    timing(timeFraction) {
                        // linear
                        return timeFraction;
                    },
                    draw(progress) {
                        if (that.lengthpercent <= 100) {
                            that.main.style.width = `${(lp + (pos - lp) * progress)}%`;
                        }
                    },
                });
                if (res.res === false) {
                    that.lengthpercent += (pos - that.lengthpercent) * res.p;
                    resolve(false);
                    return;
                }
                else {
                    that.lengthpercent = pos;
                    resolve(true);
                    return;
                }
            }
        }));
    }
    goto(pos) {
        return __awaiter(this, void 0, void 0, function* () {
            this.state = "init";
            yield this.changeTo(pos);
            this.state = "stop";
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.state = "run";
            while (this.state == "run") {
                let res = true;
                if (0 <= this.lengthpercent && this.lengthpercent <= 30) {
                    res = yield this.changeTo(this.lengthpercent + 10);
                }
                else if (this.lengthpercent <= 75) {
                    res = yield this.changeTo(this.lengthpercent + 6);
                }
                else if (this.lengthpercent <= 90) {
                    res = yield this.changeTo(this.lengthpercent + 3);
                }
                else if (this.lengthpercent <= 95) {
                    res = yield this.changeTo(this.lengthpercent + 1.5);
                }
                else {
                    break;
                }
                if (res === false) {
                    break;
                }
            }
        });
    }
    stop() {
        this.state = 'stop';
    }
    done() {
        return __awaiter(this, void 0, void 0, function* () {
            this.state = 'init';
            yield this.changeTo(100);
            yield this.changeTo(0);
            this.state = "stop";
        });
    }
    animate({ timing, draw, duration }) {
        return new Promise((resolve) => {
            let _this = this;
            let start = performance.now();
            requestAnimationFrame(function animate(time) {
                let timeFraction = (time - start) / duration;
                if (timeFraction > 1)
                    timeFraction = 1;
                let progress = timing(timeFraction);
                if (_this.state == "run" || _this.state == "init") {
                    draw(progress);
                    if (timeFraction < 1) {
                        requestAnimationFrame(animate);
                    }
                    else {
                        resolve({
                            res: true,
                            p: 1
                        });
                        return;
                    }
                }
                else {
                    resolve({
                        res: false,
                        p: progress
                    });
                    return;
                }
            });
        });
    }
}
