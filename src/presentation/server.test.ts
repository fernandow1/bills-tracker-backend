import { Server } from './server';
import { Router } from 'express';

describe('Server', () => {
  let server: Server;
  const mockPort = 3000;
  const mockRoutes = Router();

  beforeEach(() => {
    server = new Server({
      port: mockPort,
      routes: mockRoutes,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should start and stop the server gracefully using listener.close()', async () => {
    // Creamos un mock de la función close() devuelta por listen()
    const mockClose = jest.fn((cb) => {
      if (cb) cb(); // Ejecutar el callback exitosamente sin error
    });

    // Sobrescribimos el app.listen original con nuestro Mock para interceptarlo
    const mockListen = jest.fn().mockImplementation((port, hostOrCb, cb) => {
      const callback = typeof hostOrCb === 'function' ? hostOrCb : cb;
      if (callback) callback();
      return { close: mockClose }; // Devolvemos nuestro falso listener
    });

    // Inyectarlo en la instancia de express de nuestro Server
    server.app.listen = mockListen as any;

    // Procedemos a probar el método start()
    await server.start();
    expect(mockListen).toHaveBeenCalledWith(mockPort, '::', expect.any(Function));

    // Procedemos a probar el método stop()
    await server.stop();

    // Validamos que el Graceful Shutdown haya llamado al método close() de node http.Server
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('stop() should resolve immediately if server listener was never initialized', async () => {
    // Ejecutamos stop() sin haber corrido start()
    // Esto debería pasar tranquilamente (resolviendo la Promise y sin explotar)
    await expect(server.stop()).resolves.toBeUndefined();
  });
});
