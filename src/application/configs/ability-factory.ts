import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import type { AppAbility, Action, Subject } from '@application/configs/ability.types';
import { Role } from '@domain/entities/role.entity';

interface UserWithRole {
  id: number;
  role: Role;
}

export function defineAbilityFor(user: UserWithRole): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  if (user.role && user.role.permissions) {
    user.role.permissions.forEach((permission) => {
      // Mapping database strings to CASL Action and Subject types
      can(permission.action as Action, permission.subject as Subject);
    });
  }

  return build();
}
