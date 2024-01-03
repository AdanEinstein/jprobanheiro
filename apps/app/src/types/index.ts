export enum MessageType {
  ENTER = 'enter',
  LEAVE = 'leave',
  REFRESH = 'refresh',
  UPDATE = 'update'
}

export enum ClientStatus {
  USING = 'using',
  WAITING = 'waiting',
}

export type Client = {
  id: string
  name: string
  status: ClientStatus
}

export type Message = {
  type?: MessageType
  client?: Client
}