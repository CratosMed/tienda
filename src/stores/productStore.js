import { defineStore } from 'pinia';

export const useProductStore = defineStore('products', {
    state: () => ({
        products: [], // Lista de productos
        selectedCategory: null, // Categoría seleccionada
    }),

    actions: {
        // Establecer los productos en el store
        setProducts(products) {
            this.products = products;
        },

        // Establecer la categoría seleccionada
        setSelectedCategory(category) {
            this.selectedCategory = category;
        },
    },
});
