import { getCollection } from "@/lib/db/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";
import { ObjectId } from "mongodb";

const allowedStatus = ["pending", "approved", "rejected", "hidden"];

export async function PATCH(req, context) {
  try {
    const role = req.headers.get("x-role");

    if (role !== "admin") {
      return Response.json(
        { success: false, message: "Admin only" },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const body = await req.json();
    const { status } = body;

    if (!allowedStatus.includes(status)) {
      return Response.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const crops = await getCollection(COLLECTIONS.CROPS);

    const result = await crops.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status } },
      { returnDocument: "after" }
    );

    return Response.json({
      success: true,
      data: result.value,
    });

  } catch (error) {
    console.error("Status update error:", error);

    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}