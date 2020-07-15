<template>
    <v-container>
        <v-form ref="form" v-model="valid" lazy-validation>
            <!-- Account creation message -->
            <v-row justify="center" v-if="accountCreated" cols="12">
                <v-col sm="8">
                    <v-alert type="success">Account has been created! Redirecting to login...</v-alert>
                </v-col>
            </v-row>

            <!-- Server error message -->
            <v-row justify="center" v-if="error" cols="12">
                <v-col sm="8">
                    <v-alert type="error">{{ error }}</v-alert>
                </v-col>
            </v-row>

            <!-- Email input -->
            <v-row justify="center" cols="12">
                <v-col sm="8">
                    <v-text-field
                        v-model="email"
                        :rules="emailRules"
                        :error-messages="emailError"
                        label="Email"
                        type="email"
                        filled
                        @change="resetValidation('email')"
                    ></v-text-field>
                </v-col>
            </v-row>

            <!-- Username and password inputs -->
            <v-row justify="center" cols="8">
                <v-col sm="4">
                    <v-text-field
                        v-model="username"
                        :rules="usernameRules"
                        :error-messages="usernameError"
                        label="Username"
                        type="text"
                        filled
                        @change="resetValidation('username')"
                    ></v-text-field>
                </v-col>
                <v-col sm="4">
                    <v-text-field
                        :rules="passwordRules"
                        v-model="password"
                        label="Password"
                        type="password"
                        filled
                    ></v-text-field>
                </v-col>
            </v-row>

            <!-- Submit button -->
            <v-row justify="center" cols="12">
                <v-col sm="8">
                    <v-btn
                        :loading="loading"
                        :disabled="!valid || loading"
                        color="primary"
                        block
                        @click="loader = 'loading'; register()"
                    >
                        Regsiter
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
    name: "registration-form",
    data() {
        return {
            valid: false,

            email: null,
            emailError: [],
            emailRules: [
                v => !!v || "Email is required",
                v => /.+@.+\..+/.test(v) || "Email must be valid"
            ],

            username: null,
            usernameError: [],
            usernameRules: [
                v => !!v || "Username is required",
                v =>
                    (v && v.length <= 50) ||
                    "Username cannot be more than 50 characters",
                v =>
                    /^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/.test(v) ||
                    "Username should only contain letters, number, and underscores"
            ],

            password: null,
            passwordRules: [
                v => !!v || "Password is required",
                v => (v && v.length > 8) || "Must be at least 8 characters"
            ],

            loader: null,
            loading: false,

            lazy: false,

            error: "",
            accountCreated: false
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
        resetValidation(input) {
            switch (input) {
                case "username":
                    this.usernameError = [];
                    break;
                case "email":
                    this.emailError = [];
                    break;
            }
        },
        register() {
            this.error = "";

            this.$store
                .dispatch("register", {
                    self: this,
                    username: this.username,
                    password: this.password,
                    email: this.email
                })
                .then(response => {
                    if (response.status != 201) {
                        this.error = `${response.status} - ${response.statusText}`;
                    }
                    setTimeout(() => (this.loading = false), 1000);
                })
                .catch(error => {
                    error
                        .json()
                        .then(data => {
                            data.data.forEach(item => {
                                switch (item) {
                                    case "user_name":
                                        this.usernameError =
                                            "Username is already taken.";
                                        break;
                                    case "user_email":
                                        this.emailError =
                                            "Email is already taken.";
                                        break;
                                }
                            });
                        })
                        .catch(ex => {
                            this.error = `${error.status} - ${error.statusText}`;
                        });

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