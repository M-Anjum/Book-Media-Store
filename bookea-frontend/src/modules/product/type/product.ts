// src/modules/product/type/product.ts

// 1. Les types d'Enums
export type ProductType = 'LIVRE' | 'MATERIEL_INFORMATIQUE' | 'HIFI';
export type BookCategory = 'ROMAN' | 'MANGA' | 'BD' | 'ESSAI';

// 2. L'interface de base (champs communs)
export interface BaseProductRequest {
    name: string;
    description?: string;
    price: number;
    stock: number;
    imageUrl?: string;
}

// 3. Les interfaces spécifiques (héritage)
export interface BookRequest extends BaseProductRequest {
    author: string;
    pageCount?: number;
    category: BookCategory;
}

export interface ComputerRequest extends BaseProductRequest {
    brand: string;
    processor?: string;
    ramSize?: number;
}

export interface HifiRequest extends BaseProductRequest {
    model: string;
    powerWatts?: number;
}

// Interface de réponse générique
export interface ProductResponse extends BaseProductRequest {
    id: number;
    type: ProductType;
    // Champs optionnels car dépendent du type reçu
    author?: string;
    pageCount?: number;
    category?: BookCategory;
    brand?: string;
    processor?: string;
    ramSize?: number;
    model?: string;
    powerWatts?: number;
}