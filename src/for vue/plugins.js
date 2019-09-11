'use strict'
import TopProgress from './component.vue';

export default {
    install (Vue, options) {
        const VueTopProgress = Vue.extend(TopProgress);
        const tp             = new VueTopProgress();
        Vue.prototype.$tp    = tp;
        // console.log('install');
        
        document.body.appendChild((tp.$mount()).$el);
    }
}