<template>
    <v-container>
        <h1>Dashboard</h1>
        <p>
            Welcome, {{ this.$store.state.user.username }}
        </p>
        <file-list></file-list>
    </v-container>
</template>

<script>
import FileList from "../lists/FileList.vue";

export default {
    name: "dashboard",
    components: { FileList },
    created: function () {
        if(!this.$store.state.user.loggedIn) {
            this.$router.push("login");
        }
    } 
};
</script>
