<template>
    <v-app>
        <div id="app">
            <v-app id="inspire">
                <v-app id="inspire">
                    <v-navigation-drawer v-model="drawer" app clipped>
                        <v-list dense>
                            <v-list-item link v-on:click="navigate('home')">
                                <v-list-item-action>
                                    <v-icon>mdi-home</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                    <v-list-item-title>Home</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item link v-on:click="navigate('login')">
                                <v-list-item-action>
                                    <v-icon>mdi-login</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                    <v-list-item-title>Login</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item link v-on:click="navigate('register')">
                                <v-list-item-action>
                                    <v-icon>mdi-account</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                    <v-list-item-title>Register</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item link v-on:click="navigate('status')">
                                <v-list-item-action>
                                    <v-icon>mdi-server</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                    <v-list-item-title>Status</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-navigation-drawer>

                    <v-app-bar app clipped-left>
                        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                        <v-toolbar-title>Upload Server</v-toolbar-title>
                    </v-app-bar>

                    <v-main>
                        <transition
                            name="fade"
                            mode="out-in"
                        >
                            <router-view></router-view>
                        </transition>
                    </v-main>

                    <v-footer app>
                        <span>&copy; {{ new Date().getFullYear() }}</span>
                    </v-footer>
                </v-app>
            </v-app>
        </div>
    </v-app>
</template>

<script>
export default {
    name: "landing-page",
    data: () => ({
        drawer: true
    }),
    methods: {
        navigate(page) {
            if (this.$router.history.current.name !== page) {
                this.$router.push(page);
            }
        }
    }
};
</script>