"use client";

import { useEffect, useState } from "react";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);

  // replace with auth user
  const user = { id: "farmer123" };

  const fetchProducts = async () => {
    const res = await fetch("/api/crops");
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

  const handleUpdate = async () => {
    await fetch(`/api/crops/${editingProduct._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        farmerId: user.id,
        ...editingProduct,
      }),
    });

    setEditingProduct(null);
    fetchProducts();
  };

  const handleDelete = async () => {
    await fetch(`/api/crops/${deleteProduct._id}?farmerId=${user.id}`, {
      method: "DELETE",
    });

    setDeleteProduct(null);
    fetchProducts();
  };

  return (
        <div className="w-full p-6">

      <h1 className="text-2xl font-bold mb-6 text-green-700">
        Manage My Products
      </h1>

      {/* Product List */}

      <div className="bg-white rounded-lg shadow">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Crop</th>
              <th className="p-3">Category</th>
              <th className="p-3">Location</th>
              <th className="p-3">Price</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>

            {products.map((product) => (

              <tr key={product._id} className="border-t text-center">

                {/* Image */}

                <td className="p-3">
                  <img
                    src={product.imageUrl || "/placeholder.png"}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>

                <td className="p-3 font-semibold">
                  {product.title}
                </td>

                <td className="p-3">
                  {product.category}
                </td>

                <td className="p-3">
                  {product.location}
                </td>

                <td className="p-3 text-green-600 font-bold">
                  ${product.price}
                </td>

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

      {/* EDIT MODAL */}

      {editingProduct && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-lg w-[500px]">

            <h2 className="text-xl font-bold mb-4">
              Edit Crop
            </h2>

            {/* Title */}

            <input
              className="w-full border p-2 mb-3"
              placeholder="Crop name"
              value={editingProduct.title}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  title: e.target.value,
                })
              }
            />

            {/* Category */}

            <input
              className="w-full border p-2 mb-3"
              placeholder="Category"
              value={editingProduct.category}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  category: e.target.value,
                })
              }
            />

            {/* Location */}

            <input
              className="w-full border p-2 mb-3"
              placeholder="Location"
              value={editingProduct.location}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  location: e.target.value,
                })
              }
            />

            {/* Description */}

            <textarea
              className="w-full border p-2 mb-3"
              rows="3"
              placeholder="Description"
              value={editingProduct.description}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  description: e.target.value,
                })
              }
            />

            {/* Price & Quantity */}

            <div className="grid grid-cols-3 gap-3">

              <input
                type="number"
                className="border p-2"
                placeholder="Price"
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
                className="border p-2"
                placeholder="Quantity"
                value={editingProduct.quantity}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    quantity: e.target.value,
                  })
                }
              />

              <select
                className="border p-2"
                value={editingProduct.unit}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    unit: e.target.value,
                  })
                }
              >
                <option value="kg">Kg</option>
                <option value="ton">Ton</option>
                <option value="piece">Piece</option>
              </select>

            </div>

            {/* Buttons */}

            <div className="flex justify-end gap-3 mt-5">

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

      {/* DELETE MODAL */}

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