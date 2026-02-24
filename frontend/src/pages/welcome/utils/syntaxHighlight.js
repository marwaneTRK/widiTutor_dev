export function colorLine(line) {
  const tokens = [
    { re: /(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g, cls: "text-[#ce9178]" },
    { re: /(\/\/.*|#.*|\/\*[\s\S]*?\*\/)/g, cls: "text-[#6a9955]" },
    { re: /\b(\d+\.?\d*)\b/g, cls: "text-[#b5cea8]" },
    { re: /\b(import|export|from|const|let|var|function|return|if|else|for|while|class|def|async|await|new|this|self|true|false|null|None|True|False|undefined|type|interface|extends|implements|public|private|static|void|int|str|bool|try|catch|finally|throw|yield|pass|break|continue|lambda|in|is|not|and|or|with|as)\b/g, cls: "text-[#569cd6]" },
    { re: /\b(print|console|log|map|filter|reduce|forEach|push|pop|shift|len|range|list|dict|set|tuple|str|int|float|bool|open|read|write|append|split|join|format|input|output|require|module|process|Math|JSON|Object|Array|Promise|Error)\b/g, cls: "text-[#dcdcaa]" },
    { re: /(@\w+)/g, cls: "text-[#c586c0]" },
    { re: /([=<>!+\-*/%&|^~]+)/g, cls: "text-[#d4d4d4]" },
  ];

  const len = line.length;
  const colors = new Array(len).fill(null);

  for (const { re, cls } of tokens) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(line)) !== null) {
      for (let i = m.index; i < m.index + m[0].length; i++) {
        if (!colors[i]) colors[i] = cls;
      }
    }
  }

  const result = [];
  let i = 0;
  while (i < len) {
    const cls = colors[i];
    let j = i + 1;
    while (j < len && colors[j] === cls) j++;
    const segment = line.slice(i, j);
    result.push({ text: segment, cls });
    i = j;
  }

  return result;
}
