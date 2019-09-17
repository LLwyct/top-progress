interface Options {
    mounted?: string
    speed?: string
    width?: string
};

let defaultoptions: Options = {
    mounted: 'body',
    speed: '1s',
    width: '2px',
};

class TP {

    private main: HTMLElement
    private state: string
    private lengthpercent: number
    private settings: Options = defaultoptions

    constructor (inputoptions: Options) {
        this.settings = {...this.settings, ...inputoptions}
        this.main = this.mount()
        this.init()
    }

    mount (): HTMLElement {
        let bodyelemet = document.querySelector('body')
        let topprogress = document.createElement('section')
        topprogress.setAttribute('id', 'topprogress')
        topprogress.innerHTML = `
            <div class="bar">
                <div class="barshadow"></div>
            </div>
        `
        bodyelemet.appendChild(topprogress)
        return document.querySelector('#topprogress .bar')
    }

    init(): void {
        this.state = 'stop';
        this.lengthpercent = 0;
        this.main.style.transform = `translateX(-100%)`;
    }

    changeto(pos: number): void {
        if (pos>=0 && pos<=100) {
            this.lengthpercent = pos;
            this.main.style.transform = `translateX(-${100-pos}%)`;
            return;
        }
        else {
            return;
        }
    }

    start(): void {
        this.state = 'run';
        let that = this;

        function run(): void {
            setTimeout(() => {
                if(that.state === 'run') {
                    if (that.lengthpercent <= 60 && that.lengthpercent >= 0) {
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
                return;
            }, 1000)
        }
        run();
    }
    
    done(): void {
        this.main.style.transform = 
        this.changeto(100);
        if (this.settings.speed != '1s') {
            setTimeout(() => this.init(), 1000);
        } else {
            setTimeout(() => this.init(), 1000);
       }
    }
}