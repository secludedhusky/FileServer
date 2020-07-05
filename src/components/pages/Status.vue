<template>
    <v-container>
        <h1>Status</h1>
        <p>App Version: {{ this.$store.getters.appVersion }}</p>
    </v-container>
</template>

<script>
export default {
    name: "status",
    created() {
        this.$store.dispatch("getStats", this);
        if (!this.$store.getters.loggedIn) {
            this.$router.push("login");
        }
    }
};
</script> 
