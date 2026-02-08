import { NextFunction, Request, Response } from 'express';
import { defineAbilityFor } from '@application/configs/ability-factory';
import type { Action, Subject } from '@application/configs/ability.types';
import type { SafeUser } from '@application/uses-cases/user/types/auth-user.type';

export function checkAbility(action: Action, subject: Subject) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as SafeUser;

    if (!user) {
      res.status(401).json({ error: 'Unauthorized: No user found in request' });
      return;
    }

    const ability = defineAbilityFor({ id: user.id, role: user.role });

    if (ability.can(action, subject)) {
      next();
    } else {
      res.status(403).json({
        error: 'Forbidden: You do not have permission to perform this action',
      });
    }
  };
}
