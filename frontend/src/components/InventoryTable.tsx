import DropdownMenu from "./ui/DropdownMenu";
import type { Product } from "../types/Products";

interface InventoryTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function InventoryTable({
  products,
  onEdit,
  onDelete,
}: InventoryTableProps) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block rounded-lg border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Product</th>
              <th className="px-4 py-3 text-left font-semibold">Category</th>
              <th className="px-4 py-3 text-left font-semibold">SKU</th>
              <th className="px-4 py-3 text-right font-semibold">Price</th>
              <th className="px-4 py-3 text-right font-semibold">Stock</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const status =
                product.stock === 0
                  ? "Out of Stock"
                  : product.stock < 10
                    ? "Low Stock"
                    : "In Stock";

              const statusColor =
                product.stock === 0
                  ? "bg-red-100 text-red-700"
                  : product.stock < 10
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700";

              return (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{product.name}</td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3 font-mono text-gray-500">
                    {product.sku}
                  </td>
                  <td className="px-4 py-3 text-right">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">{product.stock}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${statusColor}`}
                    >
                      {status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <DropdownMenu
                      onEdit={() => onEdit(product)}
                      onDelete={() => onDelete(product.id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-3 md:hidden">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-lg border bg-white p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">{product.category}</p>
              </div>

              <DropdownMenu
                onEdit={() => onEdit(product)}
                onDelete={() => onDelete(product.id)}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="font-mono text-gray-500">{product.sku}</span>
              <span className="text-xs px-2 py-1 rounded bg-gray-100">
                {product.stock} in stock
              </span>
            </div>

            <div className="flex items-center justify-between text-sm border-t pt-3">
              <span className="text-gray-500">Price:</span>
              <span className="font-medium">${product.price.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
