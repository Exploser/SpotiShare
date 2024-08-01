import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tracks } from "@/types/type";
import { RefreshCcwDot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface TopTracksDisplayProps {
    tracks: Tracks[];
    loadMoreTracks: () => void;
}

const TopTracksDisplay = ({ tracks, loadMoreTracks }: TopTracksDisplayProps) => {
    const [sampleColors, setSampleColors] = useState<Record<string, string>>({});
    const [hoveredTrackId, setHoveredArtistId] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const getColorFromImage = (imageUrl: string, artistId: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        const image = new window.Image();
        image.crossOrigin = "Anonymous";
        image.src = imageUrl;

        image.onload = () => {
            context.drawImage(image, 0, 0, 1, 1);
            const pixelData = context.getImageData(0, 0, 1, 1);
            if (!pixelData) return;
            const pixel = pixelData.data;
            const color = `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, 0.5)`;
            setSampleColors(prevColors => ({ ...prevColors, [artistId]: color }));
        };
    };

    useEffect(() => {
        tracks.forEach(track => {
            if (track.album.images.length > 0 && track.album.images[0]) {
                getColorFromImage(track.album.images[0].url, track.id);
            }
        });
    }, [tracks]);

    const removeTextInParentheses = (str: string) => {
        const splitStr = str.split('(');
        if (splitStr.length > 0) {
            return splitStr[0]?.trim();
        }
        return str;
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 m-8 mb-0">
            {tracks.map((track) => (
                <Card
                    key={track.id}
                    className="m-2"
                    style={{ backgroundColor: sampleColors[track.id] }}
                    onMouseEnter={() => setHoveredArtistId(track.id)}
                    onMouseLeave={() => setHoveredArtistId(null)}
                >
                    <CardHeader className="p-0">
                        <Link href={`${track.external_urls.spotify}`} target="_blank" rel="noopener noreferrer">
                            <div className="w-full h-48 relative">
                                <Image
                                    src={track.album.images[0]?.url || '/default-image.jpg'}
                                    alt={track.name}
                                    fill
                                    sizes="200px"
                                    objectFit="cover"
                                    className="rounded-t-lg"
                                />
                                {hoveredTrackId === track.id && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 text-white p-4 rounded-t-lg">
                                        <h3 className="text-sm font-semibold">Artists: </h3>
                                        <p className="font-semibold"> {track.artists.map(artists => artists.name).join(', ')}</p>
                                        <p className="text-sm mt-6">
                                            Release Date: {track.album.release_date.toLocaleString()}
                                        </p>
                                        <p className="text-sm">
                                            Album: {track.album.name}
                                        </p>
                                        <p className="text-sm">
                                            Track: {`${track.track_number} of ${track.album.total_tracks}`}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Link>
                    </CardHeader>
                    <CardFooter className="border-0 p-0 justify-center items-center">
                        <CardTitle className="text-center py-4">{removeTextInParentheses(track?.name ?? 'None')}</CardTitle>
                    </CardFooter>

                </Card>
            ))}
            <Card className="m-2">
                <button onClick={loadMoreTracks} className="bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    <CardHeader className="rounded-xl items-center justify-center">
                        <RefreshCcwDot height={200} width={100} />
                        <CardTitle className="text-white text-center">Load More Tracks</CardTitle>
                    </CardHeader>
                </button>
            </Card>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>
    );
}

export default TopTracksDisplay;