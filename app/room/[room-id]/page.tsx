'use client'

import { RoomResponse } from '@/app/models/room-model'
import { getRoomById } from '@/app/services/room-setvice'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import React, { useEffect, useState } from 'react'

export default function Page({
  params
}: {
  params: { "room-id": string }
}) {
  const roomId = params["room-id"]
  const [room, setRoom] = useState<RoomResponse>()

  const getRoomApi = async (roomId: string) => {
    try {
      const response = await getRoomById(roomId)
      setRoom(response)
    } catch (error: any) {
      console.error(error.message)
    } finally {

    }
  }

  useEffect(() => {
    if (!roomId) return
    getRoomApi(roomId)
  }, [roomId])

  return (
    <div>
      <Table aria-label="Example static collection table">
        <TableHeader >
          <TableColumn className='text-center'>First Name</TableColumn>
          <TableColumn className='text-center'>Last Name</TableColumn>
          <TableColumn className='text-center'>Phone</TableColumn>
        </TableHeader>
        <TableBody >
          {room ? (
            room.users.map((item, index) => (
              <TableRow key={index} className='text-center'>
                <TableCell>{item.firstName}</TableCell>
                <TableCell>{item.lastName}</TableCell>
                <TableCell>{item.phone}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className='text-center'>
              <TableCell >Loading...</TableCell>
              <TableCell >Loading...</TableCell>
              <TableCell>Loading...</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
