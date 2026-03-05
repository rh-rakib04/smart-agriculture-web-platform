import { getCollection } from "@/lib/db/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";

export async function GET(req) {
  try {
    const role = req.headers.get("x-role");
    if (role !== "admin") {
      return Response.json(
        { success: false, message: "Forbidden (admin only)" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status"); // optional filter

    const skip = (page - 1) * limit;

    const ordersCol = await getCollection(COLLECTIONS.ORDERS || "orders");

    const filter = {};
    if (status) filter.status = status;

    const total = await ordersCol.countDocuments(filter);

    const data = await ordersCol
      .find(filter)
      .sort({ createdAt: -1 })
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
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}