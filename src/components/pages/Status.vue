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
        if (!this.$store.getters.loggedIn) {
            this.$router.push("login");
        } else {
            this.$store.dispatch("getStats", this);
        }
    }
};
</script> 
