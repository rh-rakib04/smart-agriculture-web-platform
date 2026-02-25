import { getCollection } from "@/lib/db/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";
import { ObjectId } from "mongodb";

export async function PATCH(req, { params }) {
  try {
    const body = await req.json();
    const { role, admin } = body;

    if (admin !== true) {
      return Response.json(
        { success: false, message: "Admin only" },
        { status: 403 },
      );
    }

    const allowedRoles = ["admin", "farmer", "buyer"];
    if (!allowedRoles.includes(role)) {
      return Response.json(
        { success: false, message: "Invalid role" },
        { status: 400 },
      );
    }

    const users = await getCollection(COLLECTIONS.USERS);

    const result = await users.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: { role, updatedAt: new Date() } },
      { returnDocument: "after", projection: { password: 0 } },
    );

    if (!result.value) {
      return Response.json(
        { success: false, message: "User not found" },
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
