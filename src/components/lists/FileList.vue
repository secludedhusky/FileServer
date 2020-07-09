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
            <v-btn icon color="green">
                <v-icon>mdi-upload</v-icon>
            </v-btn>
            <v-btn @click="downloadMultiple()" v-if="selected.length > 0" icon color="green">
                <v-icon>mdi-download</v-icon>
            </v-btn>
            <v-btn @click="editMultiple()" v-if="selected.length > 0" icon color="green">
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn @click="deleteMultiple()" v-if="selected.length > 0" icon color="red">
                <v-icon>mdi-delete</v-icon>
            </v-btn>
        </v-subheader>

        <v-row v-if="error">
            <v-col cols="12" sm="12">
                <v-alert dismissible type="error">{{ error }}</v-alert>
            </v-col>
        </v-row>

        <v-data-table
            loading-text="Please wait..."
            :loading="loading"
            v-model="selected"
            :headers="headers"
            :items="this.$store.getters.myFiles"
            class="elevation-1"
            show-select
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
                <v-icon small class="mr-2" @click="downloadFile(item)">mdi-download</v-icon>
                <v-icon small class="mr-2" @click="editFile(item)">mdi-pencil</v-icon>
                <v-icon small color="red" @click="deleteFile(item)">mdi-delete</v-icon>
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
            loading: true,
            error: "",
            selected: []
        };
    },
    created() {
        this.getFiles();
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
        editFile(id) {
            console.log("Edit", id);
        },

        downloadMultiple() {
            console.log("Download", this.selected);
        },
        deleteMultiple() {
            console.log("Delete", this.selected);
        },
        editMultiple() {
            console.log("Edit", this.selected);
        },

        getFiles() {
            this.error = "";

            this.$store
                .dispatch("getFiles", this)
                .then(() => {
                    setTimeout(() => (this.loading = false), 1000);
                })
                .catch(() => {
                    this.error = "Failed to get files, please try again later.";
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