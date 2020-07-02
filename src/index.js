// Imports
import Vue from "vue";
import vuetify from "./plugins/vuetify"

// Components
import App from "./components/pages/App.vue";

// Router
import router from './router.js';

// Main Ap
let app = new Vue({
    components: { App },
    vuetify,
    router,
    template: "<App/>",
    props: {
        source: String,
    },
    data: () => ({
        drawer: null
    }),
    created() {
        this.$vuetify.theme.dark = true
    },
}).$mount("#app");
