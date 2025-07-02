import { Controller, Get, Request } from "@nestjs/common";

@Controller("users")
export class UsersController {
  @Get("me")
  getMe(@Request() req) {
    return req.user;
  }

}