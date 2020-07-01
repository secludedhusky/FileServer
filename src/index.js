// Imports
import Vue from "vue";
import * as VueMaterial from "vue-material"; // Lazy

// Components
import App from "./components/pages/App.vue";

// Router
import router from './router.js';

// Vue Uses
Vue.use(VueMaterial.default);

// CSS
import 'vue-material/dist/vue-material.min.css'

// Main Ap
let app = new Vue({
    components: { App },
    router,
    template: "<App/>",
    propsData: {
        pageTitle: "Uploader"
    }
}).$mount("#app");
