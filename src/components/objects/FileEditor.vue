<template>
    <v-row justify="center">
        <v-dialog v-model="this.$store.getters.editorState.open" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon dark @click="closeEditor('cancel')">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>File Editor</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn dark text @click="closeEditor('save')">Save</v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <v-list three-line subheader>
                    <v-subheader>File Info</v-subheader>
                    <v-list-item>
                        <v-list-item-content>
                            <v-text-field v-model="file.upload_filename"></v-text-field>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-divider></v-divider>
                <v-list three-line subheader>
                    <v-subheader>File Settings</v-subheader>
                    <v-list-item>
                        <v-list-item-action>
                            <v-checkbox v-model="file.upload_private"></v-checkbox>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>Private</v-list-item-title>
                            <v-list-item-subtitle>Sets this file to private. Other users will not be able to access this file unless you give them permission.</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
export default {
    name: "file-editor",
    data() {
        return {
            file: {}
        };
    },
    methods: {
        closeEditor() {
            console.log("close file");
            this.$store.dispatch("closeEditor", {
                self: this,
                mode: "close",
                data: {}
            });
        }
    }
};
</script>