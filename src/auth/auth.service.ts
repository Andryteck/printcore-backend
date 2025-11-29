import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: User; token: string }> {
    const { email, password, name, phone, userType, unp } = registerDto;

    // Проверка существующего пользователя
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
      phone,
      userType: userType || 'individual', // По умолчанию физическое лицо
      unp: unp || undefined, // УНП для юридических лиц
    });

    await this.usersRepository.save(user);

    // Генерация токена
    const token = this.generateToken(user);

    return { user, token };
  }

  async login(loginDto: LoginDto): Promise<{ user: User; token: string }> {
    const { email, password } = loginDto;

    console.log('[AuthService] Login attempt:', {
      email,
      passwordLength: password?.length || 0,
      hasPassword: !!password
    });

    // Поиск пользователя
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    console.log('[AuthService] User found:', {
      found: !!user,
      userId: user?.id,
      userEmail: user?.email,
      isActive: user?.isActive
    });

    if (!user) {
      console.error('[AuthService] User not found for email:', email);
      console.error('[AuthService] Проверьте, что пользователь существует в базе данных');
      console.error('[AuthService] Возможно, база данных была очищена. Нужно зарегистрировать пользователя заново.');
      throw new UnauthorizedException('Неверный email или пароль');
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log('[AuthService] Password validation:', {
      isValid: isPasswordValid,
      hasStoredPassword: !!user.password
    });

    if (!isPasswordValid) {
      console.error('[AuthService] Invalid password for user:', email);
      console.error('[AuthService] Пароль не совпадает. Проверьте правильность введенного пароля.');
      throw new UnauthorizedException('Неверный email или пароль');
    }

    // Проверка активности
    if (!user.isActive) {
      console.error('[AuthService] User account is inactive:', email);
      throw new UnauthorizedException('Аккаунт деактивирован');
    }

    // Генерация токена
    const token = this.generateToken(user);

    console.log('[AuthService] Login successful:', {
      userId: user.id,
      email: user.email,
      tokenGenerated: !!token
    });

    return { user, token };
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    return user;
  }

  private generateToken(user: User): string {
    const payload = { userId: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}

