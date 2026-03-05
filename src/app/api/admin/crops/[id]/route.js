import { getCollection } from "@/lib/db/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";
import { ObjectId } from "mongodb";

export async function GET(req, context) {
  try {
    const role = req.headers.get("x-role");
    if (role !== "admin") {
      return Response.json(
        { success: false, message: "Forbidden (admin only)" },
        { status: 403 },
      );
    }

    const { id } = await context.params;

    const cropsCol = await getCollection(COLLECTIONS.CROPS);
    const crop = await cropsCol.findOne({ _id: new ObjectId(id) });

    if (!crop) {
      return Response.json(
        { success: false, message: "Crop not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, data: crop });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
export async function DELETE(req, context) {
  try {
    const role = req.headers.get("x-role");
    if (role !== "admin") {
      return Response.json(
        { success: false, message: "Forbidden (admin only)" },
        { status: 403 },
      );
    }

    const { id } = await context.params;

    const cropsCol = await getCollection(COLLECTIONS.CROPS);
    const result = await cropsCol.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return Response.json(
        { success: false, message: "Crop not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, message: "Crop deleted" });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
