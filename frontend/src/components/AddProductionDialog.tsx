import { useState } from "react";
import { CATEGORIES } from "../constants/categories";

interface Props {
  onClose: () => void;
  onSave: (product: any) => void;
}

export default function AddProductDialog({ onClose, onSave }: Props) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    sku: "",
    price: 0,
    stock: 0,
  });

  // Validation: all fields must be filled
  const isValid =
    form.name.trim() !== "" &&
    form.category.trim() !== "" &&
    form.sku.trim() !== "" &&
    form.price !== null &&
    form.stock !== null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Product Name</label>
            <input
              className={`w-full border rounded px-3 py-2 ${
                form.name.trim() === "" ? "border-red-500" : ""
              }`}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              className={`w-full border rounded px-3 py-2 bg-white ${
                form.category.trim() === "" ? "border-red-500" : ""
              }`}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Select</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">SKU</label>
            <input
              className={`w-full border rounded px-3 py-2 ${
                form.sku.trim() === "" ? "border-red-500" : ""
              }`}
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Price ($)</label>
            <input
              type="number"
              className={`w-full border rounded px-3 py-2 ${
                form.price === null ? "border-red-500" : ""
              }`}
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Stock</label>
            <input
              type="number"
              className={`w-full border rounded px-3 py-2 ${
                form.stock === null ? "border-red-500" : ""
              }`}
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: Number(e.target.value) })
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => onSave(form)}
            disabled={!isValid}
            className={`px-4 py-2 text-white rounded ${
              isValid
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}
