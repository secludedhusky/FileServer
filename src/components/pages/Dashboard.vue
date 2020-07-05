<template>
    <v-container>
        <h1>Dashboard</h1>
        <v-container fluid>
            <v-subheader>My Profile</v-subheader>
            <v-layout column>
                <v-card>
                    <v-card-text>
                        <v-flex class="mb-3">
                            <v-avatar size="64" class="mr-4">
                                <img :src="'https://via.placeholder.com/150'" alt="Avatar" />
                            </v-avatar>
                            Welcome, {{ this.$store.state.user.username }}
                        </v-flex>
                    </v-card-text>
                </v-card>
            </v-layout>
        </v-container>
        <file-list></file-list>
    </v-container>
</template>

<script>
import FileList from "../lists/FileList.vue";

export default {
    name: "dashboard",
    components: { FileList },
    created() {
        if (!this.$store.state.user.loggedIn) {
            this.$router.push("login");
        }
    }
};
</script>
