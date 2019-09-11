<template>
    <section id="topbar">
        <div class="bar" ref="tp">
           <div class="barshadow"></div>
        </div>
    </section>
</template>

<script>
export default {
    data () {
        return {
            state: 'stop',
            lengthpercent: 0,
            main: null,
            settings: {
                speed: 1,
                width: 2,
                color: 'lightblue',
            }
        }
    },
    methods: {
        init () {
            this.state                = 'stop';
            this.lengthpercent        = 0;
            this.main.style.transform = `translateX(-100%)`;
            this.main.style.opacity   = '0';
        },
        setSettings (options = {}) {
            if (Object.keys(options).length === 0) {
                return;
            } else {
                for (let key in options) {
                    this.settings[key] = options[key];
                }
            }
        },
        changeto (pos) {
            if (pos >= 0 && pos <= 100) {
                this.main.style.opacity   = '1';
                this.lengthpercent = pos;
                this.main.style.transform = `translateX(-${100 - pos}%)`;
                return this;
            }
        },
        start () {
            this.state = "run";
            let that = this;
            function run(after) {
                if (after) {}
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
            that.changeto(that.lengthpercent + 10);
            run();
        },
        add (length) {
            if (this.lengthpercent + length >= 100) {
                this.lengthpercent = 100;
            } else {
                this.lengthpercent += length;
            }
            if (this.lengthpercent >= 0 || this.lengthpercent <= 100) {
                this.changeto(this.lengthpercent);
            }
        },
        done () {
            this.changeto(100);
            setTimeout(() => this.init(), 1000);
        }
    },
    mounted () {
        this.main = this.$refs.tp;
        this.main.style.backgroundColor = this.settings.color;
        this.main.style.transition = `transform ${this.settings.speed}s ease-out, opacity .3s ease`;
        this.main.style.height = `${this.settings.width}px`;
    }
}
</script>

<style scoped>
#topbar .bar {
    position: fixed;
    top: 0;
    right: 0;
    background-color: lightblue;
    width: 100%;
    height: 2px;
    transform: translateX(-100%);
    transition: transform 1s ease-out, opacity .1s ease;
}

#topbar .bar .barshadow {
    width: 20px;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    opacity: 1;
    background-color: transparent;
    box-shadow: 5px 5px 10px 0px rgba(0, 0, 255, .2);
}
</style>