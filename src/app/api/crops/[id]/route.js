import { getCollection } from "@/lib/db/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";
import { ObjectId } from "mongodb";

export async function GET(req, context) {
  try {
    const { id } = await context.params; // ✅ IMPORTANT (await)

    const crops = await getCollection(COLLECTIONS.CROPS);

    const crop = await crops.findOne({ _id: new ObjectId(id) });

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
//  PATCH /api/crops/:id  (Owner update: farmerId required)
export async function PATCH(req, context) {
  try {
    const { id } = await context.params;

    const body = await req.json();
    const { farmerId, ...updateFields } = body;

    if (!farmerId) {
      return Response.json(
        { success: false, message: "farmerId required" },
        { status: 400 },
      );
    }

    const crops = await getCollection(COLLECTIONS.CROPS);

    const existing = await crops.findOne({ _id: new ObjectId(id) });

    if (!existing) {
      return Response.json(
        { success: false, message: "Crop not found" },
        { status: 404 },
      );
    }

    if (existing.farmerId !== farmerId) {
      return Response.json(
        { success: false, message: "Forbidden: not owner" },
        { status: 403 },
      );
    }

    // prevent ownership change
    delete updateFields.farmerId;

    // clean update object
    const updateData = { ...updateFields, updatedAt: new Date() };

    // convert numeric fields if present
    if (updateData.price !== undefined)
      updateData.price = Number(updateData.price);
    if (updateData.quantity !== undefined)
      updateData.quantity = Number(updateData.quantity);

    const result = await crops.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" },
    );

    return Response.json({ success: true, data: result.value });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

//  DELETE /api/crops/:id  (Owner delete: farmerId query required)
export async function DELETE(req, context) {
  try {
    const { id } = await context.params;

    const { searchParams } = new URL(req.url);
    const farmerId = searchParams.get("farmerId");

    if (!farmerId) {
      return Response.json(
        { success: false, message: "farmerId required" },
        { status: 400 },
      );
    }

    const crops = await getCollection(COLLECTIONS.CROPS);

    const existing = await crops.findOne({ _id: new ObjectId(id) });

    if (!existing) {
      return Response.json(
        { success: false, message: "Crop not found" },
        { status: 404 },
      );
    }

    if (existing.farmerId !== farmerId) {
      return Response.json(
        { success: false, message: "Forbidden: not owner" },
        { status: 403 },
      );
    }

    await crops.deleteOne({ _id: new ObjectId(id) });

    return Response.json({ success: true, message: "Crop deleted" });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
