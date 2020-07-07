<template>
    <v-container>
        <h1>Statistics</h1>
        <stats-list></stats-list>
    </v-container>
</template>

<script>
import StatsList from "../lists/StatsList.vue";
export default {
    name: "statistics",
    components: {
        StatsList
    }
};
</script> 
