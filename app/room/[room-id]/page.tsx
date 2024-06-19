'use client'

import { RoomResponse } from '@/app/models/room-model'
import { getRoomById } from '@/app/services/room-setvice'
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
    <div>{room?.name}</div>
  )
}
