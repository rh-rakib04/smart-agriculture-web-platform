import { getCollection } from "@/lib/db/mongodb";
import { COLLECTIONS } from "@/lib/db/collections";

// POST /api/orders (Buyer places order)
export async function POST(req) {
  try {
    const body = await req.json();
    const { buyerId, farmerId, cropId, quantity, price } = body;

    if (!buyerId || !farmerId || !cropId || !quantity) {
      return Response.json(
        {
          success: false,
          message: "buyerId, farmerId, cropId, quantity required",
        },
        { status: 400 },
      );
    }

    const orders = await getCollection(COLLECTIONS.ORDERS);

    const newOrder = {
      buyerId,
      farmerId,
      cropId,
      quantity: Number(quantity),
      price: price !== undefined ? Number(price) : null,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await orders.insertOne(newOrder);

    return Response.json({
      success: true,
      data: { _id: result.insertedId, ...newOrder },
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
