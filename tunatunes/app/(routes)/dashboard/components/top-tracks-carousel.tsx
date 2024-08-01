import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tracks } from "@/types/type";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";

interface TopArtistsCarouselProps {
    tracks: Tracks[];
}

const TopArtistsCarousel = ({ tracks }: TopArtistsCarouselProps) => {
    return (
        <Carousel
            plugins={[
                Autoplay({
                    delay: 5000,
                    stopOnMouseEnter: true,
                    stopOnLastSnap: true,
                }),
            ]}
            className="w-[60vw] ml-20">
            <CarouselContent>
                {tracks.slice(0, 5).map((track) => (
                    <CarouselItem key={track.id} className="pl-1 md:basis-1/2 lg:basis-1/3">
                        <div className="flex flex-col items-center justify-center p-2">
                            <Card className="bg-center bg-cover bg-no-repeat h-auto" style={{backgroundImage: `url(${track.album.images[0]?.url})`}}>
                                <CardHeader className="bg-black bg-opacity-60 rounded-xl items-center justify-center">
                                    <Image src={track.album.images[0]?.url} alt={track.name} width={200} height={200} />
                                    <CardTitle className="text-white text-center">{track.name}</CardTitle>
                                </CardHeader>
                            </Card>
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