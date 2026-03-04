import { getCollection } from "@/lib/db/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";
import { ObjectId } from "mongodb";

const allowedStatus = ["pending", "approved", "rejected", "hidden"];

export async function PATCH(req, context) {
  try {
    const role = req.headers.get("x-role");
    if (role !== "admin") {
      return Response.json(
        { success: false, message: "Forbidden (admin only)" },
        { status: 403 },
      );
    }

    const { id } = await context.params;
    const { status } = await req.json();

    if (!status || !allowedStatus.includes(status)) {
      return Response.json(
        {
          success: false,
          message: `status must be one of: ${allowedStatus.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const cropsCol = await getCollection(COLLECTIONS.CROPS);

    const result = await cropsCol.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: "after" },
    );

    if (!result.value) {
      return Response.json(
        { success: false, message: "Crop not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, data: result.value });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
