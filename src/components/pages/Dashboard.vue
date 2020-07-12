<template>
    <v-container>
        <h1>Dashboard</h1>
        <v-container fluid>
            <user-profile></user-profile>
            <file-list></file-list>
            <file-uploader></file-uploader>
        </v-container>
    </v-container>
</template>

<script>
import FileList from "../lists/FileList.vue";
import UserProfile from "../user/UserProfile.vue";
import FileUploader from "../objects/FileUploader.vue";

export default {
    name: "dashboard",
    components: {
        FileList,
        UserProfile,
        FileUploader
    },
    created: function() {
        this.$nextTick(function() {
            if (!this.$store.getters.loggedIn) {
                this.$router.push("login");
            }
        });
    }
};
</script>
