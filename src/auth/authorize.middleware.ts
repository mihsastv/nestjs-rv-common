import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import Hemera from 'nats-hemera';

interface Session {
  user?: number;
}

@Injectable()
export class AuthorizeMiddleware implements NestMiddleware {
  constructor(@Inject('Hemera') private readonly hemera: Hemera<{}, {}>) {}

  async use(req: Request, _res: Response, next: Function) {
    const sid = req.cookies.system;

    if (sid) {
      const session = await this.getSessionData(sid);
      req.userId = session?.user;
    }

    next();
  }

  private async getSessionData(
    sid: string,
  ): Promise<undefined | Session> {
    const { data: session }: { data: Session } = await this.hemera
      .act({
        cmd: 'signed:get',
        payload: {
          sid,
        },
        timeout$: 60 * 1000,
        topic: 'auth:session',
      });

    return session;
  }
}
