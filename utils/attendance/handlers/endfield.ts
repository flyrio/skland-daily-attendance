import type { AppBindingPlayer } from 'skland-kit'
import type { AttendanceHandler } from '../types'
import { defineAttendanceHandler } from '../registry'
import { formatEndfieldAwards, isTodayAttended } from '../shared'

function validateEndfieldCharacter(
  character: AppBindingPlayer,
): { valid: boolean, reason?: string } {
  if (!character.defaultRole) {
    return {
      valid: false,
      reason: '没有角色',
    }
  }
  return { valid: true }
}

const handler: AttendanceHandler = async ({
  client,
  character,
  characterLabel,
}) => {
  // 这里不需要再检查 defaultRole，因为 validate 已经检查过了
  const query = {
    gameId: character.gameId,
    serverId: character.defaultRole!.serverId,
    roleId: character.defaultRole!.roleId,
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
  const awards = formatEndfieldAwards(data.awardIds, data.resourceInfoMap)

  return {
    success: true,
    message: `${characterLabel} 签到成功，获得了${awards}`,
    hasError: false,
  }
}

export const endfield = defineAttendanceHandler({
  gameId: 3,
  gameName: '明日方舟：终末地',
  handler,
  validate: validateEndfieldCharacter,
})
