import { MongoAbility } from '@casl/ability';

// Define all possible actions
export type Action = 'create' | 'read' | 'update' | 'delete' | 'manage';

// Define all possible subjects (entities)
export type Subject =
  | 'Bill'
  | 'Brand'
  | 'Category'
  | 'Currency'
  | 'PaymentMethod'
  | 'Product'
  | 'Shop'
  | 'User'
  | 'all';

// Define the Ability type
export type AppAbility = MongoAbility<[Action, Subject]>;
