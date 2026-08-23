const fs = require("fs");
const path = require("path");
const pool = require("../db/database");

const getHotels = async (req, res) => {
    try {
        const {
            search = "",
            minPrice,
            maxPrice,
            offset = 0,
            limit = 6
        } = req.query;

        const values = [];
        const conditions = [];

        if (search.trim()) {
            values.push(`%${search.trim()}%`);
            conditions.push(`title ILIKE $${values.length}`);
        }

        if (minPrice !== undefined && minPrice !== "") {
            values.push(Number(minPrice));
            conditions.push(`price >= $${values.length}`);
        }

        if (maxPrice !== undefined && maxPrice !== "") {
            values.push(Number(maxPrice));
            conditions.push(`price <= $${values.length}`);
        }

        const whereClause = conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

        const countResult = await pool.query(
            `SELECT COUNT(*) FROM hotels ${whereClause}`,
            values
        );

        const total = Number(countResult.rows[0].count);

        const queryValues = [
            ...values,
            Number(limit),
            Number(offset)
        ];

        const result = await pool.query(
            `SELECT *
             FROM hotels
             ${whereClause}
             ORDER BY id DESC
             LIMIT $${queryValues.length - 1}
             OFFSET $${queryValues.length}`,
            queryValues
        );

        res.status(200).json({
            hotels: result.rows,
            total,
            limit: Number(limit),
            offset: Number(offset)
        });
    } catch (error) {
        console.error("Error fetching hotels:", error);

        res.status(500).json({
            message: "Failed to fetch hotels"
        });
    }
};

const getHotel = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM hotels WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Hotel not found"
            });
        }

        res.status(200).json({
            hotel: result.rows[0]
        });
    } catch (error) {
        console.error("Error fetching hotel:", error);

        res.status(500).json({
            message: "Failed to fetch hotel"
        });
    }
};

const createHotel = async (req, res) => {
    try {
        const {
            title,
            description,
            latitude,
            longitude,
            price
        } = req.body;

        if (
            !req.file ||
            !title ||
            !description ||
            latitude === undefined ||
            longitude === undefined ||
            price === undefined
        ) {
            return res.status(400).json({
                message: "Image and all hotel fields are required"
            });
        }

        const imagePath = req.file.path.replace(/\\/g, "/");

        const result = await pool.query(
            `INSERT INTO hotels
            (image, title, description, latitude, longitude, price)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                imagePath,
                title,
                description,
                latitude,
                longitude,
                price
            ]
        );

        res.status(201).json({
            message: "Hotel created successfully",
            hotel: result.rows[0]
        });
    } catch (error) {
        console.error("Error creating hotel:", error);

        res.status(500).json({
            message: "Failed to create hotel"
        });
    }
};

const updateHotel = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            latitude,
            longitude,
            price
        } = req.body;

        const existingHotel = await pool.query(
            "SELECT * FROM hotels WHERE id = $1",
            [id]
        );

        if (existingHotel.rows.length === 0) {
            return res.status(404).json({
                message: "Hotel not found"
            });
        }

        const oldImage = existingHotel.rows[0].image;
        let imagePath = oldImage;

        if (req.file) {
            imagePath = req.file.path.replace(/\\/g, "/");
        }

        const result = await pool.query(
            `UPDATE hotels
             SET image = $1,
                 title = $2,
                 description = $3,
                 latitude = $4,
                 longitude = $5,
                 price = $6,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $7
             RETURNING *`,
            [
                imagePath,
                title,
                description,
                latitude,
                longitude,
                price,
                id
            ]
        );

        if (req.file && oldImage) {
            const oldImagePath = path.join(
                __dirname,
                "..",
                oldImage
            );

            if (
                fs.existsSync(oldImagePath) &&
                path.resolve(oldImagePath) !==
                    path.resolve(req.file.path)
            ) {
                fs.unlinkSync(oldImagePath);
            }
        }

        res.status(200).json({
            message: "Hotel updated successfully",
            hotel: result.rows[0]
        });
    } catch (error) {
        console.error("Error updating hotel:", error);

        res.status(500).json({
            message: "Failed to update hotel"
        });
    }
};

const deleteHotel = async (req, res) => {
    try {
        const { id } = req.params;

        const existingHotel = await pool.query(
            "SELECT * FROM hotels WHERE id = $1",
            [id]
        );

        if (existingHotel.rows.length === 0) {
            return res.status(404).json({
                message: "Hotel not found"
            });
        }

        const imagePath = existingHotel.rows[0].image;

        await pool.query(
            "DELETE FROM hotels WHERE id = $1",
            [id]
        );

        if (imagePath) {
            const filePath = path.join(
                __dirname,
                "..",
                imagePath
            );

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        res.status(200).json({
            message: "Hotel deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting hotel:", error);

        res.status(500).json({
            message: "Failed to delete hotel"
        });
    }
};

module.exports = {
    getHotels,
    getHotel,
    createHotel,
    updateHotel,
    deleteHotel
};