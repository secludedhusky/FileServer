<template>
    <v-container>
        <h1>Login</h1>
        <login-form></login-form>
    </v-container>
</template>

<script>
import LoginForm from "../forms/LoginForm.vue";

export default {
    name: "login",
    components: {
        LoginForm
    }
};
</script>
