import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket!: Socket;

  // Connect and emit the token
  connectToServer(token: string,data?:any) {
      this.socket = io('https://1d8f222f-e6cd-4b30-8295-eee3fc85c4bc-00-x25a0w5n7axr.janeway.replit.dev/',{
      transports: ['websocket']
    });

    this.socket.on('connect', () => {
      if(data){
        this.socket.emit('connectToserver', token,data);
      }else{
        this.socket.emit('connectToserver', token);
      }
    });

    this.socket.on('unauthorized', () => {
      console.error(' Unauthorized: Invalid token');
    });
  }

  // Admins: Listen for notifications
  onNotification(callback: (message: string) => void) {
    this.socket.on('newNotification', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
