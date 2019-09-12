class TP {
    // 构造函数，接受可以自定义的进度条颜色，并初始化一些值
    constructor(options = {}) {
        this.mount = 'body';
        this.insertElement(this.mount);
        this.main = document.querySelector('#topbar .bar');
        this.main.style.backgroundColor = options.color || 'lightblue';
        this.main.style.height = options.width || '2px';
        if (options.speed) {
            this.main.style.transition = `transform ${options.speed}s ease-out`;
            console.log(this.main.style);
        }

        this.options = options;
        this.lengthpercent = 0;
        this.state = 'stop'
    }

    insertElement(fatherelement) {
        let topbar = document.createElement('section');
        topbar.setAttribute('id', 'topbar');
        topbar.innerHTML = `
            <div class="bar">
                <div class="barshadow"></div>
            </div>
        `;
        document.querySelector(fatherelement).appendChild(topbar);
    }

    init() {
        this.state = 'stop';
        this.lengthpercent = 0;
        this.main.style.transform = `translate3d(-100%,0px,0px)`;
    }

    changeto(pos) {
        if (pos >= 0 && pos <= 100) {
            this.lengthpercent = pos;
            this.main.style.transform = `translate3d(-${100 - pos}%,0px,0px)`;
            return this;
        }
    }

    start() {
        this.state = "run";
        let that = this;

        function run() {
            setTimeout(() => {
                if (that.state === 'stop') {
                    return;
                }
                if (that.lengthpercent <= 30) {
                    that.changeto(that.lengthpercent + 10);
                } else if (that.lengthpercent <= 60) {
                    that.changeto(that.lengthpercent + 5);
                } else if (that.lengthpercent <= 80) {
                    that.changeto(that.lengthpercent + 3);
                } else if (that.lengthpercent <= 90) {
                    that.changeto(that.lengthpercent + 1);
                } else if (that.lengthpercent <= 95) {
                    that.changeto(that.lengthpercent + 0.5);
                } else {
                    return;
                }
                run();
                return;
            }, 800)
        }
        run();
    }

    add(length) {
        if (this.lengthpercent + length >= 100) {
            this.lengthpercent = 100;
        } else {
            this.lengthpercent += length;
        }
        if (this.lengthpercent >= 0 || this.lengthpercent <= 100) {
            this.changeto(this.lengthpercent);
        }
    }

    done() {
        this.changeto(100);
        if (this.options.speed) {
            setTimeout(() => this.init(), Number(this.options.speed) * 1000);
        } else {
            setTimeout(() => this.init(), 1000);
        }
    }
}

export default TP