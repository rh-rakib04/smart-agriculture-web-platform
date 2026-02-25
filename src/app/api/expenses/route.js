import { getCollection } from "@/lib/db/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";


//  POST /api/expenses

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, amount, category, farmerId, cropId } = body;

    if (!title || !amount || !farmerId) {
      return Response.json(
        { success: false, message: "title, amount, farmerId required" },
        { status: 400 }
      );
    }

    const expenses = await getCollection(COLLECTIONS.EXPENSES);

    const newExpense = {
      title,
      amount: Number(amount),
      category: category || "General",
      farmerId,
      cropId: cropId || null,
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await expenses.insertOne(newExpense);

    return Response.json({
      success: true,
      data: { _id: result.insertedId, ...newExpense },
    });

  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}


//  GET /api/expenses?farmerId=...

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

    const expenses = await getCollection(COLLECTIONS.EXPENSES);

    const data = await expenses
      .find({ farmerId })
      .sort({ date: -1 })
      .toArray();

    const total = data.reduce((sum, item) => sum + item.amount, 0);

    return Response.json({
      success: true,
      data,
      totalExpense: total,
    });

  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}