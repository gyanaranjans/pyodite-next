import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { usePython } from 'react-py';
import { okaidia } from '@uiw/codemirror-theme-okaidia';

export default function Codeblock() {
  const [input, setInput] = React.useState('');
  const { runPython, stdout, stderr, isLoading, isRunning } = usePython();

  const onChange = React.useCallback((val, viewUpdate) => {
    setInput(val);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {isLoading ? <p>Loading...</p> : ''}
      <form>
        <CodeMirror
          value={input}
          height="400px"
          theme={okaidia}
          extensions={[python({ jsx: true })]}
          onChange={onChange}
        />
        <input
          type="submit"
          value={!isRunning ? 'Run' : 'Running...'}
          disabled={isLoading || isRunning}
          onClick={(e) => {
            e.preventDefault();
            runPython(input);
          }}
          className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        />
      </form>
      <p className="mt-4 text-lg font-bold">Output</p>
      <pre className="p-4 bg-white rounded mt-2">
        <code>{stdout}</code>
      </pre>
      <p className="mt-4 text-lg font-bold">Error</p>
      <pre className="p-4 bg-white rounded mt-2">
        <code>{stderr}</code>
      </pre>
    </div>
  );
}