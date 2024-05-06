import axios from 'axios'
import { INTERNAL_TOKEN } from '../../common/constant'
import { type IBroadcastInput, type INotificationService } from './notification.interface'

export default class NotificationService implements INotificationService {
  broadcast = async (input: IBroadcastInput): Promise<boolean> => {
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:4005/api/notification/broadcast',
      headers: {
        authorization: INTERNAL_TOKEN
      },
      data: input
    }
    await axios.request(config)
    return true
  }
}
