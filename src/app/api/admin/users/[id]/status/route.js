import { getCollection } from "@/lib/db/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";
import { ObjectId } from "mongodb";

const allowedStatus = ["active", "blocked"];

export async function PATCH(req, context) {
  try {
    const roleHeader = req.headers.get("x-role");
    if (roleHeader !== "admin") {
      return Response.json(
        { success: false, message: "Forbidden (admin only)" },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await req.json();
    const { status } = body;

    if (!status || !allowedStatus.includes(status)) {
      return Response.json(
        { success: false, message: `status must be one of: ${allowedStatus.join(", ")}` },
        { status: 400 }
      );
    }

    const usersCol = await getCollection(COLLECTIONS.USERS);

    const existing = await usersCol.findOne({ _id: new ObjectId(id) });
    if (!existing) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const result = await usersCol.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: "after", projection: { password: 0 } }
    );

    return Response.json({ success: true, data: result.value });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}