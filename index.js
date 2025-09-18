import setupServer from './src/server.js';

const bootstrap = async () => {
  try {
    await setupServer();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

bootstrap();
