import 'reflect-metadata';
import { IsNull } from 'typeorm';
import { AppDataSource } from '@infrastructure/database/connection';
import { PaymentMethod } from '@infrastructure/database/entities/payment-method.entity';
import { v7 as uuidv7 } from 'uuid';

async function migrate() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(PaymentMethod);

  // 1. Usamos un límite para no saturar la RAM
  const batchSize = 100;
  let count = 0;

  while (true) {
    // Buscamos de a poco
    const paymentMethods = await repo.find({
      where: { uuid: IsNull() },
      take: batchSize,
    });

    if (paymentMethods.length === 0) break;

    // 2. Procesamos el batch en paralelo para ganar velocidad
    const promises = paymentMethods.map((pm) => {
      const newUuid = uuidv7();
      // UPDATE directo: más rápido que .save()
      return repo
        .update(pm.id, { uuid: newUuid })
        .then(() => console.log(`[OK] ID ${pm.id} -> ${newUuid}`));
    });

    await Promise.all(promises);
    count += paymentMethods.length;
  }

  console.log(`\nMigración finalizada. Total: ${count} registros.`);
  await AppDataSource.destroy();
}

migrate().catch((err) => {
  console.error('Unhandled error during migration:', err);
  process.exit(1);
});
