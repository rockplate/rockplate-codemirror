import { CodeMirrorType } from './helper';

interface State {
  incomment: boolean;
  intag: boolean;
  operator: boolean;
  sign: boolean;
  instring: boolean;
}

export const register = (CodeMirror: CodeMirrorType) => {
  CodeMirror.defineMode('rockplate:inner', () => {
    const numbers = /^(\d[+\-\*\/])?\d+(\.\d+)?/;

    const keywords = new RegExp('((' + ['end if', 'end repeat', 'if ', 'repeat ', 'else'].join(')|(') + '))\\b');
    const operators = new RegExp('((' + [' are not ', ' are ', ' is not ', ' is '].join(')|(') + '))\\b');

    function tokenBase(stream: CodeMirror.StringStream, state: State) {
      const ch = stream.peek();

      // Comment
      if (state.incomment) {
        if (stream.skipTo('--]')) {
          stream.eatWhile('-');
          stream.eat(']');
          state.incomment = false; // Clear flag
        } else {
          stream.skipToEnd();
        }
        return 'comment';
        // Tag
      } else if (state.intag) {
        // After operator
        if (state.operator) {
          state.operator = false;
          if (stream.match(operators)) {
            return 'atom';
          }
          if (stream.match(numbers)) {
            return 'number';
          }
        }
        // After sign
        if (state.sign) {
          state.sign = false;
          if (stream.match(operators)) {
            return 'atom';
          }
          if (stream.match(numbers)) {
            return 'number';
          }
        }

        if (state.instring) {
          stream.next();
          return 'string';
        } else if (stream.match(']')) {
          stream.eatWhile(']');
          state.intag = false;
          return 'tag';
        } else {
          if (true || stream.eat(' ') || stream.sol()) {
            if (stream.match(operators)) {
              return 'atom';
            }
            if (stream.match(keywords)) {
              return 'keyword';
            }
            if (stream.sol()) {
              stream.next();
            }
            stream.next();
          } else {
            stream.next();
          }
        }
        return 'variable-2';
      } else if (stream.eat('[')) {
        if (stream.match('--')) {
          stream.eatWhile('-');
          state.incomment = true;
          return 'comment';
        } else {
          state.intag = true;
          return 'tag';
        }
      }
      stream.next();
    }
    return {
      startState() {
        return {};
      },
      token(stream, state) {
        return tokenBase(stream, state) as string;
      },
    };
  });

  CodeMirror.defineMode('rockplate', (config, parserConfig) => {
    const rockplateInner = CodeMirror.getMode(config, 'rockplate:inner');
    // return CodeMirror.overlayMode(CodeMirror.getMode(config, parserConfig.backdrop || "text/html"), rockplateInner); // breaks code folding!
    // if (!parserConfig || !parserConfig.base) return rockplateInner;
    // return (CodeMirror as any).multiplexingMode(CodeMirror.getMode(config, parserConfig.base), {
    //   open: /\[/,
    //   close: /\]/,
    //   mode: rockplateInner,
    //   parseDelimiters: true,
    // });
    return rockplateInner;
  });
  CodeMirror.defineMIME('text/x-rockplate', 'rockplate');
};
