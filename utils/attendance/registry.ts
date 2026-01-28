import type { AttendanceHandlerConfig } from './types'
import { arknights } from './handlers/arknights'
import { endfield } from './handlers/endfield'

export interface AttendanceHandlerRegistry {
  register: (config: AttendanceHandlerConfig) => void
  get: (gameId: number) => AttendanceHandlerConfig | undefined
  has: (gameId: number) => boolean
  getAllGameIds: () => number[]
}

function createAttendanceHandlerRegistry(init?: Iterable<readonly [number, AttendanceHandlerConfig]>): AttendanceHandlerRegistry {
  const handlers = new Map<number, AttendanceHandlerConfig>(init)

  return {
    register(config) {
      if (handlers.has(config.gameId)) {
        console.warn(`Attendance handler for gameId ${config.gameId} already registered, overwriting...`)
      }
      handlers.set(config.gameId, config)
    },

    get(gameId) {
      return handlers.get(gameId)
    },

    has(gameId) {
      return handlers.has(gameId)
    },

    getAllGameIds() {
      return Array.from(handlers.keys())
    },
  }
}

// Export singleton instance
export const attendanceHandlerRegistry = createAttendanceHandlerRegistry([
  [1, arknights],
  [3, endfield],
])

export function defineAttendanceHandler(
  config: AttendanceHandlerConfig,
): AttendanceHandlerConfig {
  return config
}
