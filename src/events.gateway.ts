import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';

import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
//import { Server } from 'ws';

@WebSocketGateway(4001, { transport: ['websocket'] })
export class EventsGateway implements OnGatewayConnection {
  // handleDisconnect(client: any) {
  //   this.logger.log('Server disconnected');
  // }
  private logger = new Logger('AppGateway');
  handleConnection(client: any) {
    this.logger.log("Client Connected");
    client.emit('connections', 'success')
  }


  @WebSocketServer()
  wss: any;
  @WebSocketServer()
  server: Server;




}
