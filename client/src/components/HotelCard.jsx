import { useNavigate } from "react-router-dom";

const HotelCard = ({ hotel, onDelete }) => {
    const navigate = useNavigate();

    const imageUrl = hotel.image?.startsWith("http")
      ? hotel.image
      : `http://localhost:5000/${hotel.image}`;

 const handleDelete = () => {
        onDelete(hotel.id);
    };

 const handleImageError = (event) => {
        event.currentTarget.style.display = "none";
        event.currentTarget.parentElement.classList.add(
            "hotel-image-missing"
        );
    };

 return (
        <article className="hotel-card">
            <button
            type="button"
                className="hotel-image-button"
                onClick={() => navigate(`/hotels/${hotel.id}`)}
                aria-label={`View details for ${hotel.title}`}
    >
                <img
                    src={imageUrl}
                    alt={hotel.title}
                    className="hotel-image"
                    onError={handleImageError}
                />

                <span className="image-fallback">
                    Image unavailable
                </span>
            </button>

            <div className="hotel-card-content">
                <div className="hotel-card-heading">
                    <h3>{hotel.title}</h3>

                    <button
                        type="button"
                        className="edit-button"
                        onClick={() =>
                            navigate(`/hotels/${hotel.id}/edit`)
                        }
                    >
                        Edit
                    </button>
                </div>

                <p className="hotel-description">
                    {hotel.description}
                </p>

                <div className="hotel-card-footer">
                    <span className="hotel-price">
                        ₹{Number(hotel.price).toLocaleString("en-IN")}
                    </span>

                    <button
                        type="button"
                        className="view-button"
                        onClick={() =>
                            navigate(`/hotels/${hotel.id}`)
                        }
                    >
                        View details →
                    </button>
                </div>

    <button
                    type="button"
                    className="delete-button"
                    onClick={handleDelete}
                >
                    Delete
                </button>
            </div>
        </article>
    );
};

export default HotelCard;