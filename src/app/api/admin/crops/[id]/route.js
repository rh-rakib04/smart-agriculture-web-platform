import { getCollection } from "@/lib/db/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";
import { ObjectId } from "mongodb";

export async function DELETE(req, context) {
  try {
    const role = req.headers.get("x-role");

    if (role !== "admin") {
      return Response.json(
        { success: false, message: "Admin only" },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return Response.json(
        { success: false, message: "Invalid crop ID" },
        { status: 400 }
      );
    }

    const crops = await getCollection(COLLECTIONS.CROPS);

    const result = await crops.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return Response.json(
        { success: false, message: "Crop not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      deleted: result.deletedCount,
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}