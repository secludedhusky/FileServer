<template>
    <div id="app">
        <md-toolbar class="md-accent" md-elevation="1">
            <h3 class="md-title" style="flex: 1">Home</h3>
            <md-button v-on:click="navigate('home')">Home</md-button>
            <md-button v-on:click="navigate('login')">Login</md-button>
        </md-toolbar>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: "home-page",
    props: {
        pageTitle: String
    },
    methods: {
        navigate(page) {
            if(this.$router.history.current.name !== page) {
                this.$router.push(page);
            }
        }
    }
};
</script>