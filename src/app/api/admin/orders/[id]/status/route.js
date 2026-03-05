import { getCollection } from "@/lib/db/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";
import { ObjectId } from "mongodb";

const allowed = ["pending", "approved", "completed"];

export async function PATCH(req, context) {
  try {
    const role = req.headers.get("x-role");
    if (role !== "admin") {
      return Response.json(
        { success: false, message: "Forbidden (admin only)" },
        { status: 403 },
      );
    }

    const id = context?.params?.id;
    if (!id || !ObjectId.isValid(id)) {
      return Response.json(
        { success: false, message: "Invalid order id" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const status = body?.status;

    if (!status || !allowed.includes(status)) {
      return Response.json(
        { success: false, message: `status must be: ${allowed.join(", ")}` },
        { status: 400 },
      );
    }

    const ordersCol = await getCollection(COLLECTIONS.ORDERS || "orders");

    const result = await ordersCol.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: "after" },
    );

    if (!result.value) {
      return Response.json(
        { success: false, message: "Order not found" },
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
