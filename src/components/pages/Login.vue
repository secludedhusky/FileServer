<template>
    <div>
        <md-empty-state md-icon="lock"></md-empty-state>
        <md-content>
                <md-layout-item>
                    <md-field>
                        <md-icon>cloud</md-icon>
                        <label>Username</label>
                        <md-input type="text"></md-input>
                    </md-field>
                </md-layout-item>
                <md-layout-item>
                    <md-field>
                        <md-icon>lock</md-icon>
                        <label>password</label>
                        <md-input type="password"></md-input>
                    </md-field>
                </md-layout-item>
                <md-layout-item>
                    <md-button>
                        Login
                    </md-button>
                </md-layout-item>
        </md-content>
    </div>
</template>

<script>
export default {
    name: "login-page",
    methods: {
        navigate(page) {
            if (this.$router.history.current.name !== page) {
                this.$router.push(page);
            }
        }
    }
};
</script>
