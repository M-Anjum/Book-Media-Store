import { ProductType, ProductResponse } from '../type/product';

const BASE_URL = "http://localhost:8080/api";

export const productService = {
    
    // Méthode générique pour créer n'importe quel type de produit
    createProduct: async <T>(type: ProductType, data: T): Promise<ProductResponse> => {
        
        // On détermine l'URL selon le type (comme dans ton Backend)
        const endpoints: Record<ProductType, string> = {
            'LIVRE': '/books',
            'MATERIEL_INFORMATIQUE': '/computers',
            'HIFI': '/hifi'
        };

        const response = await fetch(`${BASE_URL}${endpoints[type]}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de la création du produit");
        }

        return response.json();
    },

    // Optionnel : Récupérer tous les produits (Global)
    getAllProducts: async (): Promise<ProductResponse[]> => {
        const response = await fetch(`${BASE_URL}/products`);
        if (!response.ok) throw new Error("Impossible de charger les produits");
        return response.json();
    },
    deleteProduct: async (id: number): Promise<void> => {
        const response = await fetch(`${BASE_URL}/products/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error("Erreur lors de la suppression");
        }
    }
};