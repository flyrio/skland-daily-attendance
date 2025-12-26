import type { AttendanceStatus } from 'skland-kit'
import process from 'node:process'
import { setTimeout } from 'node:timers/promises'
import { createClient } from 'skland-kit'
import { createSender } from 'statocysts'

const client = createClient()

interface Options {
  notificationUrls?: string | string[]
}

interface AttendanceResult {
  success: boolean
  message: string
  hasError: boolean
}

// Helper function to check if today's attendance is already done
function isTodayAttended(attendanceStatus: AttendanceStatus): boolean {
  const today = new Date().setHours(0, 0, 0, 0)
  return attendanceStatus.records.some((record) => {
    return new Date(Number(record.ts) * 1000).setHours(0, 0, 0, 0) === today
  })
}

// Helper function to convert single value to array
function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

// Helper function to get server name
function getServerName(channelMasterId: string): string {
  return Number(channelMasterId) - 1 ? 'B 服' : '官服'
}

function createMessageCollector(options: Options) {
  const messages: string[] = []
  let hasError = false

  const log = (message: string, isError = false) => {
    messages.push(message)
    console[isError ? 'error' : 'log'](message)
    if (isError) {
      hasError = true
    }
  }

  const push = async () => {
    const title = '【森空岛每日签到】'
    const content = messages.join('\n\n')
    const urls = options.notificationUrls ? toArray(options.notificationUrls) : []
    const sender = createSender(urls)

    await sender.send(title, content)

    // Exit with error if any error occurred
    if (hasError) {
      process.exit(1)
    }
  }

  return { log, push, hasError: () => hasError } as const
}

// Attend for a single character with retry logic
async function attendCharacter(
  character: { uid: string, channelMasterId: string },
  index: number,
  maxRetries: number,
): Promise<AttendanceResult> {
  const serverName = getServerName(character.channelMasterId)
  const characterLabel = `${serverName}角色 ${index + 1}`

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const query = {
        uid: character.uid,
        gameId: character.channelMasterId,
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
      const awards = data.awards.map(a => `「${a.resource.name}」${a.count}个`).join(',')

      return {
        success: true,
        message: `${characterLabel} 签到成功，获得了${awards}`,
        hasError: false,
      }
    }
    catch (error: unknown) {
      // Handle 403 error as already attended
      if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as any).response
        if (response && response.status === 403) {
          return {
            success: false,
            message: `${characterLabel} 今天已经签到过了`,
            hasError: false,
          }
        }
      }

      // For other errors, retry if not the last attempt
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (attempt === maxRetries - 1) {
        console.error(`${characterLabel} 签到失败，已达到最大重试次数`)
        return {
          success: false,
          message: `${characterLabel} 签到过程中出现未知错误: ${errorMessage}`,
          hasError: true,
        }
      }

      console.log(`${characterLabel} 签到失败，重试中... (${attempt + 1}/${maxRetries})`)
      await setTimeout(1000) // Wait 1s before retry
    }
  }

  // Should never reach here, but for type safety
  return {
    success: false,
    message: `${characterLabel} 签到失败`,
    hasError: true,
  }
}

export async function doAttendanceForAccount(token: string, options: Options) {
  const { code } = await client.collections.hypergryph.grantAuthorizeCode(token)
  await client.signIn(code)

  const { list } = await client.collections.player.getBinding()
  const messageCollector = createMessageCollector(options)

  messageCollector.log('## 明日方舟签到')

  const characterList = list
    .filter(i => i.appCode === 'arknights')
    .flatMap(i => i.bindingList)

  const maxRetries = Number.parseInt(process.env.MAX_RETRIES || '3', 10)

  // Process characters sequentially to avoid rate limiting and ensure proper logging
  const results: AttendanceResult[] = []
  for (let i = 0; i < characterList.length; i++) {
    const character = characterList[i]
    console.log(`正在签到第 ${i + 1}/${characterList.length} 个角色`)

    const result = await attendCharacter(character, i, maxRetries)
    results.push(result)
    messageCollector.log(result.message, result.hasError)

    // Add delay between characters to avoid rate limiting
    if (i < characterList.length - 1) {
      await setTimeout(3000)
    }
  }

  // Count successful attendances
  const successCount = results.filter(r => r.success).length
  if (successCount > 0) {
    messageCollector.log(`成功签到 ${successCount} 个角色`)
  }

  await messageCollector.push()
}
