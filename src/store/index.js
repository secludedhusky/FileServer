import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: {
            loggedIn: false,
            id: "",
            username: "",
            email: ""
        },
    },
    getters: {
        loggedIn: state => {
            return state.user.loggedIn;
        }
    },
    mutations: {},
    actions: {}
});