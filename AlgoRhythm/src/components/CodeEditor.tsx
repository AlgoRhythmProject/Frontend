import { Editor, type Monaco, type OnMount } from '@monaco-editor/react';
import { useEffect, useState } from "react";
import { useMonacoRoslyn } from "@/hooks/useMonacoRoslynEditor.ts";
import { useRoslynLanguageServer } from "@/hooks/useRoslynLanguageServer.ts";
import type { editor } from 'monaco-editor';
import type { ExecutionError } from "@/types/CodeAnalysis.ts";
import { useTheme } from '@/hooks/themeContext';

interface CodeEditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
    language?: string;
    height?: string;
    errors?: ExecutionError[]
}

export function CodeEditor({ value, onChange, language = 'csharp', height = '100%', errors = [] }: Readonly<CodeEditorProps>) {
    const [monaco, setMonaco] = useState<Monaco | null>(null);
    const [editorInstance, setEditorInstance] = useState<editor.IStandaloneCodeEditor | null>(null);

    const { isConnected, connection } = useRoslynLanguageServer();
    const { runDiagnostics } = useMonacoRoslyn(monaco, editorInstance, connection, isConnected);

    const handleEditorDidMount: OnMount = (editor, monacoInstance) => {
        setEditorInstance(editor);
        setMonaco(monacoInstance);
    };

    useEffect(() => {
        const timer = setTimeout(() => runDiagnostics(value), 600);
        return () => clearTimeout(timer);
    }, [value, runDiagnostics]);

    useEffect(() => {
        if (!monaco || !editorInstance) return;
        const model = editorInstance.getModel();
        if (!model) return;

        const markers = errors.map(err => ({
            startLineNumber: err.startLine,
            startColumn: 1,
            endLineNumber: err.endLine,
            endColumn: 100,
            message: err.errorMessage || 'Runtime Error',
            severity: monaco.MarkerSeverity.Error,
        }));

        monaco.editor.setModelMarkers(model, "judge", markers);
    }, [errors, monaco, editorInstance]);

    const { isDark } = useTheme();

    return (
        <Editor
            height={height}
            defaultLanguage={language}
            value={value}
            onChange={onChange}
            theme={isDark ? 'vs-dark' : 'vs-light'}
            onMount={handleEditorDidMount}
            options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                automaticLayout: true,
                tabSize: 4,
                scrollBeyondLastLine: false,

                quickSuggestions: {
                    other: true,
                    comments: false,
                    strings: false
                },
                suggest: {
                    localityBonus: false,
                    snippetsPreventQuickSuggestions: false,
                    shareSuggestSelections: false,
                    selectionMode: "always",
                    filterGraceful: false
                },
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnCommitCharacter: true,
                acceptSuggestionOnEnter: 'on',
                wordBasedSuggestions: 'off',

                parameterHints: {
                    enabled: true,
                    cycle: true
                },

                folding: true,
                foldingStrategy: 'indentation',
                showFoldingControls: 'mouseover',
                renderLineHighlight: 'all',
                renderWhitespace: 'selection',
            }}
        />
    );
}
