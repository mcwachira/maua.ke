import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AdminPage,
  AdminTable,
} from "@/components/admin/AdminShell";
import { demoCampaigns } from "@/lib/demo-account";

export const metadata: Metadata = {
  title: "Campaigns",
};

export default function AdminCampaignsPage() {
  return (
    <AdminPage
      title="Campaigns"
      description="Seasonal merchandising pushes and landing pages."
      action={<Button size="sm">New campaign</Button>}
    >
      <AdminTable
        columns={[
          "Campaign",
          "Starts",
          "Ends",
          "Products",
          "Status",
        ]}
        rows={demoCampaigns.map((campaign) => [
          campaign.name,
          campaign.starts,
          campaign.ends,
          campaign.sent,
          <Badge
            key={campaign.id}
            variant={
              campaign.status === "Scheduled"
                ? "secondary"
                : "outline"
            }
          >
            {campaign.status}
          </Badge>,
        ])}
      />
    </AdminPage>
  );
}