<template>
    <v-container>
        <v-form>
            <!-- Server error message -->
            <v-row justify="center" v-if="error" cols="12">
                <v-col sm="8">
                    <v-alert type="error">{{ error }}</v-alert>
                </v-col>
            </v-row>

            <!-- Username and password inputs -->
            <v-row justify="center" cols="12">
                <v-col sm="8">
                    <v-text-field v-model="username" label="Username" type="text" filled></v-text-field>
                </v-col>
            </v-row>
            <v-row justify="center" cols="12">
                <v-col sm="8">
                    <v-text-field v-model="password" label="Password" type="password" filled></v-text-field>
                </v-col>
            </v-row>

            <!-- Submit buttons -->
            <v-row justify="center" cols="12">
                <v-col sm="4">
                    <v-btn
                        :loading="loading"
                        :disabled="loading"
                        color="primary"
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
                <v-col sm="4">
                    <v-btn block outlined>
                        Forgot
                        <template v-slot:loader>
                            <span class="custom-loader">
                                <v-icon light>cached</v-icon>
                            </span>
                        </template>
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>
    </v-container>
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
@import "../styles/_loader.scss";
@import "../styles/_autocomplete.scss";
</style>