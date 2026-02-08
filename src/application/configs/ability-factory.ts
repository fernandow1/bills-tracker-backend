import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Role } from '@domain/enums/role.enum';
import type { AppAbility } from '@application/configs/ability.types';

interface UserWithRole {
  id: number;
  role: Role;
}

export function defineAbilityFor(user: UserWithRole): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  switch (user.role) {
    case Role.Admin:
      // Admin can do everything
      can('manage', 'all');
      break;

    case Role.User:
      // User can read all resources
      can('read', ['Brand', 'Category', 'Currency', 'PaymentMethod', 'Product', 'Shop']);

      // User can manage their own bills (will need conditions in the future)
      can(['create', 'read', 'update', 'delete'], 'Bill');

      // User can read and update their own user profile (will need conditions in the future)
      can(['read', 'update'], 'User');
      break;

    case Role.Guest:
      // Guest can only read public resources
      can('read', ['Brand', 'Category', 'Currency', 'PaymentMethod', 'Product', 'Shop']);
      break;

    default:
      // No permissions by default
      break;
  }

  return build();
}
