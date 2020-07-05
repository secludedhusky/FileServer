<template>
    <v-container>
        <h1>Logging out...</h1>
    </v-container>
</template>

<script>
export default {
    name: "logout",
    created() {
        this.$store.dispatch("logout", this);
    }
};
</script>
