import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Artist } from "@/types/type";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Music2Icon} from "lucide-react";

interface TopArtistsCarouselProps {
    artists: Artist[];
}

const TopArtistsCarousel = ({ artists }: TopArtistsCarouselProps) => {
    return (
        <Carousel
            plugins={[
                Autoplay({
                    delay: 2000,
                    stopOnMouseEnter: true,
                    stopOnLastSnap: true,
                }),
            ]}
            className="w-[60vw] ml-20">
            <CarouselContent>
                {artists.slice(0, 5).map((artist) => (
                    <CarouselItem key={artist.id} className="pl-1 md:basis-1/2 lg:basis-1/3">
                        <div className="flex flex-col items-center justify-center p-2">
                            <Card className="xs:min-h-full xs:min-w-full bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${artist.images[0]?.url})` }}>
                                <CardHeader className="bg-black bg-opacity-60 rounded-xl items-center justify-center">
                                    <Image src={artist.images[0]?.url} alt={artist.name} width={200} height={200} />
                                    <CardTitle className="text-white text-center">{artist.name}</CardTitle>
                                </CardHeader>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
                <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
                    <div className="flex flex-col items-center justify-center p-2 h-full">
                        <Card className="xs:min-h-full xs:min-w-full bg-slate-500 ">
                            <CardHeader className="rounded-xl items-center justify-center">
                                <Music2Icon height={200} width={200} />
                                <Link href="/artists">
                                    <CardTitle className="text-white text-center">More Artists</CardTitle>
                                </Link>
                            </CardHeader>
                        </Card>
                    </div>
                </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}

export default TopArtistsCarousel;