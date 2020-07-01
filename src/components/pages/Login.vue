<template>
    <div>
        <md-empty-state md-icon="lock"></md-empty-state>
    </div>
</template>

<script>
export default {
    name: "login-page",
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