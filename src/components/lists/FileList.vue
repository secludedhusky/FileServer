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
            <v-btn @click="fileOperation('download')" v-if="selected.length > 0" icon color="green">
                <v-icon>mdi-download</v-icon>
            </v-btn>
            <v-btn @click="fileOperation('edit')" v-if="selected.length > 0" icon color="green">
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn @click="fileOperation('delete')" v-if="selected.length > 0" icon color="red">
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
            <template v-slot:item.upload_date="{ item }">
                <span>{{ moment(item.upload_date).fromNow() }}</span>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="fileOperation('preview', item)">mdi-eye</v-icon>
                <v-icon small class="mr-2" @click="fileOperation('download', item)">mdi-download</v-icon>
                <v-icon small class="mr-2" @click="fileOperation('edit', item)">mdi-pencil</v-icon>
                <v-icon small color="red" @click="fileOperation('delete', item)">mdi-delete</v-icon>
            </template>
        </v-data-table>

        <template>
            <div class="text-center">
                <v-dialog v-model="preview.open" width="600">
                    <v-card class="file-container">
                        <v-card-title class="headline lighten-2" >File Preview</v-card-title>

                        <v-card-text>
                            <object class="file-preview" v-bind:data="this.preview.url" v-bind:type="this.preview.mime"></object>
                        </v-card-text>

                        <v-divider></v-divider>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" text @click="preview.open = false">Close</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </div>
        </template>
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
                {
                    text: "Actions",
                    value: "actions",
                    sortable: false,
                    align: "right"
                }
            ],
            loader: null,
            loading: true,
            preview: {
                open: false,
                url: null,
                mime: null
            },
            error: "",
            selected: [],
            modes: ["download", "edit", "delete", "preview"]
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
        getIdsFromObject(data) {
            let items = [];

            if (Array.isArray(data)) {
                items = data.map(item => {
                    return item.id;
                });
            } else {
                items.push(data.id);
            }

            return items;
        },
        getUrlsFromObject(data) {
            let items = [];

            if (Array.isArray(data)) {
                items = data.map(item => {
                    return item.upload_url;
                });
            } else {
                items.push(data.upload_url);
            }

            return items;
        },
        fileOperation(mode, data) {
            if (this.modes.includes(mode)) {
                if (!data) {
                    data = this.selected;
                }

                switch (mode) {
                    case "preview":
                        this.preview = {
                            open: true,
                            url: `/api/v1/user/file/${this.getIdsFromObject(data)[0]}`,
                            mime: data.upload_mime
                        }
                        break;
                    default:
                        this.$store
                            .dispatch("fileOperation", {
                                mode: mode,
                                data: this.getIdsFromObject(data),
                                self: this
                            })
                            .then(r => {
                                console.log(r);
                            })
                            .catch(error => {
                                this.error =
                                    "File operation failed, please try again later.";
                                setTimeout(() => (this.loading = false), 1000);
                            });
                        break;
                }
            }
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

<style lang="scss">
@import "../styles/_loader.scss";

.file-preview {
    max-width: 500px;
    max-height: 500px;
}
.file-container {
    margin: 0 auto;
    text-align: center;
}
</style>