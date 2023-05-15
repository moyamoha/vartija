import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
// import { UseInterceptors } from '@nestjs/common';
// import { CorsInterceptor } from 'src/interceptors/cors.interceptor';

@WebSocketGateway({ cors: true })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    console.log(`Client ${client.id} joined room ${room}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
  }

  @SubscribeMessage('profile-updated')
  handleProfileUpdate(client: Socket, room: string) {
    this.server.to(room).emit('profile-updated', 'Profile updated');
  }

  @SubscribeMessage('user-deactivated')
  handleUserDeactivated(client: Socket, room: string) {
    this.server.to(room).emit('user-deactivated', 'User deactivated');
  }
}
