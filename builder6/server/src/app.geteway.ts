import { Logger } from "@nestjs/common";
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import moment from "moment";
import { AuthService } from "@builder6/core";
import * as cookie from "cookie";

@WebSocketGateway({ path: "/socket.io/", cors: true })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly authService: AuthService) {}

  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(AppGateway.name);

  async handleConnection(socket) {
    const rawCookie = socket.handshake.headers.cookie;
    const cookies = cookie.parse(rawCookie || "");

    const token = `${cookies["X-Space-Id"]},${cookies["X-Auth-Token"]}`;
    const user = token && (await this.authService.getUserByToken(token));
    const space = cookies["X-Space-Id"];
    const session = {
      user: user && {
        id: user.user,
        ...user,
      },
      anonymous: !user,
      system: false,
      portal: {
        tenantId: space,
      },
      linkId: null,
    };
    this.logger.log(session);
    socket.handshake.session = session;

    if (!session) {
      this.logger.error("empty session");
      return;
    }

    if (session.system) {
      this.logger.log(`connect system as socketId='${socket.id}'`);

      socket.on("ping", (date) => {
        this.logger.log(`ping (client ${socket.id}) at ${date}`);
        this.server.to(socket.id).emit("pong", moment.utc());
      });

      socket.on("disconnect", (reason) => {
        this.logger.log(
          `disconnect system as socketId='${socket.id}' due to ${reason}`,
        );
      });

      return;
    }

    if (!session.user && !session.anonymous) {
      this.logger.error("invalid session: unknown user");
      return;
    }

    if (!session.portal) {
      this.logger.error("invalid session: unknown portal");
      return;
    }

    const userId = () => {
      return socket.handshake.session?.user?.id;
    };
    const tenantId = () => {
      return socket.handshake.session?.portal?.tenantId;
    };

    const linkId = () => {
      return socket.handshake.session?.linkId;
    };

    const getRoom = (roomPart) => {
      return `${tenantId()}-${roomPart}`;
    };

    const connectMessage = !session.anonymous
      ? `connect user='${userId()}' on tenant='${tenantId()}' socketId='${socket.id}'`
      : `connect anonymous user by share key on tenant='${tenantId()}' socketId='${socket.id}'`;

    this.logger.log(connectMessage);

    socket.on("disconnect", (reason) => {
      const disconnectMessage = !session.anonymous
        ? `disconnect user='${userId()}' on tenant='${tenantId()}' socketId='${socket.id}' due to ${reason}`
        : `disconnect anonymous user by share key on tenant='${tenantId()}' socketId='${socket.id}' due to ${reason}`;

      this.logger.log(disconnectMessage);
    });

    socket.on("subscribe", ({ roomParts, individual }) => {
      changeSubscription(roomParts, individual, subscribe);
    });

    socket.on("unsubscribe", ({ roomParts, individual }) => {
      changeSubscription(roomParts, individual, unsubscribe);
    });

    const changeSubscription = (roomParts, individual, changeFunc) => {
      if (!roomParts) return;

      changeFunc(roomParts);

      if (individual) {
        if (Array.isArray(roomParts)) {
          changeFunc(roomParts.map((p) => `${p}-${userId()}`));

          if (linkId()) {
            changeFunc(roomParts.map((p) => `${p}-${linkId()}`));
          }
        } else {
          changeFunc(`${roomParts}-${userId()}`);

          if (linkId()) {
            changeFunc(`${roomParts}-${linkId()}`);
          }
        }
      }
    };

    const subscribe = (roomParts) => {
      if (!roomParts) return;

      if (Array.isArray(roomParts)) {
        const rooms = roomParts.map((p) => getRoom(p));
        this.logger.log(`client ${socket.id} join rooms [${rooms.join(",")}]`);
        socket.join(rooms);
      } else {
        const room = getRoom(roomParts);
        this.logger.log(`client ${socket.id} join room ${room}`);
        socket.join(room);
      }
    };

    const unsubscribe = (roomParts) => {
      if (!roomParts) return;

      if (Array.isArray(roomParts)) {
        const rooms = roomParts.map((p) => getRoom(p));
        this.logger.log(`client ${socket.id} leave rooms [${rooms.join(",")}]`);
        socket.leave(rooms);
      } else {
        const room = getRoom(roomParts);
        this.logger.log(`client ${socket.id} leave room ${room}`);
        socket.leave(room);
      }
    };

    this.server.to(socket.id).emit("connection-init");
  }

  handleDisconnect(client: Socket) {
    console.log("Socket.IO disconnected:", client.id);
  }

  metadataChange({ type, action, _id, name, objectName }) {
    this.server.emit("metadata:change", {
      type,
      action,
      _id,
      name,
      objectName,
    });
  }

  logoutSession({ room, loginEventId }) {
    this.logger.log(`logout user ${room} session ${loginEventId}`);
    this.server.to(room).emit("s:logout-session", loginEventId);
  }
}
