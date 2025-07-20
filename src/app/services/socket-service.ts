import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket!: Socket;

  // Connect and emit the token
  connectToServer(token: string,data?:any) {
      this.socket = io('https://b18a0ddd-9c40-496c-bd4d-f4b2c80b4fe5-00-14akmsgx4v42l.spock.replit.dev/',{
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
