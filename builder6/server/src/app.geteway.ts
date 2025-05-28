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

    socket.on("refresh-folder", (folderId) => {
      const room = getRoom(`DIR-${folderId}`);
      this.logger.log(`refresh folder ${folderId} in room ${room}`);
      socket.to(room).emit("refresh-folder", folderId);
    });

    socket.on("restore-backup", () => {
      const room = getRoom("backup-restore");
      const sess = socket.handshake.session;
      const tenant = sess?.portal?.tenantId || "unknown";
      const user = sess?.user?.id || "unknown";
      const sessId = sess?.id;

      this.logger.log(
        `WS: restore backup in room ${room} session=[sessionId='sess:${sessId}' tenantId=${tenant}|${tenantId()} userId='${user}'|'${userId()}']`,
      );
      socket.to(room).emit("restore-backup");
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

  startEdit({ fileId, room }) {
    this.logger.log(`start edit file ${fileId} in room ${room}`);
    this.server.to(room).emit("s:start-edit-file", fileId);
  }

  stopEdit({ fileId, room }) {
    this.logger.log(`stop edit file ${fileId} in room ${room}`);
    this.server.to(room).emit("s:stop-edit-file", fileId);
  }

  modifyFolder(room, cmd, id, type, data?) {
    this.server.to(room).emit("s:modify-folder", { cmd, id, type, data });
  }

  modifyFormRoom(room, cmd, id, type, data, isOneMember) {
    this.server
      .to(room)
      .emit("s:modify-room", { cmd, id, type, data, isOneMember });
  }

  createForm({ id, room, data, userIds, isOneMember }) {
    this.logger.log(`create new form ${id} in room ${room}`);
    if (userIds) {
      userIds.forEach((userId) =>
        this.modifyFormRoom(
          `${room}-${userId}`,
          "create-form",
          id,
          "file",
          data,
          isOneMember,
        ),
      );
    } else {
      this.modifyFormRoom(room, "create-form", id, "file", data, isOneMember);
    }
  }

  createFile({ id, room, data, userIds = null }) {
    this.logger.log(`create new file ${id} in room ${room}`);

    if (userIds) {
      userIds.forEach((userId) =>
        this.modifyFolder(`${room}-${userId}`, "create", id, "file", data),
      );
    } else {
      this.modifyFolder(room, "create", id, "file", data);
    }
  }

  createFolder({ id, room, data, userIds = null }) {
    this.logger.log(`create new folder ${id} in room ${room}`);
    if (userIds) {
      userIds.forEach((userId) =>
        this.modifyFolder(`${room}-${userId}`, "create", id, "folder", data),
      );
    } else {
      this.modifyFolder(room, "create", id, "folder", data);
    }
  }

  updateFile({ id, room, data, userIds = null }) {
    this.logger.log(`update file ${id} in room ${room}`);

    if (userIds) {
      userIds.forEach((userId) =>
        this.modifyFolder(`${room}-${userId}`, "update", id, "file", data),
      );
    } else {
      this.modifyFolder(room, "update", id, "file", data);
    }
  }

  updateFolder({ id, room, data, userIds = null }) {
    this.logger.log(`update folder ${id} in room ${room}`);

    if (userIds) {
      userIds.forEach((userId) =>
        this.modifyFolder(`${room}-${userId}`, "update", id, "folder", data),
      );
    } else {
      this.modifyFolder(room, "update", id, "folder", data);
    }
  }

  deleteFile({ id, room, userIds }) {
    this.logger.log(`delete file ${id} in room ${room}`);

    if (userIds) {
      userIds.forEach((userId) =>
        this.modifyFolder(`${room}-${userId}`, "delete", id, "file"),
      );
    } else {
      this.modifyFolder(room, "delete", id, "file");
    }
  }

  deleteFolder({ id, room, userIds }) {
    this.logger.log(`delete folder ${id} in room ${room}`);

    if (userIds) {
      userIds.forEach((userId) =>
        this.modifyFolder(`${room}-${userId}`, "delete", id, "folder"),
      );
    } else {
      this.modifyFolder(room, "delete", id, "folder");
    }
  }

  markAsNewFile({ fileId, count, room }) {
    this.logger.log(`markAsNewFile ${fileId} in room ${room}:${count}`);
    this.server.to(room).emit("s:markasnew-file", { fileId, count });
  }

  markAsNewFiles(items = []) {
    items.forEach(this.markAsNewFile);
  }

  markAsNewFolder({ folderId, userIds, room }) {
    this.logger.log(`markAsNewFolder ${folderId}`);
    userIds.forEach(({ count, owner }) => {
      this.server
        .to(`${room}-${owner}`)
        .emit("s:markasnew-folder", { folderId, count });
    });
  }

  markAsNewFolders(items = []) {
    items.forEach(this.markAsNewFolder);
  }

  changeQuotaUsedValue({ featureId, value, room }) {
    this.logger.log(`changeQuotaUsedValue in room ${room}`, {
      featureId,
      value,
    });
    this.server
      .to(room)
      .emit("s:change-quota-used-value", { featureId, value });
  }

  changeQuotaFeatureValue({ featureId, value, room }) {
    this.logger.log(`changeQuotaFeatureValue in room ${room}`, {
      featureId,
      value,
    });
    this.server
      .to(room)
      .emit("s:change-quota-feature-value", { featureId, value });
  }

  changeUserQuotaFeatureValue({
    customQuotaFeature,
    enableQuota,
    usedSpace,
    quotaLimit,
    userIds,
    room,
  }) {
    this.logger.log(
      `changeUserQuotaFeatureValue feature ${customQuotaFeature}, room ${room}`,
      { customQuotaFeature, enableQuota, usedSpace, quotaLimit },
    );

    if (userIds) {
      userIds.forEach((userId) =>
        this.changeCustomQuota(
          `${room}-${userId}`,
          customQuotaFeature,
          enableQuota,
          usedSpace,
          quotaLimit,
        ),
      );
    } else {
      this.changeCustomQuota(
        room,
        customQuotaFeature,
        enableQuota,
        usedSpace,
        quotaLimit,
      );
    }
  }

  changeCustomQuota(
    room,
    customQuotaFeature,
    enableQuota,
    usedSpace,
    quotaLimit,
  ) {
    if (customQuotaFeature === "tenant_custom_quota") {
      this.server.to(room).emit("s:change-user-quota-used-value", {
        customQuotaFeature,
        enableQuota,
        quota: quotaLimit,
      });
    } else {
      this.server.to(room).emit("s:change-user-quota-used-value", {
        customQuotaFeature,
        usedSpace,
        quotaLimit,
      });
    }
  }

  changeInvitationLimitValue({ value, room }) {
    this.logger.log(
      `changed user invitation limit in room ${room}, value ${value}`,
    );
    this.server.to(room).emit("s:change-invitation-limit-value", value);
  }

  updateHistory({ room, id, type }) {
    this.logger.log(`update ${type} history ${id} in room ${room}`);
    this.server.to(room).emit("s:update-history", { id, type });
  }

  logoutSession({ room, loginEventId }) {
    this.logger.log(`logout user ${room} session ${loginEventId}`);
    this.server.to(room).emit("s:logout-session", loginEventId);
  }
}
