
import { Component,  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SocketService } from './services/socket-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'NovelNest';

  constructor(private socketService: SocketService) {};

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.socketService.connectToServer(token);

      this.socketService.onNotification((msg: any) => {
      if (typeof msg === 'object' && msg.orderId && msg.nameOfCustomer) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: `🛒 New order from ${msg.nameOfCustomer}`,
        text: `Order ID: ${msg.orderId}`,
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true
      });
    } else {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: 'New Message',
        text: typeof msg === 'string' ? msg : JSON.stringify(msg),
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true
      });
    }
    });
    }
  }

}
