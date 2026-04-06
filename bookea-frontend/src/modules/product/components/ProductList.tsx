import React, { useEffect, useState } from 'react';
import { ProductResponse } from '../type/product';
import { productService } from '../services/productService';

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fonction pour charger les produits au démarrage
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getAllProducts();
            setProducts(data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // useEffect se lance automatiquement quand le composant apparaît
    useEffect(() => {
        fetchProducts();
    }, []);

    // Fonction utilitaire pour les couleurs des badges selon le type
    const getTypeBadge = (type: string) => {
        switch(type) {
            case 'LIVRE': return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded border border-blue-200">📚 Livre</span>;
            case 'MATERIEL_INFORMATIQUE': return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded border border-green-200">💻 Info</span>;
            case 'HIFI': return <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded border border-purple-200">🎧 Hi-Fi</span>;
            default: return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded border border-gray-200">{type}</span>;
        }
    };

    if (loading) return <div className="text-center py-10 text-gray-500 font-semibold">Chargement du catalogue...</div>;
    if (error) return <div className="text-center py-10 text-red-500 font-semibold">Erreur : {error}</div>;

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">Catalogue Actuel ({products.length})</h2>
                <button onClick={fetchProducts} className="text-sm bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 py-1.5 px-3 rounded shadow-sm transition">
                    🔄 Rafraîchir
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Nom du produit</th>
                            <th className="px-6 py-4">Prix</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Aucun produit dans la base de données.</td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">#{product.id}</td>
                                    <td className="px-6 py-4">{getTypeBadge(product.type)}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-800">{product.name}</td>
                                    <td className="px-6 py-4 text-blue-600 font-bold">{product.price.toFixed(2)} €</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-bold ${product.stock > 5 ? 'text-green-600' : 'text-red-500'}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center space-x-2">
                                        {/* Boutons d'actions (Même s'ils ne font rien pour l'instant, c'est bien pour le design) */}
                                        <button className="font-medium text-blue-600 hover:text-blue-800 hover:underline">Éditer</button>
                                        <button className="font-medium text-red-600 hover:text-red-800 hover:underline">Supprimer</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;