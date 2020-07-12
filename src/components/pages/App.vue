<template>
    <v-app v-if="dataReady">
        <div id="app">
            <v-app id="inspire">
                <v-app id="inspire">
                    <transition name="fade" mode="out-in">
                        <v-navigation-drawer v-model="drawer" app clipped>
                            <v-list dense>
                                <v-list-item
                                    link
                                    v-for="(item, index) in links"
                                    :key="index"
                                    :to="item.path"
                                >
                                    <v-list-item-action>
                                        <v-icon>{{ item.icon }}</v-icon>
                                    </v-list-item-action>
                                    <v-list-item-content>
                                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-navigation-drawer>
                    </transition>

                    <v-app-bar app clipped-left>
                        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                        <v-toolbar-title>Upload Server</v-toolbar-title>
                    </v-app-bar>

                    <v-main>
                        <transition name="fade" mode="out-in">
                            <router-view></router-view>
                        </transition>
                    </v-main>

                    <v-footer class="hidden-md-and-down" app>
                        <span>{{ copy }} &copy; {{ new Date().getFullYear() }}</span>
                    </v-footer>
                </v-app>
            </v-app>
        </div>
    </v-app>
</template>

<script>
import "babel-polyfill";
import store from "../../plugins/store";

export default {
    name: "app-main",
    computed: {
        links() {
            return this.items.filter(item => {
                return item.authRequired === this.$store.getters.loggedIn;
            });
        }
    },
    data: () => ({
        copy: "XenPowered",
        drawer: true,
        dataReady: false,
        items: [
            {
                path: "/dashboard",
                title: "Dashboard",
                icon: "mdi-view-dashboard",
                authRequired: true
            },
            {
                path: "/stats",
                title: "Statistics",
                icon: "mdi-server",
                authRequired: true
            },
            {
                path: "/home",
                title: "Home",
                icon: "mdi-home",
                authRequired: false
            },
            {
                path: "/login",
                title: "Login",
                icon: "mdi-login",
                authRequired: false
            },
            {
                path: "/logout",
                title: "Logout",
                icon: "mdi-logout",
                authRequired: true
            },
            {
                path: "/register",
                title: "Register",
                icon: "mdi-account",
                authRequired: false
            }
        ]
    }),
    methods: {
        navigate(page) {
            if (this.$router.history.current.name !== page) {
                this.$router.push(page);
            }
        }
    },
    created() {
        this.$store.dispatch("checkAuth", this);
        this.dataReady = true;
    }
};
</script>

<style lang="scss">
@import "../styles/_animation.scss";
</style>