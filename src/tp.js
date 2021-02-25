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
    speed: '1s',
    width: '2px',
    color: '#c471f5'
};
class TP {
    constructor(inputoptions) {
        this.settings = defaultOptions;
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
        topprogress.style.transform = `translateX(-100%)`;
        topprogress.style.backgroundColor = this.settings.color;
        topprogress.setAttribute("id", "topprogress");
        topprogress.innerHTML = `
                <div class="bar">
                    <div class="barshadow"></div>
                </div>
            `;
        /**
         * 后续可以作为异常抛出
         */
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
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let that = this;
            let lp = this.lengthpercent;
            if (pos >= 0 && pos <= 100) {
                let res = yield this.animate({
                    duration: 500,
                    timing(timeFraction) {
                        return timeFraction;
                    },
                    draw(progress) {
                        if (that.lengthpercent < 100) {
                            that.main.style.transform = `translateX(-${100 - (lp + (pos - lp) * progress)}%)`;
                        }
                    },
                });
                this.lengthpercent = pos;
                if (res === false) {
                    resolve(false);
                }
                else {
                    resolve(true);
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
                if (0 <= this.lengthpercent && this.lengthpercent <= 40) {
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
    done() {
        return __awaiter(this, void 0, void 0, function* () {
            this.state = "init";
            let lp = this.lengthpercent;
            this.lengthpercent = 100;
            let that = this;
            yield this.animate({
                duration: 500,
                timing(timeFraction) {
                    return timeFraction;
                },
                draw(progress) {
                    that.main.style.transform = `translateX(-${100 - (lp + (100 - lp) * progress)}%)`;
                },
            });
            this.lengthpercent = 0;
            yield this.animate({
                duration: 500,
                timing(timeFraction) {
                    return timeFraction;
                },
                draw(progress) {
                    that.main.style.transform = `translateX(-${100 * progress}%)`;
                },
            });
            this.state = "stop";
        });
    }
    animate({ timing, draw, duration }) {
        let _this = this;
        return new Promise((resolve) => {
            let start = performance.now();
            requestAnimationFrame(function animate(time) {
                if (_this.state == "run" || _this.state == "init") {
                    let timeFraction = (time - start) / duration;
                    if (timeFraction > 1)
                        timeFraction = 1;
                    let progress = timing(timeFraction);
                    draw(progress);
                    if (timeFraction < 1) {
                        requestAnimationFrame(animate);
                    }
                    else {
                        resolve(true);
                    }
                }
                else {
                    resolve(false);
                }
            });
        });
    }
}
