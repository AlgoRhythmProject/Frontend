import { useEffect, useRef } from 'react';
import type { HubConnection } from '@microsoft/signalr';
import type { Monaco } from '@monaco-editor/react';
import type { editor, IDisposable, Position } from 'monaco-editor';
import type { CompletionItemDto, QuickInfoDto, DiagnosticDto } from "@/types/CodeAnalysis.ts";

export function useMonacoRoslyn(
    monaco: Monaco | null,
    editor: editor.IStandaloneCodeEditor | null,
    connection: HubConnection | null,
    isConnected: boolean
) {
    const disposablesRef = useRef<IDisposable[]>([]);

    const cleanUp = () => {
        for (const d of disposablesRef.current) {
            d.dispose();
        }
        disposablesRef.current = [];
    };

    useEffect(() => {
        if (!monaco || !connection || !isConnected) {
            cleanUp();
            return;
        }

        // 1. Completion Provider
        const completionProvider = monaco.languages.registerCompletionItemProvider('csharp', {
            triggerCharacters: ['.', ' '],
            provideCompletionItems: async (model: editor.ITextModel, position: Position) => {
                try {
                    const completions = await connection.invoke<CompletionItemDto[]>(
                        'GetCompletions',
                        model.getValue(),
                        position.lineNumber - 1,
                        position.column - 1
                    );

                    const word = model.getWordUntilPosition(position);
                    const range = {
                        startLineNumber: position.lineNumber,
                        endLineNumber: position.lineNumber,
                        startColumn: word.startColumn,
                        endColumn: word.endColumn
                    };

                    return {
                        suggestions: completions.map((c: CompletionItemDto) => ({
                            label: c.label,
                            kind: c.kind ?? monaco.languages.CompletionItemKind.Property,
                            insertText: c.insertText ?? c.label,
                            detail: c.detail,
                            documentation: c.documentation ? { value: c.documentation } : undefined,
                            range
                        }))
                    };
                } catch {
                    return { suggestions: [] };
                }
            }
        });

        // 2. Hover Provider
        const hoverProvider = monaco.languages.registerHoverProvider('csharp', {
            provideHover: async (model: editor.ITextModel, position: Position) => {
                try {
                    const info = await connection.invoke<QuickInfoDto | null>(
                        'GetQuickInfo',
                        model.getValue(),
                        position.lineNumber - 1,
                        position.column - 1
                    );
                    if (!info) return null;
                    return {
                        contents: [
                            { value: `**${info.description}**` },
                            { value: info.documentation ?? '' }
                        ]
                    };
                } catch {
                    return null;
                }
            }
        });

        disposablesRef.current.push(completionProvider, hoverProvider);

        return cleanUp;
    }, [monaco, connection, isConnected]);

    // Funkcja do wyzwalania diagnostyki
    const runDiagnostics = async (code: string) => {
        if (!connection || !isConnected || !monaco || !editor) return;

        try {
            const diagnostics = await connection.invoke<DiagnosticDto[]>('AnalyzeCode', code);
            const model = editor.getModel();
            if (!model) return;

            const markers = diagnostics.map((d: DiagnosticDto) => ({
                startLineNumber: d.startLine + 1,
                startColumn: d.startColumn + 1,
                endLineNumber: d.endLine + 1,
                endColumn: d.endColumn + 1,
                message: d.message,
                severity: d.severity === 3 ? monaco.MarkerSeverity.Error : monaco.MarkerSeverity.Warning
            }));

            monaco.editor.setModelMarkers(model, 'roslyn', markers);
        } catch (err: unknown) {
            console.error("LSP Diagnostics error", err);
        }
    };

    return { runDiagnostics };
}