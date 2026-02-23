import { getCollection } from "@/lib/db/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";
import { ObjectId } from "mongodb";

// GET
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json(
        { success: false, message: "User ID required" },
        { status: 400 },
      );
    }

    const users = await getCollection(COLLECTIONS.USERS);

    const user = await users.findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } },
    );

    return Response.json({ success: true, data: user });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
// PUT
export async function PUT(req) {
  try {
    const body = await req.json();
    const { userId, name, email } = body;

    if (!userId) {
      return Response.json(
        { success: false, message: "User ID required" },
        { status: 400 },
      );
    }

    const users = await getCollection(COLLECTIONS.USERS);

    const result = await users.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { name, email, updatedAt: new Date() } },
      { returnDocument: "after", projection: { password: 0 } },
    );

    return Response.json({ success: true, data: result.value });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
