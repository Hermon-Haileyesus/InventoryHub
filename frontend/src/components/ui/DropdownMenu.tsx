import { useState, useRef, useEffect } from "react";

interface DropdownMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function DropdownMenu({ onEdit, onDelete }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="px-2 py-1 rounded hover:bg-gray-200"
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow z-10">
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="block w-full text-left px-3 py-2 hover:bg-gray-100"
          >
            Edit
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
