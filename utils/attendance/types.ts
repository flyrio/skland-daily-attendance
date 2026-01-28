import type { AppBindingPlayer, Client } from 'skland-kit'

export interface AttendanceHandlerInput {
  client: Client
  character: AppBindingPlayer
  characterLabel: string
}

export interface AttendanceHandlerResult {
  success: boolean
  message: string
  hasError: boolean
}

export type AttendanceHandler = (
  input: AttendanceHandlerInput,
) => Promise<AttendanceHandlerResult>

export interface AttendanceHandlerConfig {
  gameId: number
  gameName: string
  handler: AttendanceHandler
  validate?: (character: AppBindingPlayer) => {
    valid: boolean
    reason?: string
  }
}
