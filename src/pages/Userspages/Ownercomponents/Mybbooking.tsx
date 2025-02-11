import { Separator } from "@/components/ui/separator";
import { AnimatePresence, motion } from "framer-motion";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import DynamicBreadcrumb from "@/hooks/brudcrumbhooks";
import { AppSidebar } from "./Sidebar";
import axios from "axios";
import { useAppSelector } from "@/hooks/redduxhook";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Booking = {
  bookerId: string;
  from: string;
  to: string;
};

type Room = {
  roomid: string;
  booked: Booking[];
};

const Mybbooking = () => {
  const URI = "https://roomrentweb.gobidev.site";
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deatilsofroom, setdeatilsofroom] = useState<any>(null);
  const [roomNames, setRoomNames] = useState<{ [key: string]: string }>({});
  const [rooms, setRooms] = useState<Room[]>([]);
  const userId = useAppSelector((state) => state.user.Userid);

  const gettinginfo = async () => {
    try {
      const response = await axios.get(`${URI}/bookings/gets`, {
        withCredentials: true,
      });
      const data: Room[] = response.data;
      const userBookings = data
        .map((room) => ({
          roomid: room.roomid,
          booked: room.booked.filter((b) => b.bookerId === userId),
        }))
        .filter((room) => room.booked.length > 0);
      setRooms(userBookings);
    } catch (error: any) {
      console.error("Error fetching data:", error.message || error);
    }
  };

  const findRoomById = async (roomid: string) => {
    try {
      const response = await axios.get(`${URI}/bookingroomdata`, {
        withCredentials: true,
        params: { id: roomid },
      });
      return response.data.Propertyname;
    } catch (error) {
      console.error("Error fetching room name:", error);
      return "Unknown Room";
    }
  };

  const fetchdata = async (roomid: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${URI}/bookingroomdata`, {
        withCredentials: true,
        params: { id: roomid },
      });
      setdeatilsofroom(response.data);
    } catch (error) {
      console.error("Error fetching room name:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchRoomNames = async () => {
      const roomNameMap: { [key: string]: string } = {};
      const roomNamePromises = rooms.map((room) =>
        findRoomById(room.roomid).then((roomName) => {
          roomNameMap[room.roomid] = roomName;
        })
      );
      await Promise.all(roomNamePromises);
      setRoomNames(roomNameMap);
    };

    if (rooms.length > 0) {
      fetchRoomNames();
    }
  }, [rooms]);

  useEffect(() => {
    if (userId) {
      gettinginfo();
    }
  }, [userId]);

  const handleOpenChange = (open: boolean, room: Room) => {
    setIsOpen(open);
    if (open) {
      setIsLoading(true);
      fetchdata(room.roomid).then(() => {
        setIsLoading(false);
      });
    }
  };

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DynamicBreadcrumb />
            </div>
          </header>
          <div className="">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="p-4 max-w-4xl mx-auto"
            >
              <h2 className="text-2xl font-bold text-white mb-4">My Bookings</h2>

              {rooms.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-md bg-sidebar overflow-y-auto max-h-[700px]">
                  <Table className="w-full text-white bg-black">
                    <TableHeader className="bg-sidebar-primary">
                      <TableRow>
                        <TableHead className="p-3 text-center text-white">
                          Property Name
                        </TableHead>
                        <TableHead className="p-3 text-center text-white">
                          From
                        </TableHead>
                        <TableHead className="p-3 text-center text-white">
                          To
                        </TableHead>
                        <TableHead className="p-3 text-center text-white"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rooms.map((room) =>
                        room.booked.map((booking, index) => (
                          <motion.tr
                            key={`${room.roomid}-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="border-b border-gray-700 bg-sidebar hover:bg-slate-500 transition-all"
                          >
                            <TableCell className="p-3 text-center">
                              {roomNames[room.roomid] || "Loading..."}
                            </TableCell>
                            <TableCell className="p-3 text-center">
                              {new Date(booking.from).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="p-3 text-center">
                              {new Date(booking.to).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="p-3 text-center">
                              <Popover
                                open={isOpen}
                                onOpenChange={(open) => handleOpenChange(open, room)}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    aria-label="View room details"
                                    className="bg-gray-900 text-white hover:bg-gray-700"
                                  >
                                    Details
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-screen max-w-[90vw] sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] p-0 text-white bg-gray-900 border-gray-700">
                                  <AnimatePresence>
                                    {isOpen && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="p-4"
                                      >
                                        <h2 className="text-center text-2xl font-bold text-white mb-4">
                                          Room Details
                                        </h2>
                                        {isLoading ? (
                                          <div className="flex justify-center items-center h-40">
                                            <motion.div
                                              animate={{ rotate: 360 }}
                                              transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                ease: "linear",
                                              }}
                                              className="w-8 h-8 border-4 border-white border-t-transparent rounded-full"
                                            />
                                          </div>
                                        ) : (
                                          deatilsofroom && (
                                            <Card className="border-none shadow-none bg-transparent">
                                              <CardHeader>
                                                <Carousel className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
                                                  <CarouselContent>
                                                    {deatilsofroom.images &&
                                                      deatilsofroom.images.map(
                                                        (url: string, index: number) => (
                                                          <CarouselItem key={index}>
                                                            <div className="p-1">
                                                              <Card className="bg-transparent">
                                                                <CardContent className="flex aspect-square items-center justify-center p-2">
                                                                  <motion.img
                                                                    src={url}
                                                                    alt={`Room ${index + 1}`}
                                                                    className="w-full h-full object-cover rounded-lg"
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    transition={{ duration: 0.5 }}
                                                                  />
                                                                </CardContent>
                                                              </Card>
                                                            </div>
                                                          </CarouselItem>
                                                        )
                                                      )}
                                                  </CarouselContent>
                                                  <CarouselPrevious className="hidden sm:flex" />
                                                  <CarouselNext className="hidden sm:flex" />
                                                </Carousel>
                                              </CardHeader>

                                              <CardContent>
                                                <motion.div
                                                  className="flex w-full flex-col justify-normal items-center gap-3 text-center"
                                                  initial={{ opacity: 0, y: 20 }}
                                                  animate={{ opacity: 1, y: 0 }}
                                                  transition={{ delay: 0.2, duration: 0.5 }}
                                                >
                                                  <h3 className="font-bold tracking-wide text-xl text-white">
                                                    Rent Per Day:{" "}
                                                    <motion.span
                                                      className="text-blue-400"
                                                      whileHover={{ scale: 1.05 }}
                                                      transition={{ type: "spring", stiffness: 300 }}
                                                    >
                                                      {deatilsofroom.Price || "N/A"}
                                                    </motion.span>
                                                  </h3>
                                                  <p className="text-lg text-gray-300">
                                                    Property Name:{" "}
                                                    {deatilsofroom.Propertyname || "N/A"}
                                                  </p>
                                                  <p className="text-lg text-gray-300">
                                                    Place: {deatilsofroom.Location || "N/A"}
                                                  </p>
                                                  <p className="text-lg text-gray-300">
                                                    Contact:{" "}
                                                    {deatilsofroom.ContactNumber || "N/A"}
                                                  </p>
                                                </motion.div>
                                              </CardContent>
                                            </Card>
                                          )
                                        )}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </PopoverContent>
                              </Popover>
                            </TableCell>
                          </motion.tr>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  <p className="text-gray-400 text-center">End...</p>
                </div>
              ) : (
                <p className="text-gray-400 text-center">No bookings found.</p>
              )}
            </motion.div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default Mybbooking;