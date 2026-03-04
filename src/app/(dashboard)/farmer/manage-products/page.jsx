"use client";

import { useEffect, useState } from "react";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);

  // Replace with auth user
  const user = { id: "farmer123" };

  const fetchProducts = async () => {
    const res = await fetch(`/api/crops`);
    const data = await res.json();

    if (data.success) {
      const myProducts = data.data.filter(
        (p) => p.farmerId === user.id
      );
      setProducts(myProducts);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    await fetch(`/api/crops/${deleteProduct._id}?farmerId=${user.id}`, {
      method: "DELETE",
    });

    setDeleteProduct(null);
    fetchProducts();
  };

  const handleUpdate = async () => {
    await fetch(`/api/crops/${editingProduct._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        farmerId: user.id,
        title: editingProduct.title,
        price: editingProduct.price,
        quantity: editingProduct.quantity,
      }),
    });

    setEditingProduct(null);
    fetchProducts();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6 text-green-700">
        Manage My Products
      </h1>

      {/* Product List */}

      <div className="bg-white shadow rounded-lg">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-3 text-left">Crop</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Actions</th>
            </tr>

          </thead>

          <tbody>

            {products.map((product) => (

              <tr key={product._id} className="border-t">

                <td className="p-3">{product.title}</td>

                <td className="p-3">${product.price}</td>

                <td className="p-3">
                  {product.quantity} {product.unit}
                </td>

                <td className="p-3 space-x-2">

                  <button
                    onClick={() => setEditingProduct(product)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setDeleteProduct(product)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Edit Modal */}

      {editingProduct && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-lg w-96">

            <h2 className="text-lg font-bold mb-4">
              Edit Product
            </h2>

            <input
              className="w-full border p-2 mb-3"
              value={editingProduct.title}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  title: e.target.value,
                })
              }
            />

            <input
              type="number"
              className="w-full border p-2 mb-3"
              value={editingProduct.price}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  price: e.target.value,
                })
              }
            />

            <input
              type="number"
              className="w-full border p-2 mb-3"
              value={editingProduct.quantity}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  quantity: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 border"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white"
              >
                Update
              </button>

            </div>

          </div>

        </div>

      )}

      {/* Delete Modal */}

      {deleteProduct && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-lg w-96">

            <h2 className="text-lg font-bold mb-4">
              Delete Product
            </h2>

            <p className="mb-4">
              Are you sure you want to delete
              <b> {deleteProduct.title}</b>?
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setDeleteProduct(null)}
                className="px-4 py-2 border"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white"
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}