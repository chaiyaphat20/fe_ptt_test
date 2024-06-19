'use client'

import { useEffect, useState } from "react";
import { getRooms } from "./services/room-setvice";
import { RoomResponse } from "./models/room-model";
import { useRouter } from "next/navigation";
import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link } from "@nextui-org/react";
import { registerUser } from "./services/user-service";
import { UserRegisterBody, UserRegisterSchema } from "./models/user-model";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { error } from "console";

export default function Home() {
  const [rooms, setRooms] = useState<RoomResponse[]>([])
  const [selectRooms, setSelectRooms] = useState<RoomResponse>()
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter()

  const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'ArrowLeft', 'ArrowRight'];
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  };

  const { register, handleSubmit, formState: { errors } } = useForm<UserRegisterBody>({
    resolver: zodResolver(UserRegisterSchema),
  })

  const getRoomApi = async () => {
    try {
      const response = await getRooms()
      setRooms(response)
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

  const onSubmit = async (values: UserRegisterBody) => {
    try {
      const body: UserRegisterBody = { firstName: values.firstName, lastName: values.lastName, phone: values.phone, roomId: selectRooms?._id ?? "" }
      await registerUser(body)
      router.push(`/room/${selectRooms?._id}`)
    } catch (error: any) {
      toast.error(error.message)
    } finally {

    }
  }
  console.log({ errors })
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

                <form onSubmit={handleSubmit(onSubmit)}>
                  <ModalBody>
                    <Input
                      {...register('firstName')}
                      autoFocus
                      label="firstName"
                      placeholder="Enter your first name"
                      variant="bordered"
                    />
                    <Input
                      {...register('lastName')}
                      label="lastName"
                      placeholder="Enter your last name"
                      variant="bordered"
                    />
                    <Input
                      {...register('phone')}
                      label="phone"
                      placeholder="Enter your phone"
                      type="text"
                      variant="bordered"
                      onKeyDown={onKeyDown}
                    />
                  </ModalBody>


                  <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                      Close
                    </Button>

                    <button className="px-4 py3.5 rounded-xl bg-blue-500 shadow-md text-white">
                      OK
                    </button>
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>
      </>}
    </section>
  );
}
