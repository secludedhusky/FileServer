<template>
    <v-container>
        <h1>Home</h1>
        <home-form></home-form>
        <status-list></status-list>
    </v-container>
</template>

<script>
import StatusList from "../lists/StatusList.vue";
import HomeForm from "../forms/HomeForm.vue";

export default {
    name: "home",
    components: {
        HomeForm,
        StatusList
    }
};
</script>
