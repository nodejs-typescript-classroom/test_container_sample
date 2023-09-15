import { GenericContainer, StartedTestContainer, TestContainer } from 'testcontainers';
import * as Redis from 'redis';
describe('Redis', () => {
  let container: TestContainer;
  let startedContainer: StartedTestContainer;
  let redisClient: Redis.RedisClientType;
  beforeAll(async() => {
    console.log('start to run')
    container = await new GenericContainer('redis');
    startedContainer = await container.withExposedPorts({ container: 6379, host: 6378 }).start();
    redisClient = Redis.createClient(
      {
        url: `redis://${startedContainer.getHost()}:${startedContainer.getFirstMappedPort()}`
      }
    );
    await redisClient.connect();
  });
  afterAll(async () => {
    await redisClient.disconnect();
    await startedContainer.stop();
  });
  it('works', async () => {
    await redisClient.set('key', 'val');
    expect(await redisClient.get('key')).toBe('val');
  })
});