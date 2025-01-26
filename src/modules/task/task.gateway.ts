import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Task } from 'src/entities/task.entity';
import { WinstonLoggerService } from 'src/logger/winston-logger.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TaskGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(
    private readonly logger: WinstonLoggerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  afterInit(server: Server) {
    this.logger.info('WebSocket gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('Missing token');
      }
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      });
      client.data.user = payload;

      const projectId = client.handshake.query.projectId;
      client.join(`project-${projectId}`);

      client.emit('welcome', {
        message: 'Welcome to the project',
      });
    } catch (error) {
      console.error('Authorization failed:', error.message);
      client.emit('error', 'Unauthorized');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.info(`Client disconnected: ${client.id}`);
  }

  notifyTaskCreated(task: Task) {
    const projectId = task.project.id;

    this.logger.info('Notifying project members about task creation', {
      projectId,
      taskId: task.id,
      taskName: task.name,
    });

    const payload = {
      taskName: task.name,
      assignedTo: task.assignee,
      status: task.status,
      dealine: task.deadline,
    };
    this.server.to(`project-${projectId}`).emit('task create', payload);

    this.logger.info(
      `Task creation notification sent to room: project-${projectId}`,
    );
  }

  notifyTaskStatusUpdated(name: string, status: string, projectId: number) {
    this.logger.info('Notifying project members about task status update', {
      name,
      status,
      projectId,
    });

    this.server.to(`project-${projectId}`).emit('task status updated', {
      name,
      status,
    });

    this.logger.info(
      `Task status update notification sent to room: project-${projectId}`,
    );
  }
}
