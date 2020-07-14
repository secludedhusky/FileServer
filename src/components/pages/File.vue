<template loading>
    <v-container fill-height fill-width>
        <embed class="file" v-bind:type="this.file.mime" v-bind:src="this.file.url" />
    </v-container>
</template>

<script>
export default {
    name: "file",
    data() {
        return {
            loader: null,
            loading: true,
            file: {
                url: null,
                mime: null
            }
        };
    },
    created: function() {
        let mime = this.$route.params.mime;

        if (!this.$route.params.mime) {
            let file = this.$store
                .dispatch("getFiles", {
                    self: this,
                    fileId: this.$route.params.file
                })
                .then(response => {
                    console.log();
                    this.file = {
                        url: `/api/v1/user/file/${this.$route.params.file}`,
                        mime: response.data[0].upload_mime
                    };
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            this.file = {
                url: `/api/v1/user/file/${this.$route.params.file}`,
                mime: `${this.$route.params.mime}`
            };
        }
    }
};
</script>

<style>
.file {
    width: 100%;
    height: 100%;
    object-fit: scale-down;
}
</style>