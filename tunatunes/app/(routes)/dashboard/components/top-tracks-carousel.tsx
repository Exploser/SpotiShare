import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tracks } from "@/types/type";
import Link from "next/link";

interface TopArtistsCarouselProps {
    tracks: Tracks[];
}

const TopArtistsCarousel = ({ tracks }: TopArtistsCarouselProps) => {
    return (
        <Carousel className="w-[60vw] ml-20">
            <CarouselContent>
                {tracks.slice(0, 5).map((track) => (
                    <CarouselItem key={track.id} className="pl-1 md:basis-1/2 lg:basis-1/3">
                        <div className="flex flex-col items-center justify-center p-2">
                            <img
                                src={track.album.images[0]?.url}
                                alt={track.name}
                                className="w-32 h-32 rounded-xl mb-2"
                            />
                            <p className="text-center">{track.name}</p>
                        </div>
                    </CarouselItem>
                ))}
                <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
                    <div className="flex flex-col items-center justify-center p-2">
                        <Link href="/artists">
                            <p className="text-blue-500 hover:underline">More Tracks</p>
                        </Link>
                    </div>
                </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}

export default TopArtistsCarousel;