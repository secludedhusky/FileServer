import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from "./components/pages/Home.vue";
import Login from "./components/pages/Login.vue";
import Status from "./components/pages/Status.vue";

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: '/',
            name: 'landing',
            component: Home
        },
        {
            path: '/home',
            name: 'home',
            component: Home
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/status',
            name: 'status',
            component: Status
        }
    ]
});