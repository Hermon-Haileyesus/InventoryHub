import type { Product } from "../types/Products";

type State = {
  products: Product[];
  loading: boolean;
  error: string;
};

type Action =
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "EDIT_PRODUCT"; payload: Product }
  | { type: "DELETE_PRODUCT"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string };

export function inventoryReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };
    case "ADD_PRODUCT":
      return { ...state, products: [action.payload, ...state.products] };

    case "EDIT_PRODUCT":
      const updated = {
        ...action.payload,
        price: Number(action.payload.price),
        stock: Number(action.payload.stock),
      };

      return {
        ...state,
        products: state.products.map((p) =>
          p.id === updated.id ? updated : p,
        ),
      };

    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}
