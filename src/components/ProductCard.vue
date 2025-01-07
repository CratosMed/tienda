<template>
    <v-card class="product-card">
        <!-- Imagen del producto -->
        <v-img :src="product.image?.url || defaultImage" aspect-ratio="1" class="product-image" cover></v-img>

        <!-- Detalles del producto -->
        <v-card-text>
            <h3 class="product-title">{{ product.name }}</h3>
            <p class="product-description">{{ product.resumen }}</p> <!-- Resumen corto -->

            <!-- Información adicional -->
            <div class="product-info">
                <p><strong>SKU:</strong> {{ product.sku }}</p>
                <p><strong>Peso:</strong> {{ product.weight }}g</p>
                <p><strong>Dimensiones:</strong> {{ product.width }} x {{ product.height }} x {{ product.lenght }} mm
                </p>
            </div>

            <div class="product-price">
                <span class="price">Bs {{ product.price }}</span>
            </div>
            <!-- Mostrar stock -->
            <div v-if="product.stock > 0" class="product-stock">
                <span>Stock disponible: {{ product.stock }}</span>
            </div>
            <div v-else class="out-of-stock">
                <span>Sin stock</span>
            </div>
            <!-- Oferta si es aplicable -->
            <v-btn v-if="product.make_offer" color="secondary" @click="makeOffer">
                Hacer una oferta
            </v-btn>
        </v-card-text>

        <!-- Botón de acción -->
        <v-card-actions>
            <v-btn color="primary" :disabled="!product.stock" @click="addToCart">
                {{ product.stock > 0 ? 'Agregar al carrito' : 'Sin stock' }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
// Props para recibir datos del producto
const props = defineProps({
    product: {
        type: Object,
        required: true,
    },
});

// Emite un evento al componente padre
const emit = defineEmits(["add-to-cart"]);

// Función para agregar al carrito
const addToCart = () => {
    if (props.product.stock > 0) {
        emit("add-to-cart", props.product.id, 1);
    }
};

// Función para hacer una oferta
const makeOffer = () => {
    emit("make-offer", props.product.id);
};

// Imagen por defecto
const defaultImage = "https://via.placeholder.com/300x300?text=Sin+imagen";
</script>

<style scoped>
.product-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    height: 100%;
}

.product-card-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 100%;
}

.product-image {
    width: 200px;
    /* Ajusta el tamaño según lo necesites */
    height: 200px;
    object-fit: cover;
}

.product-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
    color: #2d60a3;
}

.product-description {
    font-size: 12px;
    color: #555;
    margin-bottom: 16px;
}

.product-price .price {
    font-size: 16px;
    font-weight: 600;
    color: #26805a;
}

.product-stock,
.out-of-stock {
    font-size: 14px;
    color: #555;
    margin-top: 8px;
}

.out-of-stock {
    color: #d9534f;
    /* Rojo para indicar que no hay stock */
}

v-btn {
    width: 100%;
    font-size: 14px;
}
</style>
