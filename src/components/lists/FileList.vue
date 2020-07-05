<template>
    <v-container>
        <v-subheader>My Files</v-subheader>
        <v-data-table :headers="headers" :items="this.$store.getters.myFiles" class="elevation-1">
            <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="downloadFile(item.id)">mdi-download</v-icon>
                <v-icon small @click="deleteFile(item.id)">mdi-delete</v-icon>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
export default {
    name: "file-list",
    data() {
        return {
            headers: [
                { text: "File Name", align: "start", value: "name" },
                { text: "File URL", value: "url", sortable: false },
                { text: "Actions", value: "actions", sortable: false }
            ]
        };
    },
    created() {
        this.$store.dispatch("getFiles", this);
    },
    methods: {
        downloadFile(id) {
            console.log("Download", id);
        },
        deleteFile(id) {
            console.log("Delete", id);
        }
    }
};
</script>