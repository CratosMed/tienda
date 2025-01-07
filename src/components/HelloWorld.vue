<template>
  <v-app>
    <!-- Contenido principal -->
    <v-main>
      <v-container>
        <!-- Título principal -->
        <v-row justify="center" class="my-4">
          <v-col cols="12" md="8">
            <h1 class="text-center amazon-title">Tienda en Línea</h1>
          </v-col>
        </v-row>

        <!-- Cuadro de búsqueda -->
        <v-row justify="center">
          <v-col cols="12">
            <v-card class="mx-auto search-card" max-width="400">
              <v-card-text>
                <v-text-field :loading="loading" v-model="search" append-inner-icon="mdi-magnify"
                  label="Buscar productos" density="compact" variant="solo" hide-details single-line
                  @keyup.enter="fetchProducts" @click:append-inner="fetchProducts" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Categorías -->
        <v-row justify="center" class="my-4">
          <v-col cols="12" md="8">
            <h2 class="category-title">Categorías</h2>
            <v-chip-group>
              <v-chip v-for="category in categories" :key="category.uuid" class="amazon-category-chip"
                @click="filterByCategory(category.uuid)">
                {{ category.name }}
              </v-chip>
            </v-chip-group>
          </v-col>
        </v-row>

        <!-- Productos -->
        <v-row>
          <v-col cols="12">
            <h2 class="product-section-title">Productos</h2>
          </v-col>
          <v-col v-for="product in filteredProducts" :key="product.id" cols="12" sm="6" md="4">
            <ProductCard :product="product" @add-to-cart="addToCart" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import ProductCard from "../components/ProductCard.vue"; // Componente reutilizable para productos
import { useRouter } from "vue-router";
const router = useRouter();


// Configuración de Axios
const api = axios.create({
  baseURL: "https://api.takeit.ciph3r.co/api/v1/",
});

// Variables reactivas
const search = ref("");
const categories = ref([]);
const products = ref([]);
const loading = ref(false);



// Productos filtrados
const filteredProducts = computed(() => {
  let filtered = [...products.value];
  if (search.value.trim()) {
    filtered = filtered.filter((product) =>
      product.name.toLowerCase().includes(search.value.toLowerCase())
    );
  }
  if (selectedCategory.value) {
    filtered = filtered.filter(
      (product) => product.category_uuid === selectedCategory.value
    );
  }
  return filtered;
});

// Variable para mantener la categoría seleccionada
const selectedCategory = ref(null);

// Función para obtener productos
const fetchProducts = async () => {
  loading.value = true;
  try {
    const response = await api.get("/shop", {
      params: { per_page: 0, search: search.value },
    });
    products.value = response.data.data;
  } catch (error) {
    alert("Error al obtener productos. Inténtalo más tarde.");
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// Función para filtrar por categoría
const filterByCategory = async (category_uuid) => {
  loading.value = true; // Activar el estado de carga

  try {
    // Obtener el token almacenado en localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No se encontró un token de autenticación.");
      return;
    }

    const response = await api.get("/shop", {
      params: { category_uuid }, // Enviar el UUID de la categoría
      headers: {
        Authorization: `Bearer ${token}`, // Usar el token de localStorage
      },
    });

    products.value = response.data.data; // Actualizar los productos con los datos filtrados
  } catch (error) {
    alert("Error al filtrar productos por categoría. Inténtalo más tarde.");
    console.error(error);
  } finally {
    loading.value = false; // Desactivar el estado de carga
  }
};



// Función para obtener categorías
const fetchCategories = async () => {
  try {
    const response = await api.get("/shop/categories", {
      params: { per_page: 0 },
    });
    categories.value = response.data.data;
  } catch (error) {
    alert("Error al obtener categorías. Inténtalo más tarde.");
    console.error(error);
  }
};

// Función para agregar al carrito
const addToCart = async (product_id: number, stock: number) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      return;
    }

    const params = new URLSearchParams();
    params.append("product_id", String(product_id));
    params.append("stock", String(stock));

    const response = await api.post(
      "/carts",
      params,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.data.success) {
      const cartData = response.data.data;
      alert(`Producto agregado al carrito: ${cartData.product.name}`);
    } else {
      alert("Hubo un error al agregar el producto al carrito.");
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      alert("Sesión expirada. Por favor, inicia sesión nuevamente.");

      router.push("/");
    } else {
      alert("Error al agregar el producto al carrito.");
      console.error(error);
    }
  }
};


const navigateTo = (route) => {
  router.push(route);
};


// Llamadas iniciales
onMounted(() => {
  fetchCategories();
  fetchProducts();
});
</script>

<style scoped>
/* Estilos generales */
.amazon-title {
  font-family: "Amazon Ember", sans-serif;
  font-size: 50px;
  font-weight: 600;
  color: #080808;
}

.category-title,
.product-section-title {
  font-weight: bold;
  color: #131921;
}

.amazon-category-chip {
  background-color: #69b2b49d;
  color: #131921;
  padding: 12px 20px;
  font-weight: 600;
  margin-right: 10px;
  border-radius: 20px;
}

.search-card {
  box-shadow: 0px 2px 6px rgba(110, 90, 90, 0.1);
}

@media (max-width: 600px) {
  .amazon-title {
    font-size: 24px;
  }
}
</style>
