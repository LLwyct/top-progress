class TP {
    // 构造函数，接受可以自定义的进度条颜色，并初始化一些值
    constructor(option = {}) {
        this.main = document.querySelector('#topbar .bar');
        this.main.style.backgroundColor = option.color || 'lightblue';
        this.option = option;
        this.lengthpercent = 0;
        this.state = 'stop'
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
        setTimeout(() => this.init(), 1000);
    }
}