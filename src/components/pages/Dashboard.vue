<template>
    <v-container v-touch="{
            left: () => swipe('Left'),
            right: () => swipe('Right'),
            up: () => swipe('Up'),
            down: () => swipe('Down')
        }">
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
    methods: {
        swipe(direction) {
            this.swipeDirection = direction;
        }
    },
    created: function() {
        if (!this.$store.getters.loggedIn) {
            this.$router.push({ key: "login" });
        }
    }
};
</script>
