export interface IBroadcastInput {
  msgId: string
  content: string
}

export interface INotificationService {
  broadcast: (input: IBroadcastInput) => any
}
