import { AdminSidebar } from "@/src/components/admin/AdminSidebar";

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-gray-600">Hoş geldiniz! Admin paneline hoş geldiniz.</p>
      </main>
    </div>
  );
}

