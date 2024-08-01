import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Artist } from "@/types/type";
import { RefreshCcwDot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface TopArtistsDisplayProps {
    artists: Artist[];
    loadMoreTracks: () => void;
}

const TopArtistsDisplay = ({ artists, loadMoreTracks }: TopArtistsDisplayProps) => {
    const [sampleColors, setSampleColors] = useState<Record<string, string>>({});
    const [hoveredArtistId, setHoveredArtistId] = useState<string | null>(null);
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
        artists.forEach(artist => {
            if (artist.images.length > 0 && artist.images[0]) {
                getColorFromImage(artist.images[0].url, artist.id);
            }
        });
    }, [artists]);

    const removeTextInParentheses = (str: string) => {
        const splitStr = str.split('(');
        if (splitStr.length > 0) {
            return splitStr[0]?.trim();
        }
        return str;
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 m-8 mb-0">
            {artists.map((artist) => (
                <Card
                    key={artist.id}
                    className="m-2"
                    style={{ backgroundColor: sampleColors[artist.id] }}
                    onMouseEnter={() => setHoveredArtistId(artist.id)}
                    onMouseLeave={() => setHoveredArtistId(null)}
                >
                    <CardHeader className="p-0">
                        <Link href={`${artist.external_urls.spotify}`} target="_blank" rel="noopener noreferrer">
                            <div className="w-full h-48 relative">
                                <Image
                                    src={artist.images[0]?.url || '/default-image.jpg'}
                                    alt={artist.name}
                                    fill
                                    sizes="200px"
                                    objectFit="cover"
                                    className="rounded-t-lg"
                                />
                                {hoveredArtistId === artist.id && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 text-white p-4 rounded-t-lg">
                                        <h3 className="text-sm font-semibold">Genres: </h3>
                                        <p className="font-semibold"> {artist.genres.map(genres => genres).join(', ')}</p>
                                        <p className="text-sm mt-6">
                                            Followers: {artist.followers.total.toLocaleString()}
                                        </p>
                                        <p className="text-sm">
                                            Popularity: {artist.popularity}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Link>
                    </CardHeader>
                    <CardFooter className="border-0 p-0 justify-center items-center">
                        <CardTitle className="text-center py-4">{removeTextInParentheses(artist?.name ?? 'None')}</CardTitle>
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

export default TopArtistsDisplay;