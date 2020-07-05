<template>
    <v-form>
        <v-container>
            <v-row v-if="error">
                <v-col cols="12" sm="12">
                    <v-alert type="error">{{ error }}</v-alert>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="6">
                    <v-text-field v-model="username" label="Username" type="text" filled></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="password" label="Password" type="password" filled></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="12">
                    <v-btn
                        :loading="loading"
                        :disabled="loading"
                        color="secondary"
                        block
                        @click="loader = 'loading'; login();"
                    >
                        Login
                        <template v-slot:loader>
                            <span class="custom-loader">
                                <v-icon light>cached</v-icon>
                            </span>
                        </template>
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script>
export default {
    name: "login-form",
    data() {
        return {
            username: null,
            password: null,

            loader: null,
            loading: false,

            error: ""
        };
    },
    watch: {
        loader() {
            let l = this.loader;
            this[l] = !this[l];

            this.loader = null;
        }
    },
    methods: {
        login() {
            this.error = "";

            this.$store
                .dispatch("login", {
                    self: this,
                    username: this.username,
                    password: this.password
                })
                .then(response => {
                    if (response.status != 201) {
                        this.error = `${response.status} - ${response.statusText}`;
                    }
                    setTimeout(() => (this.loading = false), 1000);
                })
                .catch(error => {
                    if (error.status === 401) {
                        this.error = `Your login details are incorrect, please try again.`;
                    } else {
                        this.error = `${response.status} - ${response.statusText}`;
                    }
                    setTimeout(() => (this.loading = false), 1000);
                });
        }
    }
};
</script>

<style>
/* Change autocomplete styles in WebKit */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
    border: none;
    -webkit-text-fill-color: #ffffff;
    box-shadow: #ffffff;
    -webkit-box-shadow: none;
    transition: background-color 5000s ease-in-out 0s;
}

.custom-loader {
    animation: loader 1s infinite;
    display: flex;
}
@-moz-keyframes loader {
    from {
        transform: rotate(360deg);
    }
    to {
        transform: rotate(0);
    }
}
@-webkit-keyframes loader {
    from {
        transform: rotate(360deg);
    }
    to {
        transform: rotate(0);
    }
}
@-o-keyframes loader {
    from {
        transform: rotate(360deg);
    }
    to {
        transform: rotate(0);
    }
}
@keyframes loader {
    from {
        transform: rotate(360deg);
    }
    to {
        transform: rotate(0);
    }
}
</style>