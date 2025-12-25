import { AdminSidebar } from "@/src/components/admin/AdminSidebar";
import { BlogManagement } from "@/src/components/admin/BlogManagement";

export default function AdminBlogPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Blog Yönetimi</h1>
        <BlogManagement />
      </main>
    </div>
  );
}

