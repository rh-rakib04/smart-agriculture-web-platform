import { getCollection } from "@/lib/db/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";

export async function GET(req) {
  try {
    // ✅ Temporary "admin auth" for Milestone demo
    // In ThunderClient/Postman set header: x-role: admin
    const role = req.headers.get("x-role");
    if (role !== "admin") {
      return Response.json(
        { success: false, message: "Forbidden (admin only)" },
        { status: 403 },
      );
    }

    const usersCol = await getCollection(COLLECTIONS.USERS);
    const cropsCol = await getCollection(COLLECTIONS.CROPS);
    const ordersCol = await getCollection(COLLECTIONS.ORDERS); // make sure exists in collections.js
    const expensesCol = await getCollection(COLLECTIONS.EXPENSES);

    const [users, crops, orders, expensesAgg] = await Promise.all([
      usersCol.countDocuments(),
      cropsCol.countDocuments(),
      ordersCol.countDocuments(),
      expensesCol
        .aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }])
        .toArray(),
    ]);

    const expensesTotal = expensesAgg?.[0]?.total || 0;

    return Response.json({
      success: true,
      data: { users, crops, orders, expensesTotal },
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
