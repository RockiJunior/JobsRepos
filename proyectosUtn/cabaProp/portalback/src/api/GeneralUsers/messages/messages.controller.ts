import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  Post,
  BadRequestException,
  Req,
} from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { ApiTags, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JoinRoomDto } from "./dto/join-room.dto";
import { CreateClientMessageDto } from "./dto/create-client-message.dto";
import { CreateUserMessageDto } from "./dto/create-user-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { CreateClientUserMessageDto } from "./dto/client-user-message.dto";
import { CheckPermissions } from "../auth/decorators/permission.decorator";
import { PermissionEnumList } from "../../../config/enum-types";
import { PermissionGuard } from "../auth/guards/permission-guard";
import { UseGuards } from "@nestjs/common";
import { Public } from "../auth/decorators/public.decorator";
import { ConversationsService } from "../conversations/conversations.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateConversationDto } from "./dto/create-conversation.dto";

const { SOCKET_PORT } = process.env;
@WebSocketGateway(parseInt(SOCKET_PORT), {
  // namespace: 'cabaprop-chat', // => especifica el nombre único de este gateway, por si se necesita usar varios de estos...
  transports: ["websocket", "polling"],
  cors: {
    allowedHeaders: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    origin: "*",
    // origin: ['http://localhost:3000'], // asi se pueden agregar url's para dar permisos a rutas especificas
  },
})
@ApiTags("Messages")
@Controller("messages")
export class MessagesController
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;
  constructor(
    private readonly messagesService: MessagesService,
    private readonly conversationService: ConversationsService
  ) {}

  afterInit(server: any): void {
    // console.log('esto se ejecuta cuando inicia');
  }

  handleConnection(socket: any, ...args: any[]) {
    // console.log(socket.id); // socketId
  }

  handleDisconnect(client: any) {
    // console.log('Hola alguien se desconecto del socket');
  }

  //Join a las rooms de cada conversacion para recibir nuevos mensajes
  @SubscribeMessage("joinConversation") // socket.on
  async joinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: any
  ) {
    const { conversationId } = body;
    client.join(`room_${conversationId}`);
  }

  //Join a las oficinas para recibir nuevas conversaciones cuando se recibe una nueva consulta sin F5
  @SubscribeMessage("joinBranchOffice") // socket.on
  async joinBranchOffice(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: any
  ) {
    const { branchOfficeId } = body;
    client.join(`branch_office_${branchOfficeId}`);
  }
  
  //Join a la room del cliente para recibir sus nuevas consultas sin F5
  @SubscribeMessage("joinClient") // socket.on
  async joinClient(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: any
  ) {
    const { clientId } = body;
    client.join(`client_${clientId}`);
  }

  @SubscribeMessage("send_message")
  async handleIncommingMessage(
    @MessageBody() createClientUserMessageDto: CreateClientUserMessageDto
  ) {
    const { userId, clientId, conversationId, branchOfficeId } =
      createClientUserMessageDto;
    if (conversationId && userId) {
      // creo el mensaje
      const createUserMessageDto: CreateUserMessageDto = {
        ...createClientUserMessageDto,
        userId,
      };
      await this.messagesService.createUserMessage(createUserMessageDto);
      // busco los mensajes
      const conversation = await this.conversationService.findByConversationId(
        conversationId
      );
      // envio los mensajes
      this.server.to(`room_${conversationId}`).emit("get_messages", {
        conversation,
      });
    } else if (conversationId && clientId) {
      // creo el mensaje
      const createClientMessageDto: CreateClientMessageDto = {
        ...createClientUserMessageDto,
        clientId,
      };
      await this.messagesService.createClientMessage(createClientMessageDto);
      // busco los mensajes
      const conversation = await this.conversationService.findByConversationId(
        conversationId
      );
      // envio los mensajes
      this.server.to(`room_${conversationId}`).emit("get_messages", {
        conversation,
      });
    } else {
      // Creo objeto en base al DTO y ejecuto la creacion de la conversacion
      const createConversationDto: CreateConversationDto = {
        ...createClientUserMessageDto,
      };
      const conversationCreated = await this.messagesService.createConversation(
        createConversationDto
      );
      // busco los mensajes
      const conversation = await this.conversationService.findByConversationId(
        conversationCreated.id
      );
      // envio los mensajes
      this.server
        .to(`branch_office_${branchOfficeId}`)
        .emit("new_conversation", {
          conversation,
        });
      this.server.to(`client_${clientId}`).emit("new_conversation", {
        conversation,
      });
    }
  }

  // @SubscribeMessage('typing')
  // async typing(
  // 	@MessageBody('isTyping') isTyping: boolean,
  // 	@ConnectedSocket() client: Socket
  // ) {
  // 	const name = await this.messagesService.getClientName(client.id);
  // 	client.broadcast.emit('typing', { name, isTyping });
  // }

  //  -------------------------------------------------------------------- HTTP REQUEST METHODS
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: "Success Response",
  })
  @ApiResponse({
    type: BadRequestException,
    description: "Try to fix or fill empty fields",
  })
  @Post("client")
  createClientMessage(@Body() createClientMessageDto: CreateClientMessageDto) {
    return this.messagesService.createClientMessage(createClientMessageDto);
  }

  @ApiBearerAuth()
  @CheckPermissions(
    PermissionEnumList.createMessage,
  )
  @UseGuards(PermissionGuard)
  @ApiResponse({
    status: 200,
    description: "Success Response",
  })
  @ApiResponse({
    type: BadRequestException,
    description: "Try to fix or fill empty fields",
  })
  @Post("user")
  createMessageUser(@Body() createUserMessageDto: CreateUserMessageDto) {
    return this.messagesService.createUserMessage(createUserMessageDto);
  }

  @ApiBearerAuth()
  @CheckPermissions(
    PermissionEnumList.seeConversation,
  )
  @UseGuards(PermissionGuard)
  @ApiResponse({
    status: 200,
    description: "Success Response",
  })
  @ApiResponse({
    type: BadRequestException,
    description: "Try to fix or fill empty fields",
  })
  @Get(":conversationId")
  findAll(@Param("conversationId") conversationId: number) {
    return this.messagesService.findMessagesByConversationId(conversationId);
  }

  @ApiBearerAuth()
  @CheckPermissions(
    PermissionEnumList.seeConversation,
    PermissionEnumList.deleteConversation
  )
  @UseGuards(PermissionGuard)
  @ApiResponse({
    status: 200,
    description: "Success Response",
  })
  @ApiResponse({
    type: BadRequestException,
    description: "Try to fix or fill empty fields",
  })
  @Patch("edit-message/:messageId")
  update(
    @Param("messageId") messageId: number,
    @Body() updateMessageDto: UpdateMessageDto
  ) {
    return this.messagesService.updateMessage(messageId, updateMessageDto);
  }

  @ApiBearerAuth()
  @CheckPermissions(
    PermissionEnumList.seeConversation,
    PermissionEnumList.deleteConversation
  )
  @UseGuards(PermissionGuard)
  @ApiResponse({
    status: 200,
    description: "Success Response",
  })
  @ApiResponse({
    type: BadRequestException,
    description: "Try to fix or fill empty fields",
  })
  @Patch("update-read-at/:messageId")
  updateReadAt(@Param("messageId") messageId: number) {
    return this.messagesService.updateReadAt(messageId);
  }

  @ApiBearerAuth()
  @CheckPermissions(PermissionEnumList.deleteMessage)
  @UseGuards(PermissionGuard)
  @ApiResponse({
    status: 200,
    description: "Success Response",
  })
  @ApiResponse({
    type: BadRequestException,
    description: "Try to fix or fill empty fields",
  })
  @Delete(":messageId")
  remove(@Param("messageId") messageId: number) {
    return this.messagesService.remove(messageId);
  }
}
