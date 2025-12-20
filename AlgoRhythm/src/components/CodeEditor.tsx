import { useTheme } from '@/hooks/useTheme';
import { Editor } from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
  height?: string;
}

export function CodeEditor({ value, onChange, language = 'csharp', height = '100%' }: CodeEditorProps) {
  const { isDark } = useTheme();
  return (
    <Editor
      key={isDark ? 'dark' : 'light'}
      height={height}
      defaultLanguage={language}
      value={value}
      onChange={onChange}
      theme={isDark ? 'vs-dark' : 'vs-light'}
      options={{
        minimap: { enabled: true },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
        padding: { top: 16, bottom: 16 },
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
        acceptSuggestionOnEnter: 'on',
        snippetSuggestions: 'inline',
        folding: true,
        bracketPairColorization: {
          enabled: true,
        },
        formatOnPaste: true,
        formatOnType: true,
      }}
    />
  );
}