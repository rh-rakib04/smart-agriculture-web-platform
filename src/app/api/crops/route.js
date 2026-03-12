import { getCollection } from "@/lib/db/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";

//  POST /api/crops

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      title,
      cropType,
      category,
      location,
      price,
      quantity,
      unit,
      farmerId,
      description,
      status,
      image
    } = body;

    if (!title || !price || !farmerId) {
      return Response.json(
        { success: false, message: "title, price and farmerId required" },
        { status: 400 }
      );
    }

    const crops = await getCollection(COLLECTIONS.CROPS);

    const newCrop = {
      title,
      cropType,
      category,
      location,
      price: Number(price),
      quantity: Number(quantity) || 0,
      unit: unit || "kg",
      description: description || "",
      farmerId,
      status: status || "available",
      image: image || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await crops.insertOne(newCrop);

    return Response.json({
      success: true,
      data: { _id: result.insertedId, ...newCrop },
    });

  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
//  GET /api/crops
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const location = searchParams.get("location");
    const farmerId = searchParams.get("farmerId"); // NEW
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const crops = await getCollection(COLLECTIONS.CROPS);

    let filter = {};

    // 🔎 search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { cropType: { $regex: search, $options: "i" } },
      ];
    }

    // 📂 category filter
    if (category) {
      filter.category = category;
    }

    // 📍 location filter
    if (location) {
      filter.location = location;
    }

    // 👨‍🌾 farmer crops filter
    if (farmerId) {
      filter.farmerId = farmerId;
    }

    // 💰 price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Pagination
    const skip = (page - 1) * limit;

    const total = await crops.countDocuments(filter);

    const data = await crops
      .find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray();

    return Response.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

