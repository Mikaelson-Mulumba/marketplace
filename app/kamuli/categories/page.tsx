"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopBar from "../components/AdminTopBar";
import "../../../styles/categories.css";

type Category = {
  id: string;
  name: string;
};

export default function KampalaCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/kamuli/categories");
      const data: Category[] = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  // ✅ Add category
  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("/api/kamuli/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategory }),
    });
    if (res.ok) {
      const cat = await res.json();
      setCategories([...categories, cat]);
      setNewCategory("");
    }
  };

  // ✅ Update category inline
  const handleUpdateCategory = async (id: string) => {
    const res = await fetch(`/api/kamuli/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editingName }),
    });
    if (res.ok) {
      const updated = await res.json();
      setCategories(categories.map((c) => (c.id === id ? updated : c)));
      setEditingId(null);
      setEditingName("");
    }
  };

  // ✅ Delete category
  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    await fetch(`/api/kamuli/categories/${id}`, { method: "DELETE" });
    setCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <div>
      <AdminTopBar />
      <div className="categories-container">
        <AdminSidebar />
        <main className="categories-main">
          <h1>📂  Categories</h1>

          {/* Add category form */}
          <form onSubmit={handleAddCategory} className="addcategory-form">
            <label htmlFor="newCategory">New Category Name</label>
            <input
              id="newCategory"
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
            />
            <button type="submit" className="btn-submit">Add Category</button>
          </form>

          {/* Categories list */}
          <ul className="categories-list">
            {categories.map((c) => (
              <li key={c.id} className="category-item">
                {editingId === c.id ? (
                  <>
                    <label htmlFor={`edit-${c.id}`} className="sr-only">
                      Edit Category Name
                    </label>
                    <input
                      id={`edit-${c.id}`}
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      placeholder="Edit category name"
                      required
                    />
                    <button onClick={() => handleUpdateCategory(c.id)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <span>{c.name}</span>
                    <button
                      onClick={() => {
                        setEditingId(c.id);
                        setEditingName(c.name);
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDeleteCategory(c.id)}>Delete</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
}
