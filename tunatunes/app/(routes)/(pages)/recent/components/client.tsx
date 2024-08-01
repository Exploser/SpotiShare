"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { SpotifyPlayHistory } from "@/types/type";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";


interface RecentClientProps {
  data: SpotifyPlayHistory[];
}

export const RecentClient: React.FC<RecentClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex flex-col items-center justify-between">
        <DataTable searchKey="label" columns={columns} data={data}/>
      </div>
    </>
  );
};