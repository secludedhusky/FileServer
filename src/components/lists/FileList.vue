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
            :class="{mobile: isMobile}"
            @click:row="viewFile"
            :show-select="!isMobile"
            v-resize="onResize"
        >
            <template v-slot:item.upload_date="{ item }">
                <span>{{ moment(item.upload_date).fromNow() }}</span>
            </template>
            <template v-if="!isMobile" v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="fileOperation('download', item)">mdi-download</v-icon>
                <v-icon small class="mr-2" @click="fileOperation('edit', item)">mdi-pencil</v-icon>
                <v-icon small color="red" @click="fileOperation('delete', item)">mdi-delete</v-icon>
            </template>
            <template v-else v-slot:item.actions="{ item }">
                <v-icon large class="mr-2" @click="fileOperation('download', item)">mdi-download</v-icon>
                <v-icon large class="mr-2" @click="fileOperation('edit', item)">mdi-pencil</v-icon>
                <v-icon large color="red" @click="fileOperation('delete', item)">mdi-delete</v-icon>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
export default {
    name: "file-list",
    data() {
        return {
            loader: null,
            loading: true,
            preview: {
                open: false,
                url: null,
                mime: null
            },
            error: "",
            selected: [],
            modes: ["download", "edit", "delete"],
            mobile: null
        };
    },
    computed: {
        headers() {
            let headers = [
                { text: "File Name", align: "start", value: "upload_filename" }
            ];

            if (!this.isMobile) {
                headers.push({
                    text: "Uploaded",
                    value: "upload_date",
                    sortable: true
                });
                headers.push({
                    text: "Views",
                    value: "upload_views",
                    sortable: true
                });
            }

            headers.push({
                text: "Actions",
                value: "actions",
                sortable: true,
                align: "right"
            });

            return headers;
        },
        isMobile() {
            this.mobile = window.innerWidth < 820;
            return this.mobile;
        }
    },
    created() {
        this.getFiles();
    },
    watch: {
        loader() {
            let l = this.loader;
            this[l] = !this[l];

            this.loader = null;
        },
        mobile: {
            handler: value => {
                console.log("changed isMobile");
            }
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
        },
        onResize() {
            this.mobile = window.innerWidth < 820;
        }
    }
};
</script>

<style lang="scss">
@import "../styles/_loader.scss";
.mobile {
    color: #333;
}

@media screen and (max-width: 768px) {
    .mobile table.v-table tr {
        max-width: 100%;
        position: relative;
        display: block;
    }

    .mobile table.v-table tr:nth-child(odd) {
        border-left: 6px solid deeppink;
    }

    .mobile table.v-table tr:nth-child(even) {
        border-left: 6px solid cyan;
    }

    .mobile table.v-table tr td {
        display: flex;
        width: 100%;
        border-bottom: 1px solid #f5f5f5;
        height: auto;
        padding: 10px;
    }

    .mobile table.v-table tr td ul li:before {
        content: attr(data-label);
        padding-right: 0.5em;
        text-align: left;
        display: block;
        color: #999;
    }
    .v-datatable__actions__select {
        width: 50%;
        margin: 0px;
        justify-content: flex-start;
    }
    .mobile .theme--light.v-table tbody tr:hover:not(.v-datatable__expand-row) {
        background: transparent;
    }
}
.flex-content {
    padding: 0;
    margin: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
}

.flex-item {
    padding: 5px;
    width: 50%;
    height: 40px;
    font-weight: bold;
}
</style>