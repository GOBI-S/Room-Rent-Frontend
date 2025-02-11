import { useParams } from "react-router-dom";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";
import Autoplay from "node_modules/embla-carousel-autoplay/esm/components/Autoplay";
import React from "react";

const Details = () => {
    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
      );
    const { id } = useParams();
    const URI="https://roomrentweb.gobidev.site";
    const [deatilsofroom, setdeatilsofroom] = useState<any>({});
    const fetchdata = async (roomid: string) => {
        try {
          const response = await axios.get(
            `${URI}/bookingroomdata`,
            {
              withCredentials: true,
              params: { id: roomid },
            }
          );
          setdeatilsofroom(response.data);
        } catch (error) {
          console.error("Error fetching room name:", error);
        } finally {
        }
      };
      useEffect(() => {
        if(id)
        fetchdata(id);
      }, [id]);
  return (
    <Card className="animate__animated animate__fadeInLeft">
                 (
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                  </div>
                )
                <CardHeader className="flex justify-center items-center font-bold">
                  <h1>ROOM DATA</h1>
                </CardHeader>
                <CardContent className="flex flex-col justify-center items-center font-medium gap-y-10 tracking-widest">
                  <h1>Email: {deatilsofroom.Email}</h1>
                  <h1>Name: {deatilsofroom.Name}</h1>
                  <h1>Location: {deatilsofroom.Location}</h1>
                  <h1>Price: {deatilsofroom.Price}</h1>
                  <h1>Propertyname: {deatilsofroom.Propertyname}</h1>
                  <h1>ContactNumber: {deatilsofroom.ContactNumber}</h1>
                  <h1>Nobedrooms: {deatilsofroom.Nobedrooms}</h1>
                  <Carousel
                    plugins={[plugin.current]}
                    className="w-full max-w-xs"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                  >
                    <CarouselContent>
                      {deatilsofroom.images.map((url: string, index: number) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <Card>
                              <CardContent className="flex aspect-square items-center justify-center p-6">
                                <img
                                  src={url}
                                  alt={`Room image ${index}`}
                                  className="object-cover w-full h-full rounded"
                                />
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden sm:flex " />
                    <CarouselNext className="hidden sm:flex" />
                  </Carousel>
                </CardContent>
              </Card>
  )
}

export default Details