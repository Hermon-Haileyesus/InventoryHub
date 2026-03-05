import { useState, useEffect } from "react";
import type { Product } from "../types/Products";
import { CATEGORIES } from "../constants/categories";

interface Props {
  product: Product | null;
  onClose: () => void;
  onSave: (updated: Product) => void;
}

export default function EditProductDialog({ product, onClose, onSave }: Props) {
  const [form, setForm] = useState<Product | null>(product);

  useEffect(() => {
    setForm(product);
  }, [product]);

  if (!product || !form) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Product</h2>

        <div className="space-y-4">
          {/* Product Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Product Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Category</label>

            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border rounded px-3 py-2 bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* SKU */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">SKU</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Price ($)</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
            />
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Stock</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: Number(e.target.value) })
              }
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              const res = await fetch(
                `${import.meta.env.VITE_API_URL}/products/${form.id}`,
                {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: form.name,
                    category: form.category,
                    sku: form.sku,
                    price: form.price,
                    stock: form.stock,
                  }),
                },
              );

              const result = await res.json();
              onSave(result.product);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
