<template>
    <v-container>
        <h1>Home</h1>
        <home-form></home-form>
    </v-container>
</template>

<script>
import HomeForm from "../forms/HomeForm.vue";

export default {
    name: "home",
    components: {
        HomeForm,
    }
};
</script>
