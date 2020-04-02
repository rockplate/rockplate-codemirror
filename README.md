[![MIT License](https://img.shields.io/github/license/rockplate/rockplate-codemirror)](https://github.com/rockplate/rockplate-codemirror/blob/master/LICENSE)
[![dependencies Status](https://david-dm.org/rockplate/rockplate-codemirror/status.svg)](https://david-dm.org/rockplate/rockplate-codemirror)
[![devDependencies Status](https://david-dm.org/rockplate/rockplate-codemirror/dev-status.svg)](https://david-dm.org/rockplate/rockplate-codemirror?type=dev)
[![HitCount](https://hits.dwyl.com/rockplate/rockplate-codemirror.svg)](https://hits.dwyl.com/rockplate/rockplate-codemirror)

# Rockplate CodeMirror

CodeMirror implementation for Rockplate language

## [Live Demo](https://rockplate.github.io/rockplate-codemirror/)

## Usage

`npm install rockplate-codemirror`

```javascript
import CodeMirror from 'codemirror';
import { register } from 'rockplate-codemirror';

register(CodeMirror);
```

Usage with `<script>` tag:

```html
<script src="https://cdn.jsdelivr.net/npm/rockplate-codemirror@latest/dist/rockplate-codemirror.min.js"></script>
```

Registered automatically
