import { CodeMirrorType } from './helper';
import { Builder, IfBlock, RepeatBlock, CommentBlock } from 'rockplate';

const getLines = (text: string) => {
  return text
    .split('\r\n')
    .join('\r')
    .split('\n')
    .join('\r')
    .split('\r');
};

const getPosition = (text: string, offset: number) => {
  const lines = getLines(text.substr(0, offset + 1));
  const line = lines.length;
  const column = lines[lines.length - 1].length - 1;
  return { line, column: column === -1 ? 0 : column };
};

export const register = (CodeMirror: CodeMirrorType) => {
  CodeMirror.registerHelper('fold', 'rockplate', (cm: CodeMirror.Editor, start: CodeMirror.Position) => {
    type BlockType = 'comment' | 'if' | 'repeat' | false;

    function getBlockType(lineText: string): BlockType {
      const match = lineText && lineText.match(/^.*?\[(\-\-|if|repeat)/);
      if (match) {
        const result = match[1] === '--' ? 'comment' : match[1];
        return result as BlockType;
      }
      return false;
    }
    const firstLineText = cm.getLine(start.line);
    const blockType = getBlockType(firstLineText);
    if (!blockType) {
      return undefined;
    }
    const prefix = { comment: '[--', if: '[if ', repeat: '[repeat ' }[blockType];
    const text = cm.getValue();
    const lines = getLines(text);
    const line = lines[start.line];
    if (!line) {
      return undefined;
    }
    const linesBefore = lines.slice(0, start.line);
    const chars = firstLineText.indexOf(prefix) + 1;
    const offset = linesBefore.join('\n').length + chars + 2; // within [xx...
    const builder = new Builder(text);
    const block = builder.getBlockAt(offset);
    if (!(block instanceof CommentBlock || block instanceof IfBlock || block instanceof RepeatBlock)) {
      return undefined;
    }
    const offsetEnd = block.offsetEnd - block.expressionEnd.length;
    const positionEnd = getPosition(text, offsetEnd);
    const lineEnd = positionEnd.line - 1;
    const endLineText = cm.getLine(lineEnd) || '';

    if (lineEnd - start.line < 1) {
      return undefined;
    }

    const beginColumn = firstLineText.indexOf(block.expression) + block.expression.length;
    const endColumn = positionEnd.column;

    return {
      from: CodeMirror.Pos(start.line, beginColumn),
      to: CodeMirror.Pos(lineEnd, endColumn),
    };
  });
};
