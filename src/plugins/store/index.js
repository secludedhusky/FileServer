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
        },
        editor: {
            open: false,
            file: {
                id: null,
                upload_filename: null,
                upload_mime: null,
                upload_url: null,
                upload_views: null,
                upload_private: null
            }
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
        },
        editorState: state => {
            return state.editor;
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
                self.$router.push({ path: "/login" });
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
        },
        deletedFiles(state, data) {
            return new Promise(async (resolve, reject) => {
                state.user.files = state.user.files.filter((file) => {
                    return !data.includes(file.id);
                });
            })
        },

        openEditor(state, data) {
            console.log("Opening editor with", data.data);
            state.editor = {
                open: true,
                file: data.data
            }
        },
        closeEditor(state, data) {
            console.log("Closing editor with", state.editor.file);
            state.editor = {
                open: false,
                file: {
                    id: null,
                    upload_filename: null,
                    upload_mime: null,
                    upload_url: null,
                    upload_views: null,
                    upload_private: null
                }
            }
        }
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
                        reject(error);
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

        getFiles({ commit }, payload) {
            return new Promise(async (resolve, reject) => {
                let response = await fetch(`${process.env.API_URI_V1}/user/files${payload.fileId ? "/" + payload.fileId : ""}`);

                if (response.ok) {
                    let data = await response.json()
                        .catch(error => {
                            console.error(error);
                        });

                    if (!payload.fileId) {
                        commit("getFiles", data.data);
                    }

                    resolve(data);
                } else {
                    switch (response.status) {
                        case 401:
                            commit("noAuth", payload.self);
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
            return new Promise(async (resolve, reject) => {
                switch (payload.mode) {
                    case "download":
                        let download = document.createElement("a");
                        download.href = `/api/v1/user/file/${payload.data[0]}/download`
                        download.download = "file";
                        download.click();
                        download.remove();
                        resolve(true);
                        break;
                    case "edit":
                        let file = await payload.self.$store.dispatch("getFiles", { fileId: payload.data });
                        commit("openEditor", {
                            data: file.data[0]
                        });
                        break;
                    case "delete":
                        let response = await fetch(`/api/v1/user/files/delete`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                files: payload.data
                            })
                        })
                            .catch((error) => {
                                console.error(error);
                            })

                        if (response.ok) {
                            commit("deletedFiles", payload.data);
                            resolve(response);
                        } else {
                            switch (response.status) {
                                case 401:
                                    commit("noAuth", payload.self);
                                    break;
                                default:
                                    console.error("Unknown status");
                                    break;
                            }
                        }
                        break;

                    default:
                        resolve(false);
                        break;
                }
            })
        },

        closeEditor({ commit }, payload) {
            return new Promise((resolve, reject) => {
                // todo check cancel/confirm
                console.log(payload)
                commit("closeEditor");
            })
        }

    }
});