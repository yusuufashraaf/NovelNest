import { Component } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { AiChatComponent } from '../../ai-chat/ai-chat';

@Component({
  selector: 'app-main-layout',
  imports: [Navbar, RouterOutlet, AiChatComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {}
