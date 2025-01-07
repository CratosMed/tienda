<template>
    <v-container class="d-flex justify-center align-center fill-height">
        <v-card width="400" class="pa-4">
            <v-card-title class="justify-center">Registrar Cuenta</v-card-title>
            <v-card-text>
                <v-form ref="registerForm" @submit.prevent="handleSubmit">
                    <v-text-field v-model="name" label="Nombre" :rules="[rules.required]" outlined />
                    <v-text-field v-model="email" label="Correo Electrónico" type="email"
                        :rules="[rules.required, rules.email]" outlined />
                    <v-text-field v-model="password" label="Contraseña" type="password" :rules="[rules.required]"
                        outlined />
                    <v-text-field v-model="c_password" label="Confirmar Contraseña" type="password"
                        :rules="[rules.required, passwordMatch]" outlined />
                    <v-btn type="submit" color="primary" block :loading="loading">
                        Registrar
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useUserStore } from "../stores/userStore";

const name = ref("");
const email = ref("");
const password = ref("");
const c_password = ref("");
const loading = ref(false);

const rules = {
    required: (value) => !!value || "Este campo es obligatorio.",
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Debe ser un correo válido.",
};

const passwordMatch = (value) => value === password.value || "Las contraseñas no coinciden.";

const router = useRouter();
const userStore = useUserStore();

const handleSubmit = async () => {
    loading.value = true;
    try {
        const response = await axios.post(
            "https://api.takeit.ciph3r.co/api/v1/register",
            {
                email: email.value,
                name: name.value,
                password: password.value,
                c_password: c_password.value,
            },
            {
                headers: { "Content-Type": "application/json" },
            }
        );
        alert("Registro exitoso");
        console.log(response.data);

        // Guarda el token y la información del usuario en el store
        userStore.setUser(response.data.user, response.data.token);

        // Redirige al login después de un registro exitoso
        router.push("/");
    } catch (error) {
        alert("Error al registrar cuenta, intenta nuevamente.");
        console.error(error);
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.fill-height {
    min-height: 100vh;
}
</style>
