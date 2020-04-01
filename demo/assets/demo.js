'use strict';

var setRockplate = window['rockplate-codemirror'].setRockplate;

var demoSection = function(prefix, template, schema, params, strict) {
  var templateEl = document.getElementById(prefix + 'template');
  var resultEl = document.getElementById(prefix + 'result');
  var schemaEl = document.getElementById(prefix + 'schema');
  var paramsEl = document.getElementById(prefix + 'params');
  var strictToggleEl = document.getElementById(prefix + 'strict-toggle');

  strictToggleEl.checked = strict;

  var schemaEditor = CodeMirror(schemaEl, {
    value: JSON.stringify(schema, null, 2),
    theme: 'dracula',
    mode: { name: 'javascript', json: true },
    lineNumbers: true,
    lineWrapping: true,
    extraKeys: {
      'Ctrl-Q': function(cm) {
        cm.foldCode(cm.getCursor());
      },
    },
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    lint: true,
  });

  var paramsEditor = CodeMirror(paramsEl, {
    value: JSON.stringify(params, null, 2),
    theme: 'dracula',
    mode: { name: 'javascript', json: true },
    lineNumbers: true,
    lineWrapping: true,
    extraKeys: {
      'Ctrl-Q': function(cm) {
        cm.foldCode(cm.getCursor());
      },
    },
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    lint: true,
  });

  var templateEditor = CodeMirror(templateEl, {
    value: template,
    theme: 'dracula',
    mode: 'rockplate',
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    lint: true,
  });

  var updateEditor = function(forceUpdate) {
    setRockplate(templateEditor, schema, params, strict, forceUpdate);
  };

  var updateResult = function(forceUpdate) {
    var rockplate = new window.rockplate.Rockplate(template.replace(/\<script/g, '&lt;script'), schema, strict);
    var result = rockplate.parse(params);
    resultEl.innerHTML = result;
    updateEditor(forceUpdate);
    return result;
  };

  updateResult(true);

  schemaEditor.on('change', function(instance, changeObj) {
    onSchemaChange(schemaEditor.getValue());
  });

  paramsEditor.on('change', function(instance, changeObj) {
    onParamsChange(paramsEditor.getValue());
  });

  templateEditor.on('change', function(instance, changeObj) {
    onTemplateChange(templateEditor.getValue());
  });

  strictToggleEl.onchange = function() {
    strict = strictToggleEl.checked;
    updateResult(true);
  };

  var onTemplateChange = function(value) {
    template = value;
    updateResult();
  };

  var onSchemaChange = function(value) {
    try {
      var newSchema = JSON.parse(value);
      if (newSchema) {
        schema = newSchema;
        updateResult(true);
      }
    } catch (e) {}
  };

  var onParamsChange = function(value) {
    try {
      var newParams = JSON.parse(value);
      if (newParams) {
        params = newParams;
        updateResult(true);
      }
    } catch (e) {}
  };
};

var demoStrict = true;

var demoTemplate = `Dear [customer name],<br><br>

Thank you for your order. Your items will be shipped soon<br><br>

[--
this is a comment
that should be removed
--]

[something wrong] [customer age]<br><br>

<ul>
[repeat items]
<li>
  [item name]: [item price]

  [if discount is available] [-- this is a comment too --]
      (Discount: [discount value])
  [else]
      (No Discount)
  [end if]
</li>
[end repeat]
</ul>

<br><hr>

Total: [order total] [if order is paid](paid)[end if]<br><br>

Thanks<br>
[brand name]
`;

var demoSchema = {
  brand: {
    name: 'My Brand',
  },
  customer: {
    name: 'Customer Name',
  },
  items: [
    {
      item: {
        name: 'Item 1',
        price: '$100',
      },
      discount: {
        available: true,
        value: '5%',
      },
    },
  ],
  order: {
    total: '$185',
  },
};

var demoParams = {};

for (var key in demoSchema) {
  // if (key === 'items') {
  //   continue;
  // }
  demoParams[key] = {};
  for (var subkey in demoSchema[key]) {
    demoParams[key][subkey] = demoSchema[key][subkey];
  }
}
demoParams.customer.name = 'John';
demoParams.brand.name = 'Zetmel';
demoParams.order.paid = true;
demoParams.items = [
  {
    item: {
      name: 'Item 1',
      price: '$100',
    },
    discount: {
      available: true,
      value: '5%',
    },
  },
  {
    item: {
      name: 'Item 2',
      price: '$85',
    },
    discount: {
      available: false,
      value: 0,
    },
  },
];

demoSection('demo-', demoTemplate, demoSchema, demoParams, demoStrict);
