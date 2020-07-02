<template>
    <v-container>
        <h1>Login</h1>
    </v-container>
</template>

<script>
export default {
    name: "login-page",
    methods: {
        navigate(page) {
            if (this.$router.history.current.name !== page) {
                this.$router.push(page);
            }
        }
    }
};
</script>
