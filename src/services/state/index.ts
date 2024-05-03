type StateData = {
  code_challenge: string;
  code_challenge_method: string;
  redirect_uri_callback: string;
};

export default class State {
  static stateMap: {
    [key: string]: StateData;
  } = {};
  static stateTimeout = 60000;

  static addState(state: string, stateData: StateData) {
    State.stateMap[state] = stateData;
    setTimeout(() => {
      delete State.stateMap[state];
    }, State.stateTimeout);
  }

  static getState(state: string) {
    return State.stateMap[state];
  }

  static deleteState(state: string) {
    delete State.stateMap[state];
  }
}
