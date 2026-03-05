"use client";

const statusColors = {
  pending: "bg-[#FBC02D] ",
  approved: "bg-[#145214] text-white",
  completed: "bg-purple-300 text-white",
};

const OrderStatusBadge = ({ status }) => {
  if (!status) return null;
  return (
    <span className={`px-2 py-1 rounded ${statusColors[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default OrderStatusBadge;
