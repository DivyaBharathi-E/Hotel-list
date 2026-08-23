import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { createHotel, fetchHotel, updateHotel } from "../store/hotelSlice";

const HotelForm = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { selectedHotel, loading, error } = useSelector(
        (state) => state.hotels
    );

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        latitude: "",
        longitude: "",
        price: ""
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEditMode) {
            dispatch(fetchHotel(id));
        }
    }, [dispatch, id, isEditMode]);

    useEffect(() => {
        if (isEditMode && selectedHotel) {
            setFormData({
                title: selectedHotel.title || "",
                description: selectedHotel.description || "",
                latitude: selectedHotel.latitude || "",
                longitude: selectedHotel.longitude || "",
                price: selectedHotel.price || ""
            });

            if (selectedHotel.image) {
                const imageUrl = selectedHotel.image.startsWith("http")
                    ? selectedHotel.image
                    : `http://localhost:5000/${selectedHotel.image}`;

                setPreview(imageUrl);
            }
        }
    }, [selectedHotel, isEditMode]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));

        setErrors((current) => ({
            ...current,
            [name]: ""
        }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            setErrors((current) => ({
                ...current,
                image: "Please select a JPEG, PNG or WebP image."
            }));
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrors((current) => ({
                ...current,
                image: "Image size must be less than 5 MB."
            }));
            return;
        }

        setImage(file);
        setPreview(URL.createObjectURL(file));

        setErrors((current) => ({
            ...current,
            image: ""
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Hotel title is required.";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required.";
        }

        const latitude = Number(formData.latitude);
        const longitude = Number(formData.longitude);
        const price = Number(formData.price);

        if (formData.latitude === "") {
            newErrors.latitude = "Latitude is required.";
        } else if (latitude < -90 || latitude > 90) {
            newErrors.latitude = "Latitude must be between -90 and 90.";
        }

        if (formData.longitude === "") {
            newErrors.longitude = "Longitude is required.";
        } else if (longitude < -180 || longitude > 180) {
            newErrors.longitude = "Longitude must be between -180 and 180.";
        }

        if (formData.price === "") {
            newErrors.price = "Price is required.";
        } else if (price <= 0) {
            newErrors.price = "Price must be greater than 0.";
        }

        if (!isEditMode && !image) {
            newErrors.image = "Hotel image is required.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        const data = new FormData();

        if (image) {
            data.append("image", image);
        }

        data.append("title", formData.title.trim());
        data.append("description", formData.description.trim());
        data.append("latitude", formData.latitude);
        data.append("longitude", formData.longitude);
        data.append("price", formData.price);

        try {
            if (isEditMode) {
                await dispatch(
                    updateHotel({
                        id,
                        formData: data
                    })
                ).unwrap();
            } else {
                await dispatch(createHotel(data)).unwrap();
            }

            navigate("/");
        } catch (submitError) {
            console.error(submitError);
        }
    };

    return (
        <main className="hotel-form-page">
            <Helmet>
            <title>
                {isEditMode
                    ? "Edit Hotel | Hotel Explorer"
                    : "Add Hotel | Hotel Explorer"}
            </title>

            <meta
                name="description"
                content={
                    isEditMode
                        ? "Update hotel information and listing details."
                        : "Add a new hotel listing to Hotel Explorer."
                }
            />
        </Helmet>

            <div className="form-header">
                <div>
                    <button
                        type="button"
                        className="back-button"
                        onClick={() => navigate("/")}
                    >
                        ← Back to hotels
                    </button>

                    <h1>
                        {isEditMode
                            ? "Edit Hotel"
                            : "Add New Hotel"}
                    </h1>

                    <p>
                        {isEditMode
                            ? "Update the hotel information below."
                            : "Add a new hotel to your listings."}
                    </p>
                </div>
            </div>

            <form
                className="hotel-form"
                onSubmit={handleSubmit}
                noValidate
            >
                <section className="form-section">
                    <div className="section-heading">
                        <h2>Hotel information</h2>
                        <p>
                            Provide the basic information for this
                            property.
                        </p>
                    </div>

                    <div className="image-upload-area">
                        <div className="image-preview">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Hotel preview"
                                />
                            ) : (
                                <div className="image-placeholder">
                                    <span>Upload image</span>
                                    <small>
                                        JPEG, PNG or WebP · Max 5 MB
                                    </small>
                                </div>
                            )}
                        </div>

                        <div className="image-upload-controls">
                         <label
                                htmlFor="hotel-image"
                                className="upload-button"
                                tabIndex="0"
                                onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            document.getElementById("hotel-image")?.click();
        }
    }}
                            >
                                Choose image
                            </label>

                            <input
                                id="hotel-image"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                            />

                            <p>
                                Use a clear landscape image of the
                                property.
                            </p>

                            {errors.image && (
                                <span className="field-error">
                                    {errors.image}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="form-field">
                        <label htmlFor="title">
                            Hotel name
                        </label>

                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter hotel name"
                        />

                        {errors.title && (
                            <span className="field-error">
                                {errors.title}
                            </span>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="description">
                            Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            rows="5"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the hotel"
                        />

                        {errors.description && (
                            <span className="field-error">
                                {errors.description}
                            </span>
                        )}
                    </div>
                </section>

                <section className="form-section">
                    <div className="section-heading">
                        <h2>Location and pricing</h2>
                        <p>
                            Add the property's coordinates and
                            current price.
                        </p>
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="latitude">
                                Latitude
                            </label>

                            <input
                                id="latitude"
                                name="latitude"
                                type="number"
                                step="any"
                                value={formData.latitude}
                                onChange={handleChange}
                                placeholder="e.g. 11.1271"
                            />

                            {errors.latitude && (
                                <span className="field-error">
                                    {errors.latitude}
                                </span>
                            )}
                        </div>

                        <div className="form-field">
                            <label htmlFor="longitude">
                                Longitude
                            </label>

                            <input
                                id="longitude"
                                name="longitude"
                                type="number"
                                step="any"
                                value={formData.longitude}
                                onChange={handleChange}
                                placeholder="e.g. 78.6569"
                            />

                            {errors.longitude && (
                                <span className="field-error">
                                    {errors.longitude}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="form-field price-field">
                        <label htmlFor="price">
                            Price per night
                        </label>

                        <div className="price-input">
                            <span>₹</span>

                            <input
                                id="price"
                                name="price"
                                type="number"
                                min="1"
                                step="1"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Enter price"
                            />
                        </div>

                        {errors.price && (
                            <span className="field-error">
                                {errors.price}
                            </span>
                        )}
                    </div>
                </section>

                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}

                <div className="form-actions">
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => navigate("/")}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="save-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : isEditMode
                              ? "Save Changes"
                              : "Add Hotel"}
                    </button>
                </div>
            </form>
        </main>
    );
};

export default HotelForm;