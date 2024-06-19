'use client'

import { useEffect, useState } from "react";
import { getRooms } from "./services/room-setvice";
import { RoomResponse } from "./models/room-model";
import { useRouter } from "next/navigation";
import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link } from "@nextui-org/react";
import { register } from "./services/user-service";
import { UserRegisterBody } from "./models/user-model";
import { toast } from "react-toastify";


export default function Home() {
  const [rooms, setRooms] = useState<RoomResponse[]>([])
  const [selectRooms, setSelectRooms] = useState<RoomResponse>()
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter()

  const getRoomApi = async () => {
    try {
      const response = await getRooms()
      setRooms(response)
    } catch (error: any) {
      toast.error(error.message)
    } finally {

    }
  }

  const registerRoom = async () => {
    try {
      const body: UserRegisterBody = { firstName: "aa1", lastName: 'a222', phone: '0932732323232', roomId: selectRooms?._id ?? "" }
      await register(body)
      router.push(`/room/${selectRooms?._id}`)
    } catch (error: any) {
      toast.error(error.message)
    } finally {

    }
  }

  useEffect(() => {
    getRoomApi()
  }, [])

  const handleBookRoom = (room: RoomResponse) => {
    setSelectRooms(room)
    onOpen()
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 ">
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {rooms.map((room) => {
          return <div onClick={() => handleBookRoom(room)} className="bg-blue-200 rounded-lg cursor-pointer transform transition duration-500 
                                hover:scale-110 hover:bg-blue-300 shadow-md size-40 flex flex-col items-center justify-center gap-2">
            <h2 className="font-bold">Room: {room.name}</h2>
            <h2 className="">Limit: {room.limit}</h2>
            <h2 className="">จองแล้ว: {room.reservedSeats}</h2>
            <h2 className="">คงเหลือ: {room.remainingSeats}</h2>
          </div>
        })}
      </section>
      {selectRooms && <>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
        >
          <ModalContent>
            {(onClose: any) => (
              <>
                <ModalHeader className="flex flex-col gap-1">ลงเชื่อเข้าทำงาน ห้อง: {selectRooms.name} </ModalHeader>
                <ModalBody>
                  <Input
                    autoFocus
                    label="firstName"
                    placeholder="Enter your first name"
                    variant="bordered"
                  />
                  <Input
                    label="lastName"
                    placeholder="Enter your last name"
                    variant="bordered"
                  />
                  <Input
                    label="phone"
                    placeholder="Enter your phone"
                    type="text"
                    variant="bordered"
                  />

                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={() => registerRoom()}>
                    OK
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>}
    </section>
  );
}
