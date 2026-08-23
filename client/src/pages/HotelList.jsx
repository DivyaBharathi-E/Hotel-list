import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import HotelCard from "../components/HotelCard";
import { fetchHotels, removeHotel } from "../store/hotelSlice";

const HotelList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        hotels,
        total,
        limit,
        offset,
        loading,
        error
    } = useSelector((state) => state.hotels);

    const [search, setSearch] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const [toast, setToast] = useState({
        visible: false,
        type: "success",
        message: ""
    });

    useEffect(() => {
        dispatch(
            fetchHotels({
                search,
                minPrice,
                maxPrice,
                offset: 0,
                limit: 6
            })
        );
    }, [dispatch, search, minPrice, maxPrice]);

    const showToast = (message, type = "success") => {
        setToast({
            visible: true,
            type,
            message
        });

        window.setTimeout(() => {
            setToast({
                visible: false,
                type: "success",
                message: ""
            });
        }, 3000);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this hotel?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await dispatch(removeHotel(id)).unwrap();

            showToast("Hotel deleted successfully");
        } catch (deleteError) {
            showToast(
                deleteError || "Failed to delete hotel",
                "error"
            );
        }
    };

    const clearFilters = () => {
        setSearch("");
        setMinPrice("");
        setMaxPrice("");
    };

    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);

    const handlePageChange = (page) => {
        dispatch(
            fetchHotels({
                search,
                minPrice,
                maxPrice,
                offset: (page - 1) * limit,
                limit
            })
        );
    };

    return (
        <div className="hotel-page">
            <Helmet>
            <title>Hotel Explorer | Hotel Listings</title>

            <meta
                name="description"
                content="Discover and manage hotel listings with Hotel Explorer."
            />
        </Helmet>

          

            <header className="page-header">
                <div>
                    <h1>Hotel Explorer</h1>
                    <p>
                        Discover and manage hotel listings
                    </p>
                </div>

                <button
                    type="button"
                    className="add-hotel-button"
                    onClick={() => navigate("/hotels/new")}
                >
                    + Add Hotel
                </button>
            </header>


            

            <div className="hotel-layout">

                

                <aside className="filter-sidebar">

                    <div className="filter-header">
                        <h2>Filters</h2>

                        <button
                            type="button"
                            onClick={clearFilters}
                        >
                            Clear
                        </button>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="hotel-search">
                            Search
                        </label>

                        <input
                            id="hotel-search"
                            type="text"
                            placeholder="Search hotels..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />
                    </div>

                    <div className="filter-group">
                        <label>
                            Price range
                        </label>

                        <input
                            type="number"
                            min="0"
                            placeholder="Minimum price"
                            value={minPrice}
                            onChange={(event) =>
                                setMinPrice(event.target.value)
                            }
                        />

                        <input
                            type="number"
                            min="0"
                            placeholder="Maximum price"
                            value={maxPrice}
                            onChange={(event) =>
                                setMaxPrice(event.target.value)
                            }
                        />
                    </div>

                </aside>


                

                <section className="hotel-results">

                    <div className="results-header">
                        <div>
                            <h2>Hotels</h2>

                            <p>
                                {total}{" "}
                                {total === 1
                                    ? "hotel"
                                    : "hotels"}{" "}
                                found
                            </p>
                        </div>
                    </div>


                  

                    {loading && (
                        <div className="state-message">
                            Loading hotels...
                        </div>
                    )}


                    
                    {!loading && error && (
                        <div className="state-message error">
                            {error}
                        </div>
                    )}


                    

                    {!loading &&
                        !error &&
                        hotels.length === 0 && (
                            <div className="state-message">
                                <h3>
                                    No hotels found
                                </h3>

                                <p>
                                    Try changing your
                                    search or price filters.
                                </p>
                            </div>
                        )}


                    

                    {!loading &&
                        !error &&
                        hotels.length > 0 && (
                            <>
                                <div className="hotel-grid">
                                    {hotels.map((hotel) => (
                                        <HotelCard
                                            key={hotel.id}
                                            hotel={hotel}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>


                                

                                {totalPages > 1 && (
                                    <div className="pagination">

                                        <button
                                            type="button"
                                            disabled={
                                                currentPage === 1
                                            }
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage - 1
                                                )
                                            }
                                        >
                                            ←
                                        </button>


                                        {Array.from(
                                            {
                                                length: totalPages
                                            },
                                            (_, index) =>
                                                index + 1
                                        ).map((page) => (
                                            <button
                                                key={page}
                                                type="button"
                                                className={
                                                    page ===
                                                    currentPage
                                                        ? "active"
                                                        : ""
                                                }
                                                onClick={() =>
                                                    handlePageChange(
                                                        page
                                                    )
                                                }
                                            >
                                                {page}
                                            </button>
                                        ))}


                                        <button
                                            type="button"
                                            disabled={
                                                currentPage ===
                                                totalPages
                                            }
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage + 1
                                                )
                                            }
                                        >
                                            →
                                        </button>

                                    </div>
                                )}
                            </>
                        )}

                </section>
            </div>



            {toast.visible && (
                <div
                    className={`toast toast-${toast.type}`}
                    role="status"
                    aria-live="polite"
                >
                    <span className="toast-icon">
                        {toast.type === "success"
                            ? "✓"
                            : "!"}
                    </span>

                    <span className="toast-message">
                        {toast.message}
                    </span>
                </div>
            )}

        </div>
    );
};

export default HotelList;