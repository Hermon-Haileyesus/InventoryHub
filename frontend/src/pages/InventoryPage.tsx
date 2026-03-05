import { useReducer, useEffect, useState, useMemo } from "react";
import InventoryTable from "../components/InventoryTable";
import { inventoryReducer } from "../state/inventoryReducer";
import EditProductDialog from "../components/EditProdudctionDialog";
import type { Product } from "../types/Products";
import DeleteProductDialog from "../components/DeleteProductionDialog";

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const initialState = {
    products: [],
    loading: true,
    error: "",
  };

  const [state, dispatch] = useReducer(inventoryReducer, initialState);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${apiUrl}/products`);
        const data = await res.json();

        const normalized = data.map((p: any) => ({
          ...p,
          price: Number(p.price),
          stock: Number(p.stock),
        }));

        dispatch({ type: "SET_PRODUCTS", payload: normalized });
      } catch {
        dispatch({ type: "SET_ERROR", payload: "Failed to load products" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    }
    load();
  }, [apiUrl]);

  const filtered = useMemo(() => {
    if (!search.trim()) return state.products;
    const q = search.toLowerCase();
    return state.products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }, [state.products, search]);

  if (state.loading) return <p className="p-6">Loading...</p>;
  if (state.error) return <p className="p-6 text-red-500">{state.error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Inventory</h1>

        <input
          type="text"
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm mb-6 px-3 py-2 border rounded"
        />

        <InventoryTable
          products={filtered}
          onEdit={(p) => setEditingProduct(p)}
          onDelete={(id) => setDeletingId(id)}
        />
        <DeleteProductDialog
          productId={deletingId}
          onClose={() => setDeletingId(null)}
          onConfirm={async (id) => {
            await fetch(`${apiUrl}/products/${id}`, { method: "DELETE" });
            dispatch({ type: "DELETE_PRODUCT", payload: id });
            setDeletingId(null);
          }}
        />

        {editingProduct && (
          <EditProductDialog
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onSave={(updated) => {
              dispatch({ type: "EDIT_PRODUCT", payload: updated });
              setEditingProduct(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
