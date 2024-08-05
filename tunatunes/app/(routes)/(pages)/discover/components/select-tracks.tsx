import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tracks } from "@/types/type";
import Autoplay from "embla-carousel-autoplay";
import { Disc3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TopTracksCarouselProps {
    tracks: Tracks[];
    handleSelect: (id: string, type: string) => void;
    selectedTrackIds: string[];
}

const SelectTracksCarousel = ({ tracks, handleSelect, selectedTrackIds }: TopTracksCarouselProps) => {
    return (
        <div>
            <Carousel
                plugins={[
                    Autoplay({
                        delay: 5000,
                        stopOnMouseEnter: true,
                        stopOnLastSnap: true,
                    }),
                ]}
                style={{ height: '100%', width: '100%' }}
            >
                <CarouselContent>
                    {tracks.map((track) => (
                        <CarouselItem key={track.id} className="pl-1 md:basis-1/2 lg:basis-1/3">
                            <div className="flex flex-col items-center justify-center p-2">
                                <Card className="bg-center bg-cover bg-no-repeat h-auto" style={{ backgroundImage: `url(${track.album.images[0]?.url})` }}>
                                    <CardHeader className="bg-black bg-opacity-60 rounded-xl items-center justify-center">
                                        <Image src={track.album.images[0]?.url} alt={track.name} width={200} height={200} />
                                        <CardTitle className="text-white text-center">{track.name}</CardTitle>
                                    </CardHeader>
                                    <CardFooter className="bg-black bg-opacity-60 rounded-xl items-center justify-center">
                                        <button
                                            onClick={() => handleSelect(track.id, 'track')}
                                            className={`mt-2 px-4 py-2 rounded transition ${selectedTrackIds.includes(track.id) ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                                            disabled={selectedTrackIds.includes(track.id)}
                                        >
                                            {selectedTrackIds.includes(track.id) ? 'Selected' : 'Select Track'}
                                        </button>
                                    </CardFooter>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                    <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
                        <div className="flex flex-col items-center justify-center p-2 h-full">
                            <Card className="xs:min-h-full xs:min-w-full bg-slate-500">
                                <CardHeader className="rounded-xl items-center justify-center">
                                    <Disc3 height={200} width={200} />
                                    <Link href="/artists">
                                        <CardTitle className="text-white text-center">More Artists</CardTitle>
                                    </Link>
                                </CardHeader>
                            </Card>
                        </div>
                    </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="bg-slate-600" />
                <CarouselNext className="bg-slate-600"  />
            </Carousel>
        </div>
    );
}

export default SelectTracksCarousel;
