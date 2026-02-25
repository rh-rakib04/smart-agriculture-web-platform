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

    const totalCrops = await crops.countDocuments({ farmerId });
    const totalExpensesDocs = await expenses.find({ farmerId }).toArray();

    const totalExpenses = totalExpensesDocs.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    return Response.json({
      success: true,
      stats: {
        totalCrops,
        totalExpenses,
      },
    });

  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}