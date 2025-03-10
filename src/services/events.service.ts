import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
  }

  @SubscribeMessage('profile-updated')
  handleProfileUpdate(client: Socket, room: string) {
    client.broadcast
      .to(room)
      .emit(
        'profile-updated',
        'Profile updated, please fetch the profile again',
      );
  }

  @SubscribeMessage('user-deactivated')
  handleUserDeactivated(client: Socket, room: string) {
    client.broadcast
      .to(room)
      .emit('user-deactivated', 'User deactivated. Kindly logout');
  }

  @SubscribeMessage('content-changed')
  handleContentChanged(client: Socket, room: string) {
    client.broadcast.to(room).emit('content-changed', 'Content changed');
  }
}
