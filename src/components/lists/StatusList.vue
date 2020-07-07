<template>
    <v-container>
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
                <v-alert type="error">{{ error }}</v-alert>
            </v-col>
        </v-row>

        <v-data-table
            loading-text="Loading..."
            :headers="headers"
            :items="this.$store.getters.getStats"
            :hide-default-footer="true"
            class="elevation-1"
        ></v-data-table>
    </v-container>
</template>

<script>
export default {
    name: "status-list",
    data() {
        return {
            headers: [
                { text: "File Count", value: "files", sortable: false },
                { text: "View Count", value: "views", sortable: false },
                { text: "Branch", value: "branch", sortable: false },
                { text: "Version", value: "version", sortable: false }
            ],
            loader: null,
            loading: false,
            error: ""
        };
    },
    created() {
        this.$store.dispatch("getStats", this);
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
                .then(() => {
                    setTimeout(() => (this.loading = false), 1000);
                })
                .catch(() => {
                    this.error = "Failed to get stats, please try again later.";
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