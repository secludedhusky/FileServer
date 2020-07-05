import Vue from "vue";
import Vuex from "vuex";

import uuid from "uuid/dist/v4";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: {
            loggedIn: false,
            id: "",
            username: "",
            email: "",
            files: []
        },
        app: {
            version: "",
            branch: "",
            uploads: "",
            views: ""
        }
    },
    getters: {
        loggedIn: state => {
            return state.user.loggedIn;
        },
        appVersion: state => {
            return `${state.app.branch} ${state.app.version}`;
        },
        myFiles: state => {
            return state.user.files;
        },
    },
    mutations: {
        FETCH_AUTH(state, data) {
            state.user = {
                loggedIn: true,
                id: data.id,
                username: data.username,
                email: data.email,
                files: []
            }
        },
        FETCH_VERSION(state, data) {
            state.app = {
                version: data.version,
                branch: data.branch
            }
        },
        FETCH_UPLOADS(state, data) {
            state.app.uploads = data.version;
        },
        FETCH_VIEWS(state, version) {
            state.app.version = data.version;
        },
        FETCH_FILES(state, data) {
            state.user.files = data;
        }
    },
    actions: {
        checkAuth({ commit }) {
            fetch(`${process.env.API_URI_V1}/auth/check`, {
                credentials: "include",
            })
                .then((response) => {
                    if(response.ok) {
                        response.json()
                            .then((data) => {
                                commit("FETCH_AUTH", data.message);
                            });
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        getVersion({ commit }) {
            fetch(`${process.env.API_URI_V1}/utilities/version`, {
                credentials: "include",
            })
                .then((response) => {
                    response.json()
                        .then((data) => {
                            commit("FETCH_VERSION", data.message);
                        });
                })
                .catch((error) => {
                    console.error(error);
                    commit("FETCH_VERSION", {
                        version: "Unknown",
                        branch: "Unknown"
                    });
                });
        },
        getUploads({ commit }, { self }) {
            fetch(`${process.env.API_URI_V1}/utilities/uploads`)
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.error(error);
                });

        },
        getViews({ commit }, { self }) {
            fetch(`${process.env.API_URI_V1}/utilities/views`)
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.error(error);
                });

        },
        getUserFiles({ commit }) {
            let examples = [];
            for (let i = 0; i < 50; i++) {
                let id = uuid();
                examples.push({
                    id: `${id}`,
                    name: `${id}.png`,
                    url: `https://ss1.projectge.com/api/v1/${id}`
                });
            }

            commit("FETCH_FILES", examples);
        }
    }
});