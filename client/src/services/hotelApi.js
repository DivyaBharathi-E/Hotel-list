const API_URL = "https://hotel-list-production.up.railway.app/api/hotels";

export const getHotels = async ({
    search = "",
    minPrice = "",
    maxPrice = "",
    offset = 0,
    limit = 6
} = {}) => {
    const params = new URLSearchParams();

    if (search) {
        params.set("search", search);
    }

    if (minPrice !== "") {
        params.set("minPrice", minPrice);
    }

    if (maxPrice !== "") {
        params.set("maxPrice", maxPrice);
    }

    params.set("offset", offset);
    params.set("limit", limit);

    const response = await fetch(`${API_URL}?${params.toString()}`);

    if (!response.ok) {
        throw new Error("Failed to fetch hotels");
    }

    return response.json();
};

export const getHotel = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch hotel");
    }

    return response.json();
};

export const createHotel = async (hotelData) => {
    const response = await fetch(API_URL, {
        method: "POST",
        body: hotelData
    });

    if (!response.ok) {
        throw new Error("Failed to create hotel");
    }

    return response.json();
};

export const updateHotel = async (id, hotelData) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        body: hotelData
    });

    if (!response.ok) {
        throw new Error("Failed to update hotel");
    }

    return response.json();
};

export const deleteHotel = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Failed to delete hotel");
    }

    return response.json();
};