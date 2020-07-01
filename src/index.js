// Imports
import Vue from "vue";
import VueRouter from "vue-router";
import VueMaterial from "vue-material";

// Vue uses
Vue.use(VueRouter);
Vue.use(VueMaterial);

// Components
import App from "./components/App.vue";

// CSS
import 'vue-material/dist/vue-material.min.css'

const routes = [
    { path: '/', component: App }
]

const router = new VueRouter({
    routes
})

let app = new Vue({
    el: "#app",
    router: router,
    render: h => h(App, {
        props: {
            message: "File Uploader"
        }
    })
});
