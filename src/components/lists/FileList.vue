<template>
    <v-container>
        <div v-for="file in files" :key="file.name">
            <v-row>
                <v-col>{{ file.name }}</v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script>
export default {
    name: "file-list",
    data: () => ({
        files: []
    })
};
</script>