import { useReducer, useEffect, useState, useMemo } from "react";
import InventoryTable from "../components/InventoryTable";
import { inventoryReducer } from "../state/inventoryReducer";
import EditProductDialog from "../components/EditProdudctionDialog";
import DeleteProductDialog from "../components/DeleteProductionDialog";
import AddProductDialog from "../components/AddProductionDialog";
import type { Product } from "../types/Products";
import { Search, Package, Plus } from "lucide-react";

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const initialState = {
    products: [],
    loading: true,
    error: "",
  };

  const [state, dispatch] = useReducer(inventoryReducer, initialState);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function load() {
      const start = Date.now();

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
        const elapsed = Date.now() - start;
        const minTime = 2000; // 2 seconds

        if (elapsed < minTime) {
          setTimeout(() => {
            dispatch({ type: "SET_LOADING", payload: false });
          }, minTime - elapsed);
        } else {
          dispatch({ type: "SET_LOADING", payload: false });
        }
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

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-700 text-lg font-medium">
          <span>Loading inventory</span>
          <span className="flex gap-1">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce delay-150">.</span>
            <span className="animate-bounce delay-300">.</span>
          </span>
        </div>
      </div>
    );
  }
  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-sm max-w-md text-center">
          <p className="font-semibold text-lg mb-1">Something went wrong</p>
          <p className="text-sm">{state.error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-1">
          <Package className="h-7 w-7 text-muted-foreground" />
          <h1 className="text-3xl font-bold">Inventory</h1>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          {state.products.length} products ·{" "}
          {state.products.filter((p) => p.stock > 10).length} in stock
        </p>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <div className="relative w-full sm:max-w-sm  sm:order-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded"
            />
          </div>

          <button
            onClick={() => setAdding(true)}
            className=" sm:order-2 w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>

        {/* Table */}
        <InventoryTable
          products={filtered}
          onEdit={(p) => setEditingProduct(p)}
          onDelete={(id) => setDeletingId(id)}
        />

        {/* Delete Dialog */}
        <DeleteProductDialog
          productId={deletingId}
          onClose={() => setDeletingId(null)}
          onConfirm={async (id) => {
            await fetch(`${apiUrl}/products/${id}`, { method: "DELETE" });
            dispatch({ type: "DELETE_PRODUCT", payload: id });
            setDeletingId(null);
          }}
        />

        {/* Edit Dialog */}
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

        {/* Add Dialog */}
        {adding && (
          <AddProductDialog
            onClose={() => setAdding(false)}
            onSave={async (form) => {
              const res = await fetch(`${apiUrl}/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
              });

              const result = await res.json();

              const newProduct = {
                id: result.id,
                name: form.name,
                category: form.category,
                sku: form.sku,
                price: Number(form.price),
                stock: Number(form.stock),
              };

              dispatch({ type: "ADD_PRODUCT", payload: newProduct });
              setAdding(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
