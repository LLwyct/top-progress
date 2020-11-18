interface Options {
    mounted?: string
    speed?: string
    width?: string
    color?: string
};

let defaultoptions: Options = {
    mounted: 'body',
    speed: '1s',
    width: '2px',
    color: '#c471f5'
};

class TP {

    private main: HTMLElement;
    private state: string;
    private lengthpercent: number;
    private settings: Options = defaultoptions;

    constructor (inputoptions: Options) {
        this.settings = {...this.settings, ...inputoptions};
        this.main = this.mount();
        this.init();
    }
    
    mount (): HTMLElement {
        /**
         * 把tp挂载到body上
         */
        let bodyelemet = document.querySelector('body');
        let topprogress = document.createElement('section');
        topprogress.style.height = this.settings.width;
        topprogress.style.transform = `translateX(-100%)`;
        topprogress.style.backgroundColor = this.settings.color;
        topprogress.setAttribute('id', 'topprogress');
        topprogress.innerHTML = `
        <div class="bar">
        <div class="barshadow"></div>
        </div>
        `;
        /**
         * 后续可以作为异常抛出
         */
        if (bodyelemet) {
            bodyelemet.appendChild(topprogress);
        }
        return topprogress;
    }
    
    init(): void {
        this.state = 'stop';
        this.lengthpercent = 0;
        this.main.style.transition = `transform ${this.settings.speed}s ease`;
    }

    changeto(pos: number): void {
        /**
         * 可以考虑写成观察者，在修改lengthpercent的同时，同步修改tp的translate属性
         */
        if (pos>=0 && pos<=100) {
            this.lengthpercent = pos;
            this.main.style.transform = `translateX(-${100-pos}%)`;
        }
        return;
    }

    start(): void {
        this.state = 'run';
        let that = this;
        function run(): void {
            if (that.state === 'run') {
                if (0 <= that.lengthpercent && that.lengthpercent <= 60) {
                    that.changeto(that.lengthpercent + 10);
                } else if (that.lengthpercent <= 75) {
                    that.changeto(that.lengthpercent + 5);
                } else if (that.lengthpercent <= 90) {
                    that.changeto(that.lengthpercent + 3);
                } else if (that.lengthpercent <= 95) {
                    that.changeto(that.lengthpercent + 1);
                } else {
                    return;
                }
                run();
            }
        }
        requestAnimationFrame(run);
    }
    
    done(): void {
        this.main.style.transition = `transform 0.5s ease`;
        this.changeto(100);
        setTimeout(() => {
            this.lengthpercent = 0;
            this.changeto(0);
        }, Number(this.settings.speed) * 1000);
    }
}