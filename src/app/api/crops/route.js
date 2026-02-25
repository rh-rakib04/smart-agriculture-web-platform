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
    } = body;

    if (!title || !price || !farmerId) {
      return Response.json(
        { success: false, message: "title, price and farmerId required" },
        { status: 400 },
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
      { status: 500 },
    );
  }
}
//  GET /api/crops
// search + filter + pagination + sort
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const location = searchParams.get("location");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const crops = await getCollection(COLLECTIONS.CROPS);

    // filter

    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { cropType: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (location) {
      filter.location = location;
    }

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
      { status: 500 },
    );
  }
}

