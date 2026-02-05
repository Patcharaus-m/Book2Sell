import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBook } from "../../context/BookContext";
import { ArrowLeft, Save, Plus } from "lucide-react";

export default function BookForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { books, addBook, updateBook } = useBook();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        title: "",
        author: "",
        category: "Fiction",
        sellingPrice: "",
        originalPrice: "",
        status: "available",
        stock: 1,
        conditionRating: 90,
        defectDescription: "",
        images: [""], // Start with one input
        isbn: "",
        publisher: ""
    });

    useEffect(() => {
        if (isEdit) {
            const book = books.find(b => b.id === id);
            if (book) {
                setFormData({ ...book });
            }
        }
    }, [id, isEdit, books]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validate
        const payload = {
            ...formData,
            sellingPrice: Number(formData.sellingPrice),
            originalPrice: Number(formData.originalPrice),
            stock: Number(formData.stock),
            conditionRating: Number(formData.conditionRating),
            images: formData.images.filter(img => img.trim() !== "") // Clean empty
        };

        // Default image if none provided
        if (payload.images.length === 0) payload.images = ["https://placehold.co/400x600?text=No+Image"];

        if (isEdit) {
            updateBook(id, payload);
        } else {
            addBook(payload);
        }
        navigate("/admin");
    };

    const handleImageChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const addImageField = () => {
        setFormData({ ...formData, images: [...formData.images, ""] });
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <button
                onClick={() => navigate("/admin")}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </button>

            <h1 className="text-2xl font-bold mb-6">{isEdit ? "Edit Book" : "Add New Book"}</h1>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">

                {/* Basic Info */}
                <div className="space-y-4">
                    <h3 className="font-bold border-b pb-2">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                required
                                className="input-field"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                            <input
                                required
                                className="input-field"
                                value={formData.author}
                                onChange={e => setFormData({ ...formData, author: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                            <input className="input-field" value={formData.isbn} onChange={e => setFormData({ ...formData, isbn: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                className="input-field"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                {["Fiction", "Self-improvement", "Manga", "Technology", "History"].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Pricing & Stock */}
                <div className="space-y-4">
                    <h3 className="font-bold border-b pb-2">Pricing & Stock</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                            <input type="number" className="input-field" value={formData.originalPrice} onChange={e => setFormData({ ...formData, originalPrice: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price</label>
                            <input type="number" required className="input-field" value={formData.sellingPrice} onChange={e => setFormData({ ...formData, sellingPrice: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                            <input type="number" className="input-field" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                        </div>
                    </div>
                </div>

                {/* Condition - CRITICAL */}
                <div className="space-y-4">
                    <h3 className="font-bold border-b pb-2 text-blue-600">Condition Report</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Condition Rating (%)</label>
                            <input
                                type="number" min="0" max="100"
                                className="input-field"
                                value={formData.conditionRating}
                                onChange={e => setFormData({ ...formData, conditionRating: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select className="input-field" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                <option value="available">Available</option>
                                <option value="reserved">Reserved</option>
                                <option value="sold">Sold</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Defect Description</label>
                        <textarea
                            className="input-field h-24"
                            placeholder="e.g., Pen marks on page 10, Spine slightly creased..."
                            value={formData.defectDescription}
                            onChange={e => setFormData({ ...formData, defectDescription: e.target.value })}
                        />
                    </div>
                </div>

                {/* Images */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="font-bold">Images</h3>
                        <button type="button" onClick={addImageField} className="text-sm text-blue-600 flex items-center gap-1">
                            <Plus className="h-4 w-4" /> Add URL
                        </button>
                    </div>
                    {formData.images.map((img, idx) => (
                        <div key={idx} className="flex gap-2">
                            <input
                                className="input-field flex-1"
                                placeholder="Image URL (e.g. from placeholder or storage)"
                                value={img}
                                onChange={e => handleImageChange(idx, e.target.value)}
                            />
                            {/* Preview */}
                            {img && <img src={img} alt="Preview" className="h-10 w-10 object-cover rounded border" />}
                        </div>
                    ))}
                    <p className="text-xs text-gray-500">Note: Enter valid image URLs. In a real app, this would be a file upload.</p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate("/admin")}
                        className="px-6 py-2 border rounded-lg hover:bg-gray-50 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn-primary flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" /> Save Book
                    </button>
                </div>

            </form>
        </div>
    );
}
