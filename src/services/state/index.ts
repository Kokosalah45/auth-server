import getRedisInstance from "@/config/redis";

type StateData = {
  code_challenge: string;
  code_challenge_method: string;
  redirect_uri_callback: string;
  isOTPVerified?: boolean;
  email?: string;
};

export default class StateManagerService {
  static stateTimeout = 120;

  static async addState(state: string, stateData: StateData) {
    const redis = await getRedisInstance();

    redis.set(`state:${state}`, JSON.stringify(stateData), {
      EX: this.stateTimeout,
    });
  }

  static isExist = async (state: string) => {
    const redis = await getRedisInstance();
    const stateData = await redis.get(`state:${state}`);
    return !!stateData;
  };

  static async getState(state: string) {
    const redis = await getRedisInstance();
    const stateData = await redis.get(`state:${state}`);
    if (!stateData) return null;
    return JSON.parse(stateData) as StateData;
  }

  static async deleteState(state: string) {
    const redis = await getRedisInstance();
    redis.del(`state:${state}`);
  }
}
