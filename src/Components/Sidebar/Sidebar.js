import React, { useState, useEffect, useRef } from "react";
import "./Sidebar.css";
import { useProductAvailable } from "../../Context/product-context";
import { useGenre } from "../../Context/genre-context";

function Sidebar() {
  const {
    dispatchSortedProductsList,
    productFilterOptions,
    dispatchProductFilterOptions,
  } = useProductAvailable();

  const {
    indoorCheckbox,
    setIndoorCheckbox,
    outdoorCheckbox,
    setOutdoorCheckbox,
    succulentCheckbox,
    setSucculentCheckbox,
    floweringCheckbox,
    setFloweringCheckbox,
    airPurifyingCheckbox,
    setAirPurifyingCheckbox,
    herbCheckbox,
    setHerbCheckbox,
  } = useGenre();

  const ratingRadioBtnRef = useRef(null);

  const [sortPriceLowToHigh, setSortPriceLowToHigh] = useState(false);
  const [sortPriceHighToLow, setSortPriceHighToLow] = useState(false);

  const [includeOutOfStockCheckbox, setIncludeOutOfStockCheckbox] =
    useState(true);
  const [fastDeliveryOnlyCheckbox, setFastDeliveryOnlyCheckbox] =
    useState(false);

  const [minPriceRange, setMinPriceRange] = useState(0);
  const [maxPriceRange, setMaxPriceRange] = useState(1200);

  useEffect(() => {
    dispatchSortedProductsList({
      type: "UPDATE_LIST_AS_PER_FILTERS",
      payload: productFilterOptions,
    });

    if (sortPriceLowToHigh) {
      dispatchSortedProductsList({ type: "PRICE_LOW_TO_HIGH" });
    }
    if (sortPriceHighToLow) {
      dispatchSortedProductsList({ type: "PRICE_HIGH_TO_LOW" });
    }
  }, [productFilterOptions]);

  function clearFilters() {
    setMinPriceRange(0);
    setMaxPriceRange(1200);

    setIndoorCheckbox(true);
    setOutdoorCheckbox(true);
    setSucculentCheckbox(true);
    setFloweringCheckbox(true);
    setAirPurifyingCheckbox(true);
    setHerbCheckbox(true);

    ratingRadioBtnRef.current.click();
    setSortPriceLowToHigh(false);
    setSortPriceHighToLow(false);
    setIncludeOutOfStockCheckbox(true);
    setFastDeliveryOnlyCheckbox(false);

    dispatchProductFilterOptions({ type: "RESET_DEFAULT_FILTERS" });
  }

  return (
    <aside className="product-page-sidebar">
      <div className="filter-clear-options">
        <p className="sidebar-filter-option">Filters</p>
        <p onClick={clearFilters} className="sidebar-clear-option text-underline">
          Clear
        </p>
      </div>

      {/* ---------- CATEGORY ---------- */}
      <div className="product-category">
        <p>Plant Type</p>

        <div className="checkbox-item">
          <input
            type="checkbox"
            checked={indoorCheckbox}
            onChange={() => {
              setIndoorCheckbox((p) => !p);
              dispatchProductFilterOptions({
                type: "UPDATE_INDOOR_FILTER",
              });
            }}
          />
          <label>Indoor Plants</label>
        </div>

        <div className="checkbox-item">
          <input
            type="checkbox"
            checked={outdoorCheckbox}
            onChange={() => {
              setOutdoorCheckbox((p) => !p);
              dispatchProductFilterOptions({
                type: "UPDATE_OUTDOOR_FILTER",
              });
            }}
          />
          <label>Outdoor Plants</label>
        </div>

        <div className="checkbox-item">
          <input
            type="checkbox"
            checked={succulentCheckbox}
            onChange={() => {
              setSucculentCheckbox((p) => !p);
              dispatchProductFilterOptions({
                type: "UPDATE_SUCCULENT_FILTER",
              });
            }}
          />
          <label>Succulents</label>
        </div>

        <div className="checkbox-item">
          <input
            type="checkbox"
            checked={floweringCheckbox}
            onChange={() => {
              setFloweringCheckbox((p) => !p);
              dispatchProductFilterOptions({
                type: "UPDATE_FLOWERING_FILTER",
              });
            }}
          />
          <label>Flowering Plants</label>
        </div>

        <div className="checkbox-item">
          <input
            type="checkbox"
            checked={airPurifyingCheckbox}
            onChange={() => {
              setAirPurifyingCheckbox((p) => !p);
              dispatchProductFilterOptions({
                type: "UPDATE_AIRPURIFYING_FILTER",
              });
            }}
          />
          <label>Air Purifying</label>
        </div>

        <div className="checkbox-item">
          <input
            type="checkbox"
            checked={herbCheckbox}
            onChange={() => {
              setHerbCheckbox((p) => !p);
              dispatchProductFilterOptions({
                type: "UPDATE_HERB_FILTER",
              });
            }}
          />
          <label>Herbs</label>
        </div>
      </div>

      {/* ---------- SORT ---------- */}
      <div className="product-page-sortby-radio">
        <p>Sort By</p>

        <div className="sortby-items">
          <input
            type="radio"
            name="sort"
            checked={sortPriceLowToHigh}
            onChange={() => {
              setSortPriceLowToHigh(true);
              setSortPriceHighToLow(false);
              dispatchSortedProductsList({ type: "PRICE_LOW_TO_HIGH" });
            }}
          />
          <label>Price - Low to High</label>
        </div>

        <div className="sortby-items">
          <input
            type="radio"
            name="sort"
            checked={sortPriceHighToLow}
            onChange={() => {
              setSortPriceLowToHigh(false);
              setSortPriceHighToLow(true);
              dispatchSortedProductsList({ type: "PRICE_HIGH_TO_LOW" });
            }}
          />
          <label>Price - High to Low</label>
        </div>
      </div>
    </aside>
  );
}

export { Sidebar };
