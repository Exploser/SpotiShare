import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import VolumeController from "@/components/volume-controller";
import { useVolume } from "@/context/VolumeContext";
import { Tracks } from "@/types/type";
import { Pause, Play, RefreshCcwDot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface TopTracksDisplayProps {
    tracks: Tracks[];
    loadMoreTracks?: () => void;
}

const TopTracksDisplay = ({ tracks, loadMoreTracks }: TopTracksDisplayProps) => {
    const { volume } = useVolume();
    const [sampleColors, setSampleColors] = useState<Record<string, string>>({});
    const [hoveredTrackId, setHoveredArtistId] = useState<string | null>(null);
    const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
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

    const handlePlay = (trackId: string) => {
        const audioElement = document.getElementById(`audio-${trackId}`) as HTMLAudioElement | null;
        if (!audioElement) return;

        if (currentTrackId === trackId) {
            // Pause the current track
            audioElement.pause();
            setCurrentTrackId(null);
        } else {
            // Pause any currently playing track
            const currentAudio = document.querySelector('audio.playing')! as HTMLAudioElement | null;
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.classList.remove('playing');
            }

            // Play the new track
            audioElement.volume = volume;
            audioElement.play().catch((err) => console.error(err));
            audioElement.classList.add('playing');
            setCurrentTrackId(trackId);

            audioElement.addEventListener('ended', () => {
                setCurrentTrackId(null);
                audioElement.classList.remove('playing');
            });
        }
    };

    useEffect(() => {
        tracks.forEach(track => {
            if (track.album.images.length > 0 && track.album.images[0]) {
                getColorFromImage(track.album.images[0].url, track.id);
            }
        });
    }, [tracks]);

    useEffect(() => {
        // Update the volume of the currently playing track
        const currentAudio = document.querySelector('audio.playing') as HTMLAudioElement | null;
        if (currentAudio) {
            currentAudio.volume = volume;
        }
    }, [volume]);

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
                        <div className="w-full h-72 sm:h-48 relative">
                            <Link href={`${track.external_urls.spotify}`} target="_blank" rel="noopener noreferrer">
                                <div className="relative w-full h-full">
                                    <Image
                                        src={track.album.images[0]?.url || '/default-image.jpg'}
                                        alt={track.name}
                                        fill
                                        priority
                                        sizes="200px"
                                        style={{ objectFit: 'cover' }}
                                        className={`${currentTrackId === track.id ? 'rotate rounded-full transition-all' : 'rounded-md transition-all'}`}
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
                        </div>
                    </CardHeader>
                    <CardFooter className="border-0 p-0 justify-center items-center">
                        <CardTitle className="text-center py-4">
                            <p className="font-semibold">{removeTextInParentheses(track.name)}</p>
                            {track.preview_url && (
                                <div className="pt-2">
                                    <button className={`play-button bg-blue-500 text-white px-4 py-2 rounded-md mb-2`} onClick={() => handlePlay(track.id ?? '')}>
                                        {currentTrackId === track?.id ? <Pause /> : <Play />}
                                    </button>
                                    <audio id={`audio-${track.id}`} src={track?.preview_url} className="hidden"></audio>
                                </div>
                            )}
                        </CardTitle>
                    </CardFooter>
                </Card>
            ))}
            {loadMoreTracks && (
                <Card className="m-2">
                    <button onClick={loadMoreTracks} className="bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        <CardHeader className="rounded-xl items-center justify-center">
                            <RefreshCcwDot height={200} width={100} />
                            <CardTitle className="text-white text-center">Load More Tracks</CardTitle>
                        </CardHeader>
                    </button>
                </Card>
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>
    );
}

export default TopTracksDisplay;
