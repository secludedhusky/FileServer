// Imports
import Vue from "vue";

// Plugins
import vuetify from "./plugins/vuetify";
import router from './plugins/router';
import store from "./plugins/store";

// Components
import App from "./components/pages/App.vue";

import moment from "moment";
Vue.prototype.moment = moment;

// Main Ap
let app = new Vue({
    store: store,
    components: { App },
    vuetify,
    router,
    template: "<App/>",
    props: {
        source: String,
    },
    created() {
        this.$vuetify.theme.dark = true
    },
}).$mount("#app");
