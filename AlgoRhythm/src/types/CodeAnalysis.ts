export interface CompletionItemDto {
    label: string;
    kind: number;
    insertText: string;
    detail: string;
    documentation: string;
    sortText?: string;
}

export interface QuickInfoDto {
    description: string;
    documentation: string;
    spanStart: number;
    spanLength: number;
}

export interface DiagnosticDto {
    message: string;
    severity: number;
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
}

export interface ExecutionError {
    startLine: number;
    endLine: number;
    startColumn: number;
    endColumn: number;
    errorMessage: string
}

export interface ParameterDto {
    label: string;
    documentation: string;
}