import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Play, RotateCcw, Check, X, Loader2 } from "lucide-react";
import { CodeEditor } from "../components/CodeEditor";
import {type ExecutionError, submissionApi, type SubmissionResponse, type TestResult} from "../api/submissionApi";
import type { Task } from "@/types/Task";
import { taskApi } from "@/api/taskApi";

export function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoadingTask, setIsLoadingTask] = useState(true);
  const [taskError, setTaskError] = useState<string | null>(null);

  const [code, setCode] = useState(task?.starterCode || "");
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [runStatus, setRunStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [executionErrors, setExecutionErrors] = useState<ExecutionError[]>([]);

  // Pobierz task z API
  useEffect(() => {
    const fetchTask = async () => {
      console.log('🔍 TaskDetail useEffect - ID from URL:', id);

      if (!id) {
        console.error('❌ No ID provided');
        setIsLoadingTask(false);
        setTaskError('No task ID provided');
        return;
      }

      try {
        console.log('📡 Fetching task with ID:', id);
        setIsLoadingTask(true);
        setTaskError(null);
        const data = await taskApi.getById(id);
        console.log('✅ Task fetched successfully:', data);
        setTask(data);
        // Fallback dla starterCode jeśli backend nie zwraca
        setCode(data.starterCode || '// Write your solution here\n');
      } catch (err: any) {
        console.error('❌ Failed to fetch task:', err);
        console.error('Error details:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });
        setTaskError(err.response?.data?.message || 'Failed to load task');
      } finally {
        setIsLoadingTask(false);
      }
    };

    fetchTask();
  }, [id]);

  // Loading state
  if (isLoadingTask) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground font-sans">Loading task...</p>
        </div>
      </div>
    );
  }

  // Error or not found state
  if (taskError || !task) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground text-2xl mb-4">
            {taskError || 'Task not found'}
          </p>
          <button
            onClick={() => navigate("/tasks")}
            className="bg-primary text-foreground px-6 py-2 rounded-lg hover:bg-[#7952e5] transition-colors cursor-pointer"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  const handleReset = () => setShowResetConfirm(true);
  const confirmReset = () => {
    setCode(task.starterCode);
    setTestResults(null);
    setRunStatus(null);
    setErrorMsg(null);
    setShowResetConfirm(false);
  };
  const cancelReset = () => setShowResetConfirm(false);

  const handleRunCode = async () => {
    if (!task?.id) return;

    setIsRunning(true);
    setRunStatus(null);
    setErrorMsg(null);
    setTestResults(null);
    setExecutionErrors([]);

    try {
      // 1) Wyślij kod do backendu - używamy task.id z API
      const submission = await submissionApi.submit(task.id, code);

      // 2) Jeśli backend od razu zwrócił błąd
      if (submission.status === "Error") {
        setRunStatus("Error");
        setErrorMsg(submission.errorMessage || "Unknown error occurred");
        setIsRunning(false);
        return;
      }

      // 3) Jeśli status to Pending, polluj wyniki
      const submissionId = submission.submissionId;
      let finalResult: SubmissionResponse | null = null;

      for (let i = 0; i < 15; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        finalResult = await submissionApi.getResult(submissionId);

        // Przerwij polling gdy status nie jest już Pending
        if (finalResult.status !== "Pending") {
          break;
        }
      }

      if (!finalResult) {
        setErrorMsg("Failed to retrieve submission results");
        setIsRunning(false);
        return;
      }

      // 4) Wyświetl wyniki
      setRunStatus(finalResult.status);

      if (finalResult.errorMessage) {
        setErrorMsg(finalResult.errorMessage);
      }

      if (finalResult.testResults && finalResult.testResults.length > 0) {
        setTestResults(finalResult.testResults);
      }
      const allErrors: ExecutionError[] = [];
      finalResult.testResults.forEach(test => {
        if (test.errors) {
          allErrors.push(...test.errors);
        }
      });

      // Ustawiamy błędy w edytorze
      setExecutionErrors(allErrors);


    } catch (err: any) {
      // Obsługa błędów sieciowych i walidacji
      if (err.response) {
        const status = err.response.status;

        // Błędy walidacji (400)
        if (status === 400 && err.response.data?.errors) {
          const validation = err.response.data.errors;
          const errorMessages = Object.entries(validation)
            .map(([field, messages]) => `${field}: ${messages}`)
            .join("\n");
          setErrorMsg("Validation error:\n" + errorMessages);
        } else if (err.response.data?.errorMessage) {
          setErrorMsg(err.response.data.errorMessage);
        } else {
          setErrorMsg(`API error (${status}): ${err.response.statusText}`);
        }
      } else {
        setErrorMsg("Network error - please check your connection");
      }
    } finally {
      setIsRunning(false);
    }
  };

  const difficultyColor = {
    Easy: "bg-success",
    Medium: "bg-warning",
    Hard: "bg-error",
  }[task.difficulty];

  return (
    <div className="h-screen flex flex-col">
      {showResetConfirm && (
        <div
          className="fixed inset-0 z-40 cursor-pointer"
          onClick={cancelReset}
          onKeyDown={(e) => e.key === "Escape" && cancelReset()}
          role="button"
          tabIndex={0}
          aria-label="Close confirmation dialog"
        />
      )}

      {/* HEADER */}
      <div className="bg-background border-b border-muted px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/tasks")}
          className="p-2 hover:bg-card-hover rounded-lg transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1">
          <p className="font-['Plus_Jakarta_Sans:Regular',sans-serif] text-primary text-xs mb-1">
            {task.id}
          </p>
          <p className="font-mono font-medium text-foreground">{task.title}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${difficultyColor}`} />
          <span className="font-sans text-foreground">{task.difficulty}</span>
        </div>
      </div>

      {/* LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT — TASK DESCRIPTION */}
        <div className="w-full lg:w-1/2 overflow-y-auto bg-[#0d0d0d] p-6">
          <div className="max-w-2xl">
            <h2 className="font-sans font-medium text-foreground text-2xl mb-4">
              Description
            </h2>
            <p className="font-sans text-[#d1d1d1] mb-6 whitespace-pre-wrap">
              {task.description}
            </p>

            {task.examples && task.examples.length > 0 && (
              <>
                <h3 className="font-sans font-medium text-foreground text-xl mb-3">
                  Examples
                </h3>
                <div className="space-y-4 mb-6">
                  {task.examples.map((example, idx) => (
                    <div key={idx} className="bg-background border border-muted rounded-lg p-4">
                      <p className="font-mono text-success mb-2">
                        Input: {example.input}
                      </p>
                      <p className="font-mono text-warning mb-2">
                        Output: {example.output}
                      </p>
                      {example.explanation && (
                        <p className="font-sans text-muted-foreground text-sm">
                          {example.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {task.constraints && task.constraints.length > 0 && (
              <>
                <h3 className="font-sans font-medium text-foreground text-xl mb-3">
                  Constraints
                </h3>
                <ul className="list-disc list-inside space-y-1 mb-6">
                  {task.constraints.map((constraint, idx) => (
                    <li key={idx} className="font-sans text-muted-foreground">
                      {constraint}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-sans font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — EDITOR + RESULTS */}
        <div className="hidden lg:flex lg:w-1/2 flex-col bg-background border-l border-muted">
          {/* Editor Header */}
          <div className="border-b border-muted px-6 py-3 flex items-center justify-between">
            <p className="font-sans font-medium text-foreground">Code Editor</p>
            <div className="flex gap-2 relative">
              <div className="relative">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 bg-card-hover hover:bg-[#3a3a3a] text-foreground rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>

                {showResetConfirm && (
                  <div className="absolute top-full mt-2 right-0 bg-background border border-muted rounded-lg shadow-xl p-4 w-72 z-50">
                    <p className="font-sans text-foreground text-sm mb-3">
                      Are you sure? All progress will be lost.
                    </p>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={cancelReset}
                        className="px-3 py-1.5 text-sm bg-card-hover hover:bg-[#3a3a3a] text-foreground rounded transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmReset}
                        className="px-3 py-1.5 text-sm bg-primary hover:bg-[#7952e5] text-foreground rounded transition-colors cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-[#7952e5] text-foreground rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Play className="w-4 h-4" />
                {isRunning ? "Running..." : "Run Code"}
              </button>
            </div>
          </div>

          {/* Code Editor Area */}
          <div className="flex-1">
            <CodeEditor
              value={code}
              onChange={(value) => setCode(value || "")}
              language="csharp"
              errors={executionErrors}
            />
          </div>

          {/* Error Display */}
          {errorMsg && (
            <div className="border-t border-error p-6 bg-error/10 max-h-64 overflow-auto">
              <h3 className="font-sans font-medium text-error mb-2">Error</h3>
              <pre className="whitespace-pre-wrap text-error text-sm">{errorMsg}</pre>
            </div>
          )}

          {/* Test Results */}
          {testResults && testResults.length > 0 && !errorMsg && (
            <div className="border-t border-muted p-6 bg-[#0d0d0d] max-h-64 overflow-auto">
              <h3 className="font-sans font-medium text-foreground mb-4">
                Results ({runStatus})
              </h3>
              <div className="space-y-2">
                {testResults.map((r, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-lg ${r.passed
                      ? "bg-success/10 border border-success/30"
                      : "bg-error/10 border border-error/30"
                      }`}
                  >
                    {r.passed ? (
                      <Check className="w-5 h-5 text-success" />
                    ) : (
                      <X className="w-5 h-5 text-error" />
                    )}
                    <div className="flex flex-col flex-1">
                      <p className="font-sans text-sm text-foreground">
                        Test {idx + 1} • {r.executionTimeMs.toFixed(2)}ms
                      </p>
                      <p
                        className={`font-sans text-sm ${r.passed ? "text-success" : "text-error"
                          }`}
                      >
                        {r.passed ? "Passed" : "Failed"} • {r.points} points
                      </p>
                      {r.stdErr && (
                        <p className="font-mono text-error text-xs mt-1">
                          Error: {r.stdErr}
                        </p>
                      )}
                      {r.stdOut && (
                        <p className="font-mono text-success text-xs mt-1">
                          Output: {r.stdOut}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}