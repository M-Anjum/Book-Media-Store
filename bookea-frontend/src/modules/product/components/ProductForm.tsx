// src/modules/product/components/ProductForm.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { ProductType, BookCategory } from '../type/product';
import { productService } from '../services/productService';

const ProductForm: React.FC = () => {
    // État pour le type de produit sélectionné
    const [type, setType] = useState<ProductType>('LIVRE');
    // État pour les données du formulaire (Partial car on construit l'objet)
    const [formData, setFormData] = useState<any>({ category: 'ROMAN' as BookCategory });
    const [loading, setLoading] = useState(false);

    // Gestion des changements dans les inputs, avec conversion numérique
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type: inputType } = e.target;
        // Conversion automatique en nombre si l'input est de type number
        const finalValue = inputType === 'number' ? parseFloat(value) : value;
        setFormData((prev: any) => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await productService.createProduct(type, formData);
            alert(`Succès ! ${type} enregistré avec succès.`);
            // Optionnel : réinitialiser le formulaire
        } catch (err: any) {
            alert("Erreur lors de la création : " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Classes Tailwind réutilisables pour les inputs et labels pour un design cohérent
    const inputClass = "w-full p-3 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block";
    const labelClass = "block mb-1 text-sm font-semibold text-gray-700";
    const helperClass = "text-xs text-gray-500 mt-1";

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-center text-gray-800 mb-8 uppercase tracking-wide">
                Ajouter un nouveau produit (Admin)
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* SÉLECTEUR DE TYPE */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className={labelClass}>TYPE DE PRODUIT</label>
                    <select 
                        value={type} 
                        onChange={(e) => { setType(e.target.value as ProductType); setFormData({ category: 'ROMAN' }); }}
                        className={inputClass}
                    >
                        <option value="LIVRE">📚 LIVRE</option>
                        <option value="MATERIEL_INFORMATIQUE">💻 MATÉRIEL INFORMATIQUE</option>
                        <option value="HIFI">🎧 HI-FI</option>
                    </select>
                </div>

                {/* CHAMPS COMMUNS */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Champs Communs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className={labelClass}>Nom du produit</label>
                            <input name="name" onChange={handleChange} required className={inputClass} placeholder="Ex: MacBook Pro..." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Prix (€)</label>
                                <input name="price" type="number" step="0.01" onChange={handleChange} required className={inputClass} placeholder="0.00" />
                                <p className={helperClass}>Entrez le prix en euros</p>
                            </div>
                            <div>
                                <label className={labelClass}>Stock</label>
                                <input name="stock" type="number" onChange={handleChange} required className={inputClass} placeholder="1" />
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className={labelClass}>Description</label>
                        <textarea name="description" rows={3} onChange={handleChange} className={inputClass} placeholder="Description détaillée du produit..." />
                    </div>

                    <div>
                        <label className={labelClass}>Image URL</label>
                        <input name="imageUrl" onChange={handleChange} className={inputClass} placeholder="https://..." />
                        <p className={helperClass}>Entrez l'URL de l'image du produit</p>
                    </div>
                </div>

                {/* CHAMPS SPÉCIFIQUES - Héritage dynamique avec couleurs */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                        Champs Spécifiques (Type : {type})
                    </h3>
                    
                    {type === 'LIVRE' && (
                        <div className="p-4 bg-blue-50 rounded-xl space-y-3 grid grid-cols-1 md:grid-cols-3 gap-4 md:items-start md:p-6 md:space-y-0">
                            <div>
                                <label className={labelClass}>Auteur</label>
                                <input name="author" onChange={handleChange} required className={inputClass} placeholder="Nom de l'auteur" />
                            </div>
                            <div>
                                <label className={labelClass}>Nombre de pages</label>
                                <input name="pageCount" type="number" onChange={handleChange} className={inputClass} placeholder="Ex: 350" />
                            </div>
                            <div>
                                <label className={labelClass}>Catégorie</label>
                                <select name="category" onChange={handleChange} className={inputClass}>
                                    <option value="ROMAN">Roman</option>
                                    <option value="MANGA">Manga</option>
                                    <option value="BD">BD</option>
                                    <option value="ESSAI">Essai</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {type === 'MATERIEL_INFORMATIQUE' && (
                        <div className="p-4 bg-green-50 rounded-xl space-y-3 grid grid-cols-1 md:grid-cols-3 gap-4 md:items-start md:p-6 md:space-y-0">
                            <div>
                                <label className={labelClass}>Marque</label>
                                <input name="brand" onChange={handleChange} required className={inputClass} placeholder="Dell, Apple" />
                            </div>
                            <div>
                                <label className={labelClass}>Processeur</label>
                                <input name="processor" onChange={handleChange} className={inputClass} placeholder="Intel i7, M3" />
                            </div>
                            <div>
                                <label className={labelClass}>RAM (Go)</label>
                                <input name="ramSize" type="number" onChange={handleChange} className={inputClass} placeholder="16, 32" />
                            </div>
                        </div>
                    )}

                    {type === 'HIFI' && (
                        <div className="p-4 bg-purple-50 rounded-xl space-y-3 grid grid-cols-1 md:grid-cols-2 gap-4 md:items-start md:p-6 md:space-y-0">
                            <div>
                                <label className={labelClass}>Modèle</label>
                                <input name="model" onChange={handleChange} required className={inputClass} placeholder="Référence du modèle" />
                            </div>
                            <div>
                                <label className={labelClass}>Puissance (Watts)</label>
                                <input name="powerWatts" type="number" onChange={handleChange} className={inputClass} placeholder="120" />
                            </div>
                        </div>
                    )}
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full py-3 px-4 text-white font-bold rounded-xl flex justify-center items-center gap-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition duration-150 ease-in-out`}
                >
                    {loading ? 'ENREGISTREMENT...' : 'ENREGISTRER LE PRODUIT ✓'}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;