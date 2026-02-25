"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

export default function UserInfo() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token"); // get JWT

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.user); // set logged-in user
      } catch (err) {
        console.error("Not authenticated", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading user...</p>;

  if (!user) return <p>User not logged in</p>;

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <p>Id: {user.id}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      {user.image && <Image src={user.image} alt={user.name} width={50} height={50} />}
    </div>
  );
}