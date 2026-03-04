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

    const cropsCol = await getCollection(COLLECTIONS.CROPS);

    const crops = await cropsCol
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({
      success: true,
      data: crops,
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}