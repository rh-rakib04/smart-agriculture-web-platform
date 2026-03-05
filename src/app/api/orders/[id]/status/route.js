import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(req, { params }) {
  try {
    // 🔹 Next.js 16+ App Router: params is a Promise, so unwrap it
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // 👇 Debug log
    console.log("PATCH ID:", id);

    // 🔹 Get role and status from request body
    const { role, status } = await req.json();

    // 🔐 Role check
    if (role !== "admin" && role !== "farmer") {
      return NextResponse.json(
        { message: "Forbidden: Invalid role" },
        { status: 403 },
      );
    }

    // 🔹 Get orders collection
    const orders = await getCollection("orders");

    // 🔎 Find order by ObjectId
    const order = await orders.findOne({ _id: new ObjectId(id) });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // 🔁 Status flow validation
    const validTransitions = {
      pending: ["approved"],
      approved: ["completed"],
      completed: [],
    };

    if (!validTransitions[order.status].includes(status)) {
      return NextResponse.json(
        {
          message: `Invalid status transition from ${order.status} to ${status}`,
        },
        { status: 400 },
      );
    }

    // ✅ Update status
    await orders.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    return NextResponse.json({
      message: "Order status updated successfully",
      status,
    });
  } catch (error) {
    console.error("PATCH ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}