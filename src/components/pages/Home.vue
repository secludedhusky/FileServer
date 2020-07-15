<template>
    <v-container>
        <h1>Home</h1>

        <v-row justify="center" cols="12" sm="8">
            <v-img contain height="300px" width="154px" src="./assets/logo.png"></v-img>
        </v-row>

        <home-form></home-form>
    </v-container>
</template>

<script>
import HomeForm from "../forms/HomeForm.vue";

export default {
    name: "home",
    components: {
        HomeForm
    }
};
</script>
