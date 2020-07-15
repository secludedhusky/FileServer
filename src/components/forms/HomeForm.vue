<template>
    <v-container>
        <v-subheader>Welcome</v-subheader>
        <v-row>
            <v-col cols="12" sm="6">
                <v-btn color="primary" block @click="login()">Login</v-btn>
            </v-col>
            <v-col cols="12" sm="6">
                <v-btn color="secondary" block @click="register()">Register</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: "home-form",
    methods: {
        login() {
            this.$router.push("login");
        },
        register() {
            this.$router.push("register");
        }
    }
};
</script>