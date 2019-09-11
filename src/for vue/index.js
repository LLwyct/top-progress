import TopProgress from './component.vue';

export default {
    install (Vue, options) {
        const VueTopProgress = Vue.extend(TopProgress);
        const tp             = new VueTopProgress();
        
        tp.setSettings(options);
        Vue.prototype.$tp    = tp;
        document.body.appendChild((tp.$mount()).$el);
    }
}