import 'reflect-metadata';
import { AppDataSource } from '@infrastructure/database/connection';
import { Role } from '@infrastructure/database/entities/role.entity';
import { Permission } from '@infrastructure/database/entities/permission.entity';

async function seed() {
  await AppDataSource.initialize();
  console.log('Database initialized');

  const roleRepo = AppDataSource.getRepository(Role);
  const permRepo = AppDataSource.getRepository(Permission);

  // 1. Create Default Permissions
  console.log('Creating permissions...');
  const permissionsData = [
    { action: 'manage', subject: 'all', description: 'Acceso total al sistema' },
    { action: 'read', subject: 'Brand', description: 'Leer marcas' },
    { action: 'read', subject: 'Category', description: 'Leer categorías' },
    { action: 'read', subject: 'Currency', description: 'Leer monedas' },
    { action: 'read', subject: 'PaymentMethod', description: 'Leer métodos de pago' },
    { action: 'read', subject: 'Product', description: 'Leer productos' },
    { action: 'read', subject: 'Shop', description: 'Leer tiendas' },
    { action: 'create', subject: 'Bill', description: 'Crear facturas' },
    { action: 'read', subject: 'Bill', description: 'Leer facturas' },
    { action: 'update', subject: 'Bill', description: 'Editar facturas' },
    { action: 'delete', subject: 'Bill', description: 'Eliminar facturas' },
  ];

  const permissions: Permission[] = [];
  for (const data of permissionsData) {
    let perm = await permRepo.findOneBy({ action: data.action, subject: data.subject });
    if (!perm) {
      perm = permRepo.create(data);
      await permRepo.save(perm);
    }
    permissions.push(perm);
  }

  // 2. Create Roles and Assign Permissions
  console.log('Creating roles...');

  const mergePermissions = (existing: Permission[] | undefined, newPerms: Permission[]) => {
    const allPerms = [...(existing || []), ...newPerms];
    return Array.from(new Map(allPerms.map((p) => [p.id, p])).values());
  };

  // Admin Role
  let adminRole = await roleRepo.findOne({ where: { name: 'admin' }, relations: ['permissions'] });
  if (!adminRole) {
    adminRole = roleRepo.create({ name: 'admin', description: 'Administrador del sistema' });
  }
  adminRole.permissions = mergePermissions(
    adminRole.permissions,
    permissions.filter((p) => p.action === 'manage')
  );
  await roleRepo.save(adminRole);
  console.log('Admin role updated/created with default permissions.');

  // User Role
  let userRole = await roleRepo.findOne({ where: { name: 'user' }, relations: ['permissions'] });
  if (!userRole) {
    userRole = roleRepo.create({ name: 'user', description: 'Usuario estándar' });
  }
  userRole.permissions = mergePermissions(
    userRole.permissions,
    permissions.filter((p) => p.subject !== 'all' && (p.action === 'read' || p.subject === 'Bill'))
  );
  await roleRepo.save(userRole);
  console.log('User role updated/created with default permissions.');

  // Guest Role
  let guestRole = await roleRepo.findOne({ where: { name: 'guest' }, relations: ['permissions'] });
  if (!guestRole) {
    guestRole = roleRepo.create({ name: 'guest', description: 'Invitado con acceso de lectura' });
  }
  guestRole.permissions = mergePermissions(
    guestRole.permissions,
    permissions.filter((p) => p.action === 'read' && p.subject !== 'Bill')
  );
  await roleRepo.save(guestRole);
  console.log('Guest role updated/created with default permissions.');

  console.log('RBAC Seeding completed successfully.');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
