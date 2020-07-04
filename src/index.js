// Imports
import Vue from "vue";
import vuetify from "./plugins/vuetify"


// Components
import App from "./components/pages/App.vue";

// Router
import router from './router.js';

// Store
import store from "./store";

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
