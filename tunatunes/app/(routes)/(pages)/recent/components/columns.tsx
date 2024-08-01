"use client";

import { SpotifyPlayHistory } from "@/types/type";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";

export const columns: ColumnDef<SpotifyPlayHistory>[] = [
    {
        accessorKey: "track.album.images",
        header: "Album Art",
        cell: ({ row }) => (
            <Link href={row.original.track.external_urls.spotify} passHref target="_blank" rel="noopener noreferrer">
                <Image src={row.original.track.album.images[0].url} alt={row.original.track.album.name} width={124} height={124} />
            </Link>
        ),
    },
    {
        accessorKey: "track.name",
        header: "Track Name",
        cell: ({ row }) => row.original.track.name,
    },
    {
        accessorKey: "track.album.name",
        header: "Album Name",
        cell: ({ row }) => row.original.track.album.name,
    },
    {
        accessorKey: "track.artists",
        header: "Artists",
        cell: ({ row }) => row.original.track.artists.map(artist => artist.name).join(", "),
    },
    {
        accessorKey: "played_at",
        header: "Played At",
        cell: ({ row }) => new Date(row.original.played_at).toLocaleString(),
    },
];
