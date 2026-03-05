interface Props {
  productId: string | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export default function DeleteProductDialog({
  productId,
  onClose,
  onConfirm,
}: Props) {
  if (productId === null) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Delete Product?</h2>

        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete this product? This action cannot be
          undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(productId)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
