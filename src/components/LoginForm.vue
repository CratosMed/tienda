<template>
    <v-container class="d-flex justify-center align-center fill-height">
        <v-card width="400" class="pa-4">
            <v-card-title class="justify-center">Iniciar Sesión</v-card-title>
            <v-card-text>
                <v-form ref="loginForm" @submit.prevent="handleSubmit">
                    <v-text-field v-model="email" label="Correo Electrónico" type="email"
                        :rules="[rules.required, rules.email]" outlined>
                    </v-text-field>
                    <v-text-field v-model="password" label="Contraseña" type="password" :rules="[rules.required]"
                        outlined>
                    </v-text-field>
                    <v-btn type="submit" color="primary" block :loading="loading">
                        Iniciar Sesión
                    </v-btn>
                    <v-btn @click="redirectToRegister" color="secondary" block>
                        Registrar
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useUserStore } from '../stores/userStore'; // Importar la tienda de usuario

const email = ref('');
const password = ref('');
const loading = ref(false);
const rules = {
    required: (value) => !!value || 'Este campo es obligatorio.',
    email: (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Debe ser un correo válido.',
};

const router = useRouter();
const userStore = useUserStore(); // Instancia de la tienda de usuario

const handleSubmit = async () => {
    loading.value = true;
    try {
        const response = await axios.post(
            'https://api.takeit.ciph3r.co/api/v1/login',
            new URLSearchParams({
                email: email.value,
                password: password.value,
            }),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }
        );

        console.log('Respuesta de la API:', response.data); // Para depuración

        alert('Inicio de sesión exitoso');

        // Guarda el token y la información del usuario en el store
        userStore.setUser(response.data.data.user, response.data.data.token);

        // Guarda el token en el localStorage
        if (response.data.data.token) {
            localStorage.setItem('token', response.data.data.token);
        } else {
            console.error('Token no encontrado en la respuesta');
        }

        // Redirige al usuario a la página principal
        router.push('/hello');
    } catch (error) {
        alert('Error al iniciar sesión, verifica tus credenciales.');
        console.error(error);
    } finally {
        loading.value = false;
    }
};

// Redirigir al formulario de registro
const redirectToRegister = () => {
    router.push('/register');
};
</script>

<style scoped>
.fill-height {
    min-height: 100vh;
}
</style>
