import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const API_URL = "http://localhost:5000/api/hotels";

const HotelDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`${API_URL}/${id}`);

                if (!response.ok) {
                    throw new Error("Hotel not found");
                }

                const data = await response.json();

                setHotel(data.hotel);
            } catch (err) {
                setError(err.message || "Failed to load hotel");
            } finally {
                setLoading(false);
            }
        };

        fetchHotel();
    }, [id]);
    useEffect(() => {
        if (hotel) {
            document.title = `${hotel.title} | Hotel Explorer`;
        }
    }, [hotel]);


    if (loading) {
        return (
            <main className="hotel-detail-page">
                <div className="detail-state">
                    Loading hotel details...
                </div>
            </main>
        );
    }

    if (error || !hotel) {
        return (
            <main className="hotel-detail-page">
                <div className="detail-state detail-error">
                    <h2>Hotel not found</h2>
                    <p>{error || "This hotel could not be found."}</p>

                    <button
                        type="button"
                        className="detail-back-button"
                        onClick={() => navigate("/")}
                    >
                        ← Back to hotels
                    </button>
                </div>
            </main>
        );
    }

    const imageUrl = hotel.image?.startsWith("http")
        ? hotel.image
        : `http://localhost:5000/${hotel.image}`;

    const mapUrl =
        `https://www.openstreetmap.org/export/embed.html?bbox=` +
        `${Number(hotel.longitude) - 0.02},` +
        `${Number(hotel.latitude) - 0.02},` +
        `${Number(hotel.longitude) + 0.02},` +
        `${Number(hotel.latitude) + 0.02}` +
        `&layer=mapnik&marker=${hotel.latitude},${hotel.longitude}`;

    return (
        <main className="hotel-detail-page">
             <Helmet>
            <title>{hotel.title} | Hotel Explorer</title>

            <meta
                name="description"
                content={hotel.description}
            />
        </Helmet>
            
            <div className="hotel-detail-container">

                <button
                    type="button"
                    className="detail-back-button"
                    onClick={() => navigate("/")}
                >
                    ← Back to hotels
                </button>

                <div className="detail-header">
                    <div>
                        <h1>{hotel.title}</h1>

                        <p>
                            Hotel details and location
                        </p>
                    </div>

                    <button
                        type="button"
                        className="detail-edit-button"
                        onClick={() =>
                            navigate(`/hotels/${hotel.id}/edit`)
                        }
                    >
                        Edit hotel
                    </button>
                </div>

                <section className="detail-card">

                    <div className="detail-main">

                        <div className="detail-image-wrapper">
                            <img
                                src={imageUrl}
                                alt={hotel.title}
                                className="detail-image"
                            />
                        </div>

                        <div className="detail-information">

                            <div className="detail-price">
                                ₹
                                {Number(hotel.price).toLocaleString(
                                    "en-IN"
                                )}
                                <span> / night</span>
                            </div>

                            <div className="detail-section">
                                <h2>About this hotel</h2>

                                <p>
                                    {hotel.description}
                                </p>
                            </div>

                            <div className="detail-section">
                                <h2>Location</h2>

                                <div className="coordinates">
                                    <div>
                                        <span>Latitude</span>
                                        <strong>
                                            {hotel.latitude}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Longitude</span>
                                        <strong>
                                            {hotel.longitude}
                                        </strong>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="detail-map-section">
                        <div className="detail-map-header">
                            <div>
                                <h2>Location on map</h2>

                                <p>
                                    Hotel location based on the
                                    provided coordinates.
                                </p>
                            </div>
                        </div>

                        <iframe
                            title={`Map showing ${hotel.title}`}
                            className="hotel-map"
                            src={mapUrl}
                            loading="lazy"
                        />
                    </div>

                </section>
            </div>
        </main>
    );
};

export default HotelDetail;