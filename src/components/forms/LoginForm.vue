<template>
    <v-form>
        <v-container>
            <v-row>
                <v-col cols="12" sm="6">
                    <v-text-field v-model="username" label="Username" type="text" filled></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                    <v-text-field v-model="password" label="Password" type="password" filled></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="text-right" cols="12" sm="12">
                    <v-btn
                        :loading="loading"
                        :disabled="loading"
                        color="info"
                        @click="loader = 'loading'"
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
            loading: false
        };
    },
    watch: {
        loader() {
            this.login();
        }
    },
    methods: {
        login() {
            const l = this.loader;
            this[l] = true;

            let response = fetch(`${process.env.API_URI_V1}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: this.username,
                    password: this.password
                })
            });

            response
                .then(r => {
                    if (r.ok) {
                        // get token
                        setTimeout(() => (this[l] = false), 1000);
                    } else {
                        console.error(`Login failed: ${r.statusText}`);
                        setTimeout(() => (this[l] = false), 1000);
                    }
                })
                .catch(error => {
                    console.error(error);
                });

            this.loader = null;
        }
    }
};
</script>

<style>
.custom-loader {
    animation: loader 1s infinite;
    display: flex;
}
@-moz-keyframes loader {
    from {
        transform: rotate(0);
    }
    to {
        transform: rotate(360deg);
    }
}
@-webkit-keyframes loader {
    from {
        transform: rotate(0);
    }
    to {
        transform: rotate(360deg);
    }
}
@-o-keyframes loader {
    from {
        transform: rotate(0);
    }
    to {
        transform: rotate(360deg);
    }
}
@keyframes loader {
    from {
        transform: rotate(0);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>