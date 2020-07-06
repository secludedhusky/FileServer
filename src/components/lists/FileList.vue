<template>
    <v-container>
        <v-subheader>
            My Files
            <v-btn
                :loading="loading"
                :disabled="loading"
                icon
                color="green"
                @click="loader = 'loading'; getFiles()"
            >
                <v-icon>mdi-cached</v-icon>
                <template v-slot:loader>
                    <span class="custom-loader">
                        <v-icon light>cached</v-icon>
                    </span>
                </template>
            </v-btn>
        </v-subheader>
        <v-data-table
            loading-text="Loading..."
            :headers="headers"
            :items="this.$store.getters.myFiles"
            class="elevation-1"
        >
            <template v-slot:item.upload_filename="{ item }">
                <span>
                    {{ item.upload_filename }}
                    <v-btn
                        color="secondary"
                        fab
                        x-small
                        dark
                        :href="item.upload_url"
                        target="_BLANK"
                    >
                        <v-icon>mdi-open-in-new</v-icon>
                    </v-btn>
                </span>
            </template>
            <template v-slot:item.upload_date="{ item }">
                <span>{{ moment(item.upload_date).fromNow() }}</span>
            </template>
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
                { text: "File Name", align: "start", value: "upload_filename" },
                { text: "Uploaded", value: "upload_date", sortable: true },
                { text: "Views", value: "upload_views", sortable: true },
                { text: "Actions", value: "actions", sortable: false }
            ],
            loader: null,
            loading: false
        };
    },
    created() {
        this.$store.dispatch("getFiles", this);
    },
    watch: {
        loader() {
            let l = this.loader;
            this[l] = !this[l];

            this.loader = null;
        }
    },
    methods: {
        downloadFile(id) {
            console.log("Download", id);
        },
        deleteFile(id) {
            console.log("Delete", id);
        },
        getFiles() {
            this.$store.dispatch("getFiles", this).then(() => {
                setTimeout(() => (this.loading = false), 1000);
            });
        }
    }
};
</script>

<style>
.custom-loader {
    animation: loader 1s infinite;
    display: flex;
}
@-moz-keyframes loader {
    from {
        transform: rotate(360deg);
    }
    to {
        transform: rotate(0);
    }
}
@-webkit-keyframes loader {
    from {
        transform: rotate(360deg);
    }
    to {
        transform: rotate(0);
    }
}
@-o-keyframes loader {
    from {
        transform: rotate(360deg);
    }
    to {
        transform: rotate(0);
    }
}
@keyframes loader {
    from {
        transform: rotate(360deg);
    }
    to {
        transform: rotate(0);
    }
}
</style>