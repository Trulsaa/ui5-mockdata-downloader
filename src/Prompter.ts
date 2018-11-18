const readline = require("readline");

interface IPrompter {
  isMuted: boolean;
  query: string;
  ask: (query: string) => Promise<{}>;
  mute: () => IPrompter;
}

const Prompter = () => {
  const state = {
    isMuted: false,
    query: ""
  };

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const mute = state => ({
    mute: () => {
      state.isMuted = true;
      return state;
    }
  });

  const ask = state => ({
    ask: (query: string) => {
      state.query = query;
      if (state.isMuted) writeMuted(state);

      return new Promise((resolve, reject) => {
        rl.question(state.query, answer => {
          if (state.isMuted) {
            resetMuted(state);
            process.stdout.write("\n");
            rl.history = rl.history.slice(1);
          }
          resolve(answer);
        });
      });
    }
  });

  const resetMuted = state => {
    state.isMuted = false;
    rl._writeToOutput = stringToWrite => {
      rl.output.write(stringToWrite);
    };
  };

  const writeMuted = state => {
    rl._writeToOutput = stringToWrite => {
      rl.output.write(
        "\x1B[2K\x1B[200D" +
          state.query +
          "[" +
          (rl.line.length % 2 == 1 ? "=-" : "-=") +
          "]"
      );
    };
  };

  return Object.assign(state, ask(state), mute(state));
};

export default Prompter;
