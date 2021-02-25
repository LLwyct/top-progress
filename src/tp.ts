interface Options {
    mounted?: string
    speed?: string
    width?: string
    color?: string
};

let defaultOptions: Options = {
    mounted: 'body',
    speed: '1s',
    width: '2px',
    color: '#c471f5'
};

class TP {
  private main: HTMLElement;
  private state: string;
  private lengthpercent: number;
  private settings: Options = defaultOptions;

  constructor(inputoptions: Options) {
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

  init(): void {
    this.state = "stop";
    this.lengthpercent = 0;
  }

  changeTo(pos: number): Promise<boolean> {
    return new Promise(async (resolve) => {
      let that = this;
      let lp = this.lengthpercent;
      if (pos >= 0 && pos <= 100) {
        let res = await this.animate({
          duration: 500,
          timing(timeFraction) {
            return timeFraction;
          },
          draw(progress) {
            if (that.lengthpercent < 100) {
              that.main.style.transform = `translateX(-${
                100 - (lp + (pos - lp) * progress)
              }%)`;
            }
          },
        });
        this.lengthpercent = pos;
        if (res === false) {
          resolve(false);
        } else {
          resolve(true);
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
      if (0 <= this.lengthpercent && this.lengthpercent <= 40) {
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

  async done() {
    this.state = "init";
    let lp = this.lengthpercent;
    this.lengthpercent = 100;
    let that = this;
    await this.animate({
      duration: 500,
      timing(timeFraction) {
        return timeFraction;
      },
      draw(progress) {
        that.main.style.transform = `translateX(-${
          100 - (lp + (100 - lp) * progress)
        }%)`;
      },
    });
    this.lengthpercent = 0;
    await this.animate({
      duration: 500,
      timing(timeFraction) {
        return timeFraction;
      },
      draw(progress) {
        that.main.style.transform = `translateX(-${100 * progress}%)`;
      },
    });
    this.state = "stop";
  }

  private animate({ timing, draw, duration }) {
    let _this = this;
    return new Promise((resolve) => {
      let start = performance.now();
      requestAnimationFrame(function animate(time) {
        if (_this.state == "run" || _this.state == "init") {
          let timeFraction = (time - start) / duration;
          if (timeFraction > 1) timeFraction = 1;
          let progress = timing(timeFraction);
          draw(progress);
          if (timeFraction < 1) {
            requestAnimationFrame(animate);
          } else {
            resolve(true);
          }
        } else {
          resolve(false);
        }
      });
    });
  }
}