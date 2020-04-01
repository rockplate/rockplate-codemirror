import { Editor as CodeMirrorEditor } from 'codemirror';
import helper, { CodeMirrorType } from './helper';
import { register as registerMode } from './rockplate-mode';
import { register as registerLint } from './rockplate-lint';
import { register as registerFold } from './rockplate-fold';

export const setRockplate = (
  cm: CodeMirrorEditor,
  schema: any,
  params: any,
  strict?: boolean,
  forceUpdate?: boolean,
) => {
  return helper.setRockplate(cm, schema, params, strict, forceUpdate);
};

export const getRockplate = (cm: CodeMirrorEditor) => {
  return helper.getRockplate(cm);
};

export const register = (CodeMirror: CodeMirrorType) => {
  registerMode(CodeMirror);
  registerLint(CodeMirror);
  registerFold(CodeMirror);
};

if (window.CodeMirror) {
  register(window.CodeMirror);
}
