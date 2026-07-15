import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../database/base.repository';
import { AUTH_CONSTANTS } from '../constants/auth.constants';

@Injectable()
export class LoginAttemptRepository extends BaseRepository {
  async findByEmailAndIp(email: string, ip: string) {
    return this.prisma.loginAttempt.findUnique({
      where: { email_ip: { email: email.toLowerCase().trim(), ip } },
    });
  }

  async isBlocked(email: string, ip: string): Promise<boolean> {
    const record = await this.findByEmailAndIp(email, ip);
    if (!record?.blockedUntil) return false;
    return record.blockedUntil > new Date();
  }

  async getBlockedUntil(email: string, ip: string): Promise<Date | null> {
    const record = await this.findByEmailAndIp(email, ip);
    if (!record?.blockedUntil || record.blockedUntil <= new Date()) return null;
    return record.blockedUntil;
  }

  async recordFailedAttempt(email: string, ip: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await this.findByEmailAndIp(normalizedEmail, ip);
    const newAttempts = (existing?.attempts ?? 0) + 1;

    const blockedUntil =
      newAttempts >= AUTH_CONSTANTS.LOGIN_MAX_ATTEMPTS
        ? new Date(Date.now() + AUTH_CONSTANTS.LOGIN_BLOCK_MINUTES * 60 * 1000)
        : null;

    return this.prisma.loginAttempt.upsert({
      where: { email_ip: { email: normalizedEmail, ip } },
      update: {
        attempts: newAttempts,
        blockedUntil,
        lastAttemptAt: new Date(),
      },
      create: {
        email: normalizedEmail,
        ip,
        attempts: 1,
        blockedUntil: newAttempts >= AUTH_CONSTANTS.LOGIN_MAX_ATTEMPTS ? blockedUntil : null,
      },
    });
  }

  async clearAttempts(email: string, ip: string) {
    const normalizedEmail = email.toLowerCase().trim();
    await this.prisma.loginAttempt.deleteMany({
      where: { email: normalizedEmail, ip },
    });
  }
}
