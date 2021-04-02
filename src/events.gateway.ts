import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  SubscribeMessage
} from '@nestjs/websockets';

import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';

@WebSocketGateway(4001, { transport: ['websocket'] })
export class EventsGateway implements OnGatewayConnection {
  // handleDisconnect(client: any) {
  //   this.logger.log('Server disconnected');
  // }
  private logger = new Logger('AppGateway');
  handleConnection(client) {
    this.logger.log('New client connected');
    client.emit('connection', 'connection success')
  }
  @WebSocketServer()
  wss: any;
  @WebSocketServer()
  server: Server;


  // afterInit() {
  //   this.server.emit('file', { do: 'test-file' });
  // }

}
