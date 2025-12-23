import { useEffect, useReducer, useContext, createContext } from "react";
import axios from "axios";

const ProductsContext = createContext();

/* =========================
   PLANT FILTER OPTIONS
========================= */
let filterOptionsObject = {
  includeOutOfStock: true,
  onlyFastDeliveryProducts: false,
  minPrice: 0,
  maxPrice: 1200,

  indoor: true,
  outdoor: true,
  succulent: true,
  cactus: true,
  bonsai: true,
  flowering: true,

  minRating: 1,
};

/* =========================
   FILTER REDUCER
========================= */
function updateProductFilters(state, action) {
  switch (action.type) {
    case "UPDATE_OUTOFSTOCK_FILTER":
      return { ...state, includeOutOfStock: !state.includeOutOfStock };

    case "UPDATE_FASTDELIVERY_FILTER":
      return {
        ...state,
        onlyFastDeliveryProducts: !state.onlyFastDeliveryProducts,
      };

    case "UPDATE_MIN_PRICE_RANGE_FILTER":
      return { ...state, minPrice: action.minPrice };

    case "UPDATE_MAX_PRICE_RANGE_FILTER":
      return { ...state, maxPrice: action.maxPrice };

    case "UPDATE_INDOOR_FILTER":
      return { ...state, indoor: !state.indoor };

    case "UPDATE_OUTDOOR_FILTER":
      return { ...state, outdoor: !state.outdoor };

    case "UPDATE_SUCCULENT_FILTER":
      return { ...state, succulent: !state.succulent };

    case "UPDATE_CACTUS_FILTER":
      return { ...state, cactus: !state.cactus };

    case "UPDATE_BONSAI_FILTER":
      return { ...state, bonsai: !state.bonsai };

    case "UPDATE_FLOWERING_FILTER":
      return { ...state, flowering: !state.flowering };

    case "UPDATE_MINIMUM_RATING_FILTER":
      return { ...state, minRating: action.minRating };

    case "RESET_DEFAULT_FILTERS":
      return { ...filterOptionsObject };

    default:
      return state;
  }
}

/* =========================
   PRODUCTS LIST
========================= */
let productList = [];

/* =========================
   SORT + FILTER LOGIC
========================= */
function productsOrderFunc(state, action) {
  switch (action.type) {
    case "PRICE_HIGH_TO_LOW":
      return [...state].sort(
        (a, b) => b.discountedPrice - a.discountedPrice
      );

    case "PRICE_LOW_TO_HIGH":
      return [...state].sort(
        (a, b) => a.discountedPrice - b.discountedPrice
      );

    case "UPDATE_LIST_AS_PER_FILTERS":
      return productList.filter((item) => {
        const plantCategory =
          item.genre === "fiction"
            ? "indoor"
            : item.genre === "tech"
            ? "outdoor"
            : item.genre === "romance"
            ? "succulent"
            : item.genre === "manga"
            ? "cactus"
            : item.genre === "thriller"
            ? "bonsai"
            : "flowering";

        if (!action.payload[plantCategory]) return false;

        if (!action.payload.includeOutOfStock && item.outOfStock)
          return false;

        if (
          action.payload.onlyFastDeliveryProducts &&
          !item.fastDeliveryAvailable
        )
          return false;

        if (
          item.discountedPrice < action.payload.minPrice ||
          item.discountedPrice > action.payload.maxPrice
        )
          return false;

        if (item.rating < action.payload.minRating) return false;

        return true;
      });

    case "ADD_ITEMS_TO_PRODUCTS_AVAILABLE_LIST":
      return [...action.payload];

    default:
      return state;
  }
}

/* =========================
   PROVIDER
========================= */
const ProductsProvider = ({ children }) => {
  const [productsAvailableList, dispatchSortedProductsList] = useReducer(
    productsOrderFunc,
    productList
  );

  const [productFilterOptions, dispatchProductFilterOptions] = useReducer(
    updateProductFilters,
    filterOptionsObject
  );

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          "https://bookztron-server.vercel.app/api/home/products"
        );
        productList = [...response.data.productsList];
        dispatchSortedProductsList({
          type: "ADD_ITEMS_TO_PRODUCTS_AVAILABLE_LIST",
          payload: productList,
        });
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    })();
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        productsAvailableList,
        dispatchSortedProductsList,
        productFilterOptions,
        dispatchProductFilterOptions,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

const useProductAvailable = () => useContext(ProductsContext);

export { ProductsProvider, useProductAvailable };