import getRedisInstance from "../../config/redis";

type StateData = {
  code_challenge: string;
  code_challenge_method: string;
  redirect_uri_callback: string;
};

export default class StateManagerService {
  static stateTimeout = 60000;

  static async addState(state: string, stateData: StateData) {
    const redis = await getRedisInstance();

    redis.set(state, JSON.stringify(stateData), {
      EX: this.stateTimeout / 1000,
    });
  }

  static async getState(state: string) {
    const redis = await getRedisInstance();
    const stateData = await redis.get(state);
    if (!stateData) return null;
    return JSON.parse(stateData);
  }

  static async deleteState(state: string) {
    const redis = await getRedisInstance();
    redis.del(state);
  }
}
