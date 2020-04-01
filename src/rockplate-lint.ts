import { Linter } from 'rockplate';
import helper, { CodeMirrorType } from './helper';

export const register = (CodeMirror: CodeMirrorType) => {
  CodeMirror.registerHelper('lint', 'rockplate', (text: string, options: any, cm: CodeMirror.Editor) => {
    const found = [];
    const rock = helper.getRockplate(cm);
    const linter = new Linter(text, rock && rock.schema, rock && rock.strict);
    const result = linter.lint(rock ? rock.params : {});
    for (const lint of result.lints) {
      found.push({
        severity: lint.severity,
        from: CodeMirror.Pos(lint.position.begin.line - 1, lint.position.begin.column),
        to: CodeMirror.Pos(lint.position.end.line - 1, lint.position.end.column),
        message: lint.message,
      });
    }
    return found;
  });
};
