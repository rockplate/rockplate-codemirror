import CodeMirror, { Editor as CodeMirrorEditor } from 'codemirror';

export type CodeMirrorType = typeof CodeMirror;

class Helper {
  private cmInstances: CodeMirrorEditor[] = [];
  private rockplates: {
    cm: CodeMirrorEditor;
    schema: any;
    params: any;
    strict?: boolean;
  }[] = [];
  setRockplate(cm: CodeMirrorEditor, schema: any, params: any, strict?: boolean, forceUpdate?: boolean) {
    const rock = {
      cm,
      schema,
      params,
      strict,
    };
    const idx = this.cmInstances.indexOf(cm);
    let initial = true;
    if (idx !== -1) {
      this.rockplates[idx] = rock;
      initial = false;
    } else {
      this.cmInstances.push(cm);
      this.rockplates.push(rock);
    }
    if (initial || forceUpdate) {
      this.updateRockplate(rock);
    }
  }
  getRockplate(cm: CodeMirrorEditor) {
    const idx = this.cmInstances.indexOf(cm);
    if (idx === -1) {
      return;
    }
    return this.rockplates[idx];
  }
  private updateRockplate(rock: { cm: CodeMirrorEditor; schema: any; params: any; strict?: boolean }) {
    const value = rock.cm.getValue();
    const doc = rock.cm.getDoc();
    const lastLine = doc.lastLine();
    const lastChar = doc.getLine(doc.lastLine()).length;
    doc.replaceRange(
      value || '',
      {
        line: 0,
        ch: 0,
      },
      {
        line: lastLine,
        ch: lastChar,
      },
    );
    rock.cm.setValue(value);
    // doc.clearHistory();
    // rock.cm.clearHistory();
  }
}

export default new Helper();
