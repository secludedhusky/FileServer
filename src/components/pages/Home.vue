<template>
    <v-container>
        <h1>Home</h1>
        <status-list></status-list>
    </v-container>
</template>

<script>
import StatusList from "../lists/StatusList.vue";

export default {
    name: "home",
    components: {
        StatusList
    }
};
</script>
