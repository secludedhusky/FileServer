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
    methods: {
        navigate(page) {
            if (this.$router.history.current.name !== page) {
                this.$router.push(page);
            }
        }
    },
    created: function() {
        if (!this.$store.getters.loggedIn) {
            this.$router.push("login");
        }
        
        this.$store.dispatch("getVersion", { self: this });
    }
};
</script> 
