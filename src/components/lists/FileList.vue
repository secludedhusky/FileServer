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
            :loading="loading"
            :headers="headers"
            :items="this.$store.getters.myFiles"
            v-model="selected"
            loading-text="Please wait..."
            class="elevation-1"
            @click:row="viewFile"
            show-select
        >
            <template v-slot:item.upload_date="{ item }">
                <span>{{ moment(item.upload_date).fromNow() }}</span>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="fileOperation('download', item)">mdi-download</v-icon>
                <v-icon small class="mr-2" @click="fileOperation('edit', item)">mdi-pencil</v-icon>
                <v-icon small color="red" @click="fileOperation('delete', item)">mdi-delete</v-icon>
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
            modes: ["download", "edit", "delete"]
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
                            url: `/api/v1/user/file/${
                                this.getIdsFromObject(data)[0]
                            }`,
                            mime: data.upload_mime
                        };
                        break;
                    default:
                        this.$store
                            .dispatch("fileOperation", {
                                mode: mode,
                                data: this.getIdsFromObject(data),
                                self: this
                            })
                            .catch(error => {
                                this.error =
                                    "File operation failed, please try again later.";
                                setTimeout(() => (this.loading = false), 1000);
                            });
                        this.selected = [];
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
        },
        viewFile(item) {
            this.$router.push({
                name: `view-file`,
                params: { file: item.id, mime: item.upload_mime }
            });
        }
    }
};
</script>

<style lang="scss">
@import "../styles/_loader.scss";

.media-viewer {
    margin: 0 auto;
}
</style>