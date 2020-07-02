<template>
    <v-container>
        <h1> {{ message }} </h1>
    </v-container>
</template>

<script>
export default {
    name: "home",

    data: () => ({
        message: "Hello, world!"
    })
};
</script>
