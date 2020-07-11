<template>
    <v-container>
        <v-layout column>
            <v-subheader>
                Server Statistics
                <v-btn
                    :loading="loading"
                    :disabled="loading"
                    icon
                    color="green"
                    @click="loader = 'loading'; getStats()"
                >
                    <v-icon>mdi-cached</v-icon>
                    <template v-slot:loader>
                        <span class="custom-loader">
                            <v-icon light>cached</v-icon>
                        </span>
                    </template>
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
                :headers="headers"
                :items="this.$store.getters.getStats"
                :hide-default-footer="true"
                class="elevation-1"
            ></v-data-table>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: "stats-list",
    data() {
        return {
            headers: [
                { text: "File Count", value: "files", sortable: false },
                { text: "View Count", value: "views", sortable: false },
                { text: "Branch", value: "branch", sortable: false },
                { text: "Version", value: "version", sortable: false }
            ],
            loader: null,
            loading: true,
            error: ""
        };
    },
    created() {
        this.getStats();
    },
    watch: {
        loader() {
            let l = this.loader;
            this[l] = !this[l];

            this.loader = null;
        }
    },
    methods: {
        getStats() {
            this.error = "";

            this.$store
                .dispatch("getStats", this)
                .then(r => {
                    setTimeout(() => (this.loading = false), 1000);
                })
                .catch(e => {
                    this.error = "Failed to get stats, please try again later.";
                    setTimeout(() => (this.loading = false), 1000);
                });
        }
    }
};
</script>

<style lang="scss">
@import "../styles/_loader.scss";
</style>