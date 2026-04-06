import React, { useState } from 'react';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList'; // <--- Import du nouveau composant

const AdminProductPage: React.FC = () => {
    // État pour gérer la vue active (formulaire ou liste)
    const [activeTab, setActiveTab] = useState<'LIST' | 'ADD'>('LIST');

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* En-tête du Tableau de Bord */}
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight">
                        Tableau de bord Admin
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Gérez votre catalogue Bookea Store facilement.
                    </p>
                </div>

                {/* Les Onglets (Tabs) */}
                <div className="flex justify-center mb-6">
                    <div className="inline-flex bg-gray-200 rounded-lg p-1 shadow-inner">
                        <button 
                            onClick={() => setActiveTab('LIST')}
                            className={`py-2 px-6 rounded-md text-sm font-bold transition-all ${activeTab === 'LIST' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            📋 Catalogue
                        </button>
                        <button 
                            onClick={() => setActiveTab('ADD')}
                            className={`py-2 px-6 rounded-md text-sm font-bold transition-all ${activeTab === 'ADD' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            ➕ Ajouter un produit
                        </button>
                    </div>
                </div>

                {/* Affichage Conditionnel */}
                <div className="transition-all duration-300">
                    {activeTab === 'LIST' ? <ProductList /> : <ProductForm />}
                </div>
                
            </div>
        </div>
    );
};

export default AdminProductPage;