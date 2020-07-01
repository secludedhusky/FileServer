<template>
    <div>
        <md-empty-state
            md-icon="home"
            md-label="Upload Server"
            md-description="Welcome, this service is currently under construction."
        >
            <md-button v-on:click="navigate('login')" class="md-primary md-raised">Login</md-button>
        </md-empty-state>
    </div>
</template>

<script>
export default {
    name: "home-page",
    methods: {
        navigate(page) {
            if(this.$router.history.current.name !== page) {
                this.$router.push(page);
            }
        }
    }
};
</script>