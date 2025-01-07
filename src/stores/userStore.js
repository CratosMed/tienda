// stores/userStore.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null, // Información del usuario
        token: localStorage.getItem('token') || null, // El token guardado en localStorage
    }),

    actions: {
        // Acción para establecer el usuario y el token
        setUser(user, token) {
            this.user = user;
            this.token = token;
            localStorage.setItem('token', token); // Guardar el token en localStorage
        },

        // Acción para eliminar el usuario y el token (logout)
        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('token'); // Eliminar el token de localStorage
        },
    },

    getters: {
        // Getter para saber si el usuario está autenticado
        isAuthenticated: (state) => !!state.token,
    },
});
