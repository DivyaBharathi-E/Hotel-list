import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
    getHotels,
    getHotel,
    createHotel as createHotelApi,
    updateHotel as updateHotelApi,
    deleteHotel
} from "../services/hotelApi";

export const fetchHotels = createAsyncThunk(
    "hotels/fetchHotels",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await getHotels(params);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchHotel = createAsyncThunk(
    "hotels/fetchHotel",
    async (id, { rejectWithValue }) => {
        try {
            const response = await getHotel(id);
            return response.hotel;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createHotel = createAsyncThunk(
    "hotels/createHotel",
    async (hotelData, { rejectWithValue }) => {
        try {
            return await createHotelApi(hotelData);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateHotel = createAsyncThunk(
    "hotels/updateHotel",
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            return await updateHotelApi(id, formData);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeHotel = createAsyncThunk(
    "hotels/removeHotel",
    async (id, { rejectWithValue }) => {
        try {
            await deleteHotel(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    hotels: [],
    selectedHotel: null,
    total: 0,
    limit: 6,
    offset: 0,
    loading: false,
    error: null
};

const hotelSlice = createSlice({
    name: "hotels",

    initialState,

    reducers: {
        clearSelectedHotel: (state) => {
            state.selectedHotel = null;
        },

        clearError: (state) => {
            state.error = null;
        }
    },

    extraReducers: (builder) => {
        builder

            

            .addCase(fetchHotels.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchHotels.fulfilled, (state, action) => {
                state.loading = false;

                state.hotels = action.payload.hotels;
                state.total = action.payload.total;
                state.limit = action.payload.limit;
                state.offset = action.payload.offset;
            })

            .addCase(fetchHotels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch hotels";
            })

            

            .addCase(fetchHotel.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.selectedHotel = null;
            })

            .addCase(fetchHotel.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedHotel = action.payload;
            })

            .addCase(fetchHotel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch hotel";
            })

            

            .addCase(createHotel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createHotel.fulfilled, (state, action) => {
                state.loading = false;

                state.hotels.unshift(action.payload.hotel);
                state.total += 1;
            })

            .addCase(createHotel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to create hotel";
            })

            

            .addCase(updateHotel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(updateHotel.fulfilled, (state, action) => {
                state.loading = false;

                const updatedHotel = action.payload.hotel;

                state.selectedHotel = updatedHotel;

                const index = state.hotels.findIndex(
                    (hotel) => hotel.id === updatedHotel.id
                );

                if (index !== -1) {
                    state.hotels[index] = updatedHotel;
                }
            })

            .addCase(updateHotel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update hotel";
            })

            

            .addCase(removeHotel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(removeHotel.fulfilled, (state, action) => {
                state.loading = false;

                state.hotels = state.hotels.filter(
                    (hotel) => hotel.id !== action.payload
                );

                state.total = Math.max(0, state.total - 1);
            })

            .addCase(removeHotel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete hotel";
            });
    }
});

export const {
    clearSelectedHotel,
    clearError
} = hotelSlice.actions;

export default hotelSlice.reducer;