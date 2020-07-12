import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: {
            loggedIn: false,
            id: null,
            username: null,
            email: null,
            files: []
        },
        app: {
            version: null,
            branch: null,
            uploads: null,
            views: null,
        }
    },
    getters: {
        loggedIn: state => {
            return state.user.loggedIn;
        },
        getUsername: state => {
            return state.user.username;
        },
        appVersion: state => {
            return `${state.app.branch} ${state.app.version}`;
        },
        myFiles: state => {
            return state.user.files;
        },
        getStats: state => {
            return [state.app];
        }
    },
    mutations: {
        login(state, data) {
            state.user = {
                loggedIn: true,
                id: data.id,
                username: data.username,
                email: data.email,
                files: state.user.files
            }

            data.self.$router.push("dashboard");
        },
        register(state, data) {
            data.self.accountCreated = true;
            setTimeout(() => { data.self.$router.push("dashboard"); }, 2000);
        },
        checkAuth(state, data) {
            state.user = {
                loggedIn: true,
                id: data.id,
                username: data.username,
                email: data.email,
                files: state.user.files
            }
        },
        noAuth(state, self) {
            state.user = {
                loggedIn: false,
                id: null,
                username: null,
                email: null,
                files: [],
            }

            if (self.$router.history.current.name !== "login" && self.$router.history.current.name !== "home") {
                self.$router.push("login");
            }
        },

        getStats(state, data) {
            if (data) {
                state.app = data;
            } else {
                state.app = {
                    version: null,
                    branch: null,
                    uploads: null,
                    views: null,
                }
            }
        },

        getFiles(state, data) {
            state.user.files = data;
            console.log(data);
        },
    },
    actions: {
        login({ commit }, payload) {
            return new Promise(async (resolve, reject) => {
                let response = await fetch(`${process.env.API_URI_V1}/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: payload.username,
                        password: payload.password
                    })
                })
                    .catch((error) => {
                        reject(response);
                    })

                if (response.ok) {
                    let data = await response.json()
                        .catch(error => {
                            console.error(error);
                        });

                    commit("login", payload);
                    resolve(data);
                } else {
                    resolve(response);
                }

            });
        },
        register({ commit }, payload) {
            return new Promise(async (resolve, reject) => {
                let response = await fetch(`${process.env.API_URI_V1}/auth/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: payload.email,
                        username: payload.username,
                        password: payload.password
                    })
                });

                if (response.ok) {
                    let data = await response.json()
                        .catch(error => {
                            console.error(error);
                        });

                    commit("register", payload);
                    resolve(data);
                } else {
                    reject(response);
                }
            });
        },
        logout({ commit }, self) {
            return fetch(`${process.env.API_URI_V1}/auth/logout`)
                .then((r) => {
                    commit("noAuth", self);
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        checkAuth({ commit }, self) {
            return fetch(`${process.env.API_URI_V1}/auth/check`, { credentials: "include", })
                .then((r) => {
                    switch (r.status) {
                        case 200:
                            r.json()
                                .then((data) => {
                                    commit("checkAuth", data.data);
                                });
                            break;
                        case 401:
                            commit("noAuth", self);
                            break;
                        default:
                            console.error("Unknown status");
                            break;
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        },

        getVersion({ commit }, self) {
            return fetch(`${process.env.API_URI_V1}/server/version`, { credentials: "include", })
                .then((r) => {
                    switch (r.status) {
                        case 200:
                            r.json()
                                .then((data) => {
                                    commit("getVersion", data.data);
                                });
                            break;
                        case 401:
                            commit("noAuth", self);
                            break;
                        default:
                            console.error("Unknown status");
                            break;
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        getStats({ commit }, self) {
            return new Promise((resolve, reject) => {
                return fetch(`${process.env.API_URI_V1}/server/stats`)
                    .then((r) => {
                        switch (r.status) {
                            case 200:
                                resolve(r);
                                r.json()
                                    .then((data) => {
                                        commit("getStats", data.data);
                                    });
                                break;
                            case 401:
                                reject(r);
                                commit("noAuth", self);
                                break;
                            default:
                                reject(r);
                                commit("getStats", null);
                                console.error("Unknown status");
                                break;
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })

        },

        getFiles({ commit }, self) {
            return new Promise(async (resolve, reject) => {
                let response = await fetch(`${process.env.API_URI_V1}/user/files`)

                if (response.ok) {
                    let data = await response.json()
                        .catch(error => {
                            console.error(error);
                        });

                    commit("getFiles", data.data);
                    resolve(data);
                } else {
                    switch (response.status) {
                        case 401:
                            commit("noAuth", self);
                            break;
                        default:
                            console.error("Unknown status");
                            break;
                    }
                    reject(response);
                }
            });
        },

        fileOperation({ commit }, payload) {
            return new Promise((resolve, reject) => {
                let download = document.createElement("a");
                download.href = `/api/v1/user/file/${payload.data[0]}/download`
                download.download = "file";
                download.click();
                download.remove();

                resolve(true);
            })
        },

    }
});