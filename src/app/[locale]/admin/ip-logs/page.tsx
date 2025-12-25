import { AdminSidebar } from "@/src/components/admin/AdminSidebar";
import { IPLogs } from "@/src/components/admin/IPLogs";

export default function AdminIPLogsPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <IPLogs />
      </main>
    </div>
  );
}

