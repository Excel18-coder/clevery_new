import {
  Pusher,
} from '@pusher/pusher-websocket-react-native';

  export const pusher = Pusher.getInstance();

 export const pusherConnector = async ()=>{
    try {
      const pusher = Pusher.getInstance();

      await pusher.init({
        apiKey: '824b4f0c4520e22ea7e3',
        cluster: 'ap1'
      });

      await pusher.connect();
    } catch (error) {
      console.log( `Pusher error: `, error)
    }
  }