import { getCollection } from "@/lib/db/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";

export async function GET(req) {
  try {
    const role = req.headers.get("x-role");
    if (role !== "admin") {
      return Response.json(
        { success: false, message: "Forbidden (admin only)" },
        { status: 403 },
      );
    }

    const usersCol = await getCollection(COLLECTIONS.USERS);
    const cropsCol = await getCollection(COLLECTIONS.CROPS);
    const ordersCol = await getCollection(COLLECTIONS.ORDERS || "orders");
    const expensesCol = await getCollection(COLLECTIONS.EXPENSES);

    const [users, crops, orders, expensesAgg, monthlyOrders, monthlyExpenses] =
      await Promise.all([
        usersCol.countDocuments(),
        cropsCol.countDocuments(),
        ordersCol.countDocuments(),
        expensesCol
          .aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }])
          .toArray(),

        // Monthly Orders
        ordersCol
          .aggregate([
            {
              $group: {
                _id: { $month: "$createdAt" },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ])
          .toArray(),

        // Monthly Expenses
        expensesCol
          .aggregate([
            {
              $group: {
                _id: { $month: "$createdAt" },
                total: { $sum: "$amount" },
              },
            },
            { $sort: { _id: 1 } },
          ])
          .toArray(),
      ]);

    const monthNames = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formattedOrders = monthlyOrders.map((item) => ({
      month: monthNames[item._id],
      count: item.count,
    }));

    const formattedExpenses = monthlyExpenses.map((item) => ({
      month: monthNames[item._id],
      total: item.total,
    }));

    return Response.json({
      success: true,
      data: {
        users,
        crops,
        orders,
        expensesTotal: expensesAgg?.[0]?.total || 0,
        monthlyOrders: formattedOrders,
        monthlyExpenses: formattedExpenses,
      },
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
