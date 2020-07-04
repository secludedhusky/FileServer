<template>
    <v-form ref="form" v-model="valid" lazy-validation>
        <v-container>
            <v-row v-if="accountCreated">
                <v-col cols="12" sm="12">
                    <v-alert type="success">
                        Account has been created, you can now login!
                        <br />Redirecting to login...
                    </v-alert>
                </v-col>
            </v-row>

            <div v-if="!accountCreated">
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
            </div>
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
                    "Username cannot be more than 50 characters"
            ],

            password: null,
            passwordRules: [v => !!v || "Password is required"],

            loader: null,
            loading: false,

            lazy: false,

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
            let response = fetch(`${process.env.API_URI_V1}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: this.email,
                    username: this.username,
                    password: this.password
                })
            });

            response
                .then(r => {
                    if (r.ok) {
                        this.accountCreated = true;
                        setTimeout(() => this.$router.push("login"), 2000);
                    } else {
                        console.error(`Login failed: ${r.statusText}`);
                        r.json().then(data => {
                            data.conflicts.forEach(conflict => {
                                switch (conflict) {
                                    case "user_name":
                                        this.usernameError =
                                            "Username is taken";
                                        break;
                                    case "user_email":
                                        this.emailError =
                                            "Email is already in use";
                                        break;
                                    default:
                                        // Custom error
                                        break;
                                }
                            });
                        });
                    }
                    setTimeout(() => (this.loading = false), 1000);
                })
                .catch(error => {
                    console.error(error);
                    setTimeout(() => (this.loading = false), 1000);
                });
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