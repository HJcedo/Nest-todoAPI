import { Body, Controller, Post } from "@nestjs/common";
import { Public } from "./public.decorator";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "src/users/dto/login-user.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("Register")
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post("Login")
  async login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }
}