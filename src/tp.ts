interface Options {
    mounted?: string
    speed?: string
    width?: string
    color?: string
};

interface pres {
    res: Boolean,
    p: number
}
let defaultOptions: Options = {
    mounted: 'body',
    width: '2px',
    color: '#22d1ee'
};

class TP {
    private main: HTMLElement;
    private state: string;
    private lengthpercent: number;
    private settings: Options = defaultOptions;

    constructor(inputoptions: Options) {
        /**
         * 初始化进度条相关信息
         */
        this.settings = { ...this.settings, ...inputoptions };
        this.main = this.mount();
        this.init();
    }

    mount(): HTMLElement {
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

    init(): void {
        this.state = "stop";
        this.lengthpercent = 0;
    }

    changeTo(pos: number): Promise<boolean> {
        let that = this;
        let lp = this.lengthpercent;
        return new Promise(async (resolve) => {
            if (pos >= 0 && pos <= 100) {
                let res = await this.animate({
                    // 每个独立的动画耗时500ms
                    duration: 500,
                    timing(timeFraction) {
                        // linear
                        return timeFraction;
                    },
                    draw(progress) {
                        if (that.lengthpercent <= 100) {
                            that.main.style.width = `${(lp + (pos - lp) * progress)
                                }%`;
                        }
                    },
                });
                if (res.res === false) {
                    that.lengthpercent += (pos - that.lengthpercent) * res.p;
                    resolve(false);
                    return;
                } else {
                    that.lengthpercent = pos;
                    resolve(true);
                    return;
                }
            }
        });
    }
    async goto(pos) {
        this.state = "init";
        await this.changeTo(pos);
        this.state = "stop";
    }
    async start() {
        this.state = "run";
        while (this.state == "run") {
            let res = true;
            if (0 <= this.lengthpercent && this.lengthpercent <= 30) {
                res = await this.changeTo(this.lengthpercent + 10);
            } else if (this.lengthpercent <= 75) {
                res = await this.changeTo(this.lengthpercent + 6);
            } else if (this.lengthpercent <= 90) {
                res = await this.changeTo(this.lengthpercent + 3);
            } else if (this.lengthpercent <= 95) {
                res = await this.changeTo(this.lengthpercent + 1.5);
            } else {
                break;
            }
            if (res === false) {
                break;
            }
        }
    }
    stop() {
        this.state = 'stop';
    }
    async done() {
        this.state = 'init';
        await this.changeTo(100);
        await this.changeTo(0);
        this.state = "stop";
    }

    private animate({ timing, draw, duration }): Promise<pres> {
        return new Promise((resolve) => {
            let _this = this;
            let start = performance.now();
            requestAnimationFrame(function animate(time) {
                let timeFraction = (time - start) / duration;
                if (timeFraction > 1) timeFraction = 1;
                let progress = timing(timeFraction);
                if (_this.state == "run" || _this.state == "init") {
                    draw(progress);
                    if (timeFraction < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        resolve({
                            res: true,
                            p: 1
                        });
                        return;
                    }
                } else {
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