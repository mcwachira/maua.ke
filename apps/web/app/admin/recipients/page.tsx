import type { Metadata } from "next";

import {
  AdminPage,
  AdminTable,
} from "@/components/admin/AdminShell";
import { demoRecipients } from "@/lib/demo-account";

export const metadata: Metadata = {
  title: "Recipients",
};

export default function AdminRecipientsPage() {
  return (
    <AdminPage
      title="Recipients"
      description="Saved recipients used for gifting and reminders."
    >
      <AdminTable
        columns={[
          "Recipient",
          "Relationship",
          "Phone",
          "Address",
          "Birthday",
          "Anniversary",
          "Notes",
        ]}
        rows={demoRecipients.map((recipient) => [
          recipient.name,
          recipient.relationship,
          recipient.phone,
          recipient.address,
          recipient.birthday || "—",
          recipient.anniversary || "—",
          recipient.notes || "—",
        ])}
      />
    </AdminPage>
  );
}