import { useState } from "react";
import { MainLayout } from "@/components/Layout";
import { Salesperson, useCRMStore } from "@/hooks/useCRMStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit2, Plus } from "lucide-react";

export default function Salespersons() {
  const { salespersons, addSalesperson, deleteSalesperson, updateSalesperson } =
    useCRMStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<
    Omit<Salesperson, "id" | "createdAt">
  >({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      updateSalesperson(editingId, formData);
      setEditingId(null);
    } else {
      addSalesperson(formData);
    }

    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
    });
    setShowForm(false);
  };

  const handleEditSalesperson = (salesperson: Salesperson) => {
    setFormData(salesperson);
    setEditingId(salesperson.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Sales Persons</h2>
            <p className="text-slate-600 mt-1">
              Manage your sales team members
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {showForm ? "Cancel" : "Add Sales Person"}
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {editingId ? "Edit Sales Person" : "Add New Sales Person"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Name *
                </label>
                <Input
                  type="text"
                  placeholder="Sales person name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  className="w-full"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {editingId ? "Update Sales Person" : "Add Sales Person"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Salespersons List */}
        <div className="grid gap-4">
          {salespersons.length === 0 ? (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <p className="text-slate-600">
                No sales persons yet. Add one to get started!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {salespersons.map((salesperson) => (
                <div
                  key={salesperson.id}
                  className="bg-white rounded-lg border border-slate-200 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {salesperson.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        ID: {salesperson.id}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditSalesperson(salesperson)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteSalesperson(salesperson.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    {salesperson.email && (
                      <div>
                        <p className="text-slate-600 font-medium">Email</p>
                        <a
                          href={`mailto:${salesperson.email}`}
                          className="text-blue-600 hover:text-blue-700 break-all"
                        >
                          {salesperson.email}
                        </a>
                      </div>
                    )}
                    {salesperson.phoneNumber && (
                      <div>
                        <p className="text-slate-600 font-medium">Phone</p>
                        <a
                          href={`tel:${salesperson.phoneNumber}`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {salesperson.phoneNumber}
                        </a>
                      </div>
                    )}
                    {!salesperson.email && !salesperson.phoneNumber && (
                      <p className="text-slate-500 text-xs italic">
                        No contact information provided
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-xs text-slate-500">
                      Added:{" "}
                      {new Date(salesperson.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
