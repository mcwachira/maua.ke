import type { Metadata } from "next";

import {
  AdminPage,
  AdminTable,
} from "@/components/admin/AdminShell";
import { demoAuditLogs } from "@/lib/demo-account";

export const metadata: Metadata = {
  title: "Audit Logs",
  description: "Who changed what, and when.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminAuditLogsPage() {
  return (
    <AdminPage
      title="Audit logs"
      description="Who changed what, and when."
    >
      <AdminTable
        columns={[
          "Actor",
          "Action",
          "Target",
          "Details",
          "Timestamp",
        ]}
        rows={demoAuditLogs.map((log) => [
          log.user,
          log.action,
          log.entity,
          log.details,
          log.date,
        ])}
      />
    </AdminPage>
  );
}