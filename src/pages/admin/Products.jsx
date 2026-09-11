import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import api from "../../api/axios";
import { FullPageLoader, Spinner } from "../../components/Loading";

const emptyForm = { name: "", description: "", category: "", price: "", stock: "" };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [addingCat, setAddingCat] = useState(false);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setAddingCat(true);
    try {
      const { data } = await api.post("/categories", { name: newCatName.trim() });
      setCategories((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewCatName("");
      toast.success("Category added");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add category");
    } finally {
      setAddingCat(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      toast.success("Category deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete category (it may be in use)");
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get("/products?limit=100"),
        api.get("/categories"),
      ]);
      setProducts(prodRes.data.products);
      setCategories(catRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAddModal = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setPreview(null);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      category: product.category?._id || "",
      price: product.price,
      stock: product.stock,
    });
    setImageFile(null);
    setPreview(product.image?.url);
    setModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editing && !imageFile) {
      toast.error("Please select a product image");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("category", form.category);
      fd.append("price", form.price);
      fd.append("stock", form.stock);
      if (imageFile) fd.append("image", imageFile);

      if (editing) {
        await api.put(`/products/${editing._id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Product updated");
      } else {
        await api.post("/products", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Product created");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete product");
    }
  };

  if (loading) return <FullPageLoader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products ({products.length})</h1>
        <div className="flex gap-2">
          <button onClick={() => setCatModalOpen(true)} className="btn-outline flex items-center gap-2">
            Manage Categories
          </button>
          <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
            <FiPlus /> Add Product
          </button>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <img src={p.image?.url} alt={p.name} className="w-12 h-12 object-cover rounded-md" />
                </td>
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-gray-500">{p.category?.name}</td>
                <td className="px-4 py-3">${p.price.toFixed(2)}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3 flex gap-3">
                  <button onClick={() => openEditModal(p)} className="text-primary-600 hover:underline flex items-center gap-1">
                    <FiEdit2 size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:underline flex items-center gap-1">
                    <FiTrash2 size={14} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="text-center text-gray-500 py-8">No products yet. Add your first one!</p>}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 fade-in">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-semibold text-lg">{editing ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Product Image</label>
                {preview && <img src={preview} alt="preview" className="w-24 h-24 object-cover rounded-lg mb-2" />}
                <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
              </div>
              <input
                required
                placeholder="Product Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
              />
              <textarea
                required
                placeholder="Description"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field"
              />
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input-field"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="input-field"
                />
                <input
                  required
                  type="number"
                  min="0"
                  placeholder="Stock Quantity"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="input-field"
                />
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
                {saving ? <Spinner size={18} /> : editing ? "Update Product" : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {catModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 fade-in">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-semibold text-lg">Manage Categories</h2>
              <button onClick={() => setCatModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={20} />
              </button>
            </div>
            <div className="p-5">
              <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
                <input
                  placeholder="New category name"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="input-field"
                />
                <button type="submit" disabled={addingCat} className="btn-primary shrink-0">
                  Add
                </button>
              </form>
              <div className="space-y-2">
                {categories.length === 0 && <p className="text-sm text-gray-500">No categories yet.</p>}
                {categories.map((c) => (
                  <div key={c._id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50">
                    <span className="text-sm">{c.name}</span>
                    <button onClick={() => handleDeleteCategory(c._id)} className="text-red-500 hover:underline text-xs">
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
