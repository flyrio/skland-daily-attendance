import type { AttendanceHandler } from '../types'
import { defineAttendanceHandler } from '../registry'
import { formatArknightsAwards, isTodayAttended } from '../shared'

const handler: AttendanceHandler = async ({
  client,
  character,
  characterLabel,
}) => {
  const query = {
    uid: character.uid,
    gameId: character.gameId,
  }

  const attendanceStatus = await client.collections.game.getAttendanceStatus(query)

  if (isTodayAttended(attendanceStatus)) {
    return {
      success: false,
      message: `${characterLabel} 今天已经签到过了`,
      hasError: false,
    }
  }

  const data = await client.collections.game.attendance(query)
  const awards = formatArknightsAwards(data.awards)

  return {
    success: true,
    message: `${characterLabel} 签到成功，获得了${awards}`,
    hasError: false,
  }
}

export const arknights = defineAttendanceHandler({
  gameId: 1,
  gameName: '明日方舟',
  handler,
})
