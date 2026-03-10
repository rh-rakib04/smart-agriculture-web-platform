import { getCollection } from "@/lib/db/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";

// GET /api/dashboard/stats?farmerId=...
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const farmerId = searchParams.get("farmerId");

    if (!farmerId) {
      return Response.json(
        { success: false, message: "farmerId required" },
        { status: 400 }
      );
    }

    const crops = await getCollection(COLLECTIONS.CROPS);
    const expenses = await getCollection(COLLECTIONS.EXPENSES);
    const orders = await getCollection(COLLECTIONS.ORDERS);

    const totalCrops = await crops.countDocuments({ farmerId });

    const expenseDocs = await expenses.find({ farmerId }).toArray();
    const totalExpenses = expenseDocs.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    const orderDocs = await orders.find({ farmerId }).toArray();
    const totalOrders = orderDocs.length;

    const totalRevenue = orderDocs.reduce(
      (sum, order) => sum + Number(order.totalPrice || 0),
      0
    );

    const profit = totalRevenue - totalExpenses;

    return Response.json({
      success: true,
      stats: {
        totalCrops,
        totalOrders,
        totalExpenses,
        profit,
      },
    });

  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}