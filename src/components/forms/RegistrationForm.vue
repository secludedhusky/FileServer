<template>
    <v-form ref="form" v-model="valid" lazy-validation>
        <v-container>
            <v-row v-if="accountCreated">
                <v-col cols="12" sm="12">
                    <v-alert type="success">Account has been created! Redirecting to login...</v-alert>
                </v-col>
            </v-row>

            <v-row v-if="error">
                <v-col cols="12" sm="12">
                    <v-alert type="error">{{ error }}</v-alert>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="12">
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
            <v-row>
                <v-col cols="12" sm="6">
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
                <v-col cols="12" sm="6">
                    <v-text-field
                        :rules="passwordRules"
                        v-model="password"
                        label="Password"
                        type="password"
                        filled
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="12">
                    <v-btn
                        :loading="loading"
                        :disabled="!valid || loading"
                        color="secondary"
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
        </v-container>
    </v-form>
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

.fade-enter-active,
.fade-leave-active {
    transition-duration: 0.3s;
    transition-property: opacity;
    transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
    opacity: 0;
}
</style>