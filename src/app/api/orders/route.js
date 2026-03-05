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

//  GET /api/orders?buyerId=...&farmerId=...&status=...
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const buyerId = searchParams.get("buyerId");
    const farmerId = searchParams.get("farmerId");
    const status = searchParams.get("status");

    const filter = {};
    if (buyerId) filter.buyerId = buyerId;
    if (farmerId) filter.farmerId = farmerId;
    if (status) filter.status = status;

    const orders = await getCollection(COLLECTIONS.ORDERS);

    const data = await orders.find(filter).sort({ createdAt: -1 }).toArray();

    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}




