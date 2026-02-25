import { getCollection } from "@/lib/db/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";
import { ObjectId } from "mongodb";
// GET
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    if (role !== "admin") {
      return Response.json(
        { success: false, message: "Admin only" },
        { status: 403 }
      );
    }

    const users = await getCollection(COLLECTIONS.USERS);
    const allUsers = await users
      .find({}, { projection: { password: 0 } })
      .toArray();

    return Response.json({ success: true, data: allUsers });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, role } = body;

    if (!name || !email) {
      return Response.json(
        { success: false, message: "Name and email are required" },
        { status: 400 },
      );
    }

    const users = await getCollection(COLLECTIONS.USERS);

    const newUser = {
      name,
      email,
      role: role || "farmer",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await users.insertOne(newUser);

    return Response.json({
      success: true,
      data: { _id: result.insertedId, ...newUser },
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
