import { ProductType, ProductResponse } from "../type/product";

const BASE_URL = "/api"; // On utilise le chemin relatif pour passer par le proxy Vite

export const productService = {
  createProduct: async (
    type: ProductType,
    data: any,
    imageFile?: File,
  ): Promise<ProductResponse> => {
    const endpoints: Record<ProductType, string> = {
      LIVRE: "/books",
      MATERIEL_INFORMATIQUE: "/computers",
      HIFI: "/hifi",
    };

    // Création du FormData pour envoyer du binaire (image) + du texte (JSON)
    const formData = new FormData();

    // On ajoute les données du produit sous forme de Blob JSON
    // pour que Spring Boot puisse le mapper avec @RequestPart
    formData.append(
      "product",
      new Blob([JSON.stringify(data)], {
        type: "application/json",
      }),
    );

    // On ajoute le fichier image s'il existe
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await fetch(`${BASE_URL}${endpoints[type]}`, {
      method: "POST",
      // Note: On ne définit PAS de Content-Type, le navigateur le fera automatiquement avec le "boundary"
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la création du produit",
      );
    }

    return response.json();
  },

  getAllProducts: async (): Promise<ProductResponse[]> => {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) throw new Error("Impossible de charger les produits");
    return response.json();
  },

  deleteProduct: async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erreur lors de la suppression");
  },
};
