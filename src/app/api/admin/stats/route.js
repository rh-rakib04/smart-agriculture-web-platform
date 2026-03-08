import { getCollection } from "@/lib/db/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";

export async function GET(req) {
  try {
    const role = req.headers.get("x-role");
    if (role !== "admin") {
      return Response.json(
        { success: false, message: "Forbidden (admin only)" },
        { status: 403 }
      );
    }

    const usersCol    = await getCollection(COLLECTIONS.USERS);
    const cropsCol    = await getCollection(COLLECTIONS.CROPS);
    const ordersCol   = await getCollection(COLLECTIONS.ORDERS || "orders");
    const expensesCol = await getCollection(COLLECTIONS.EXPENSES);

    const monthNames = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const [users, crops, orders, expensesAgg, monthlyOrders, monthlyExpenses] =
      await Promise.all([
        usersCol.countDocuments(),
        cropsCol.countDocuments(),
        ordersCol.countDocuments(),

        // Total expenses
        expensesCol
          .aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }])
          .toArray(),

        // ✅ Monthly Orders — extract timestamp from ObjectId if no createdAt
        ordersCol
          .aggregate([
            {
              $addFields: {
                // Use createdAt if it exists, otherwise derive from _id
                resolvedDate: {
                  $ifNull: [
                    "$createdAt",
                    { $toDate: "$_id" }, // ObjectId encodes creation time
                  ],
                },
              },
            },
            {
              $group: {
                _id: { $month: "$resolvedDate" },
                count: { $sum: 1 },
              },
            },
            { $match: { _id: { $ne: null } } }, // filter out null months
            { $sort: { _id: 1 } },
          ])
          .toArray(),

        // ✅ Monthly Expenses — same ObjectId fallback
        expensesCol
          .aggregate([
            {
              $addFields: {
                resolvedDate: {
                  $ifNull: [
                    "$createdAt",
                    { $toDate: "$_id" },
                  ],
                },
              },
            },
            {
              $group: {
                _id: { $month: "$resolvedDate" },
                total: { $sum: "$amount" },
              },
            },
            { $match: { _id: { $ne: null } } },
            { $sort: { _id: 1 } },
          ])
          .toArray(),
      ]);

    const formattedOrders = monthlyOrders.map((item) => ({
      month: monthNames[item._id] ?? `M${item._id}`,
      count: item.count,
    }));

    const formattedExpenses = monthlyExpenses.map((item) => ({
      month: monthNames[item._id] ?? `M${item._id}`,
      total: item.total,
    }));

    return Response.json({
      success: true,
      data: {
        users,
        crops,
        orders,
        expensesTotal: expensesAgg?.[0]?.total || 0,
        monthlyOrders:   formattedOrders,
        monthlyExpenses: formattedExpenses,
      },
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}