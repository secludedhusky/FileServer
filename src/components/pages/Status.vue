<template>
    <v-container>
        <h1>Status</h1>
        <p>
            App Version: {{ this.$store.getters.appVersion }}
        </p>
    </v-container>
</template>

<script>
export default {
    name: "status",
    async created() {
        console.log("Status dispatch");

        await this.$store.dispatch("checkAuth");

        

        this.$store.dispatch("getVersion", { self: this });
    }
};
</script> 
