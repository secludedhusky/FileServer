<template>
    <v-container>
        <h1>Register</h1>
        <registration-form></registration-form>
    </v-container>
</template>

<script>
import RegistrationForm from "../forms/RegistrationForm.vue";

export default {
    name: "register",
    components: {
        RegistrationForm
    },
    created() {
        if (this.$store.state.user.loggedIn) {
            this.$router.push("dashnoard");
        }
    }
};
</script>
