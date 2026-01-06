import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import { submissionApi, type SubmissionResponse } from "../api/submissionApi";
import { taskApi } from "../api/taskApi";
import { achievementApi } from "../api/achievementApi";
import type { UserAchievementDto } from "../api/achievementApi";
import { DifficultyColor, DifficultyLabel } from "../utils/difficulty";
import type { Task } from "@/types/Task";
import type { TestResult } from "@/types/TestResult";
import { TaskDescription } from "@/components/Tasks/TaskDetails/TaskDescription";
import { CodeEditorPanel } from "@/components/Tasks/TaskDetails/CodeEditorPanel";
import { useAchievementNotification } from "@/components/AchievementNotification";
import { checkAndShowNewAchievements } from "@/utils/achievementUtils";

export function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showAchievement } = useAchievementNotification();

  const fromCourse = location.state?.fromCourse;
  const courseId = location.state?.courseId;

  // Task loading state
  const [task, setTask] = useState<Task | null>(null);
  const [isLoadingTask, setIsLoadingTask] = useState(true);
  const [taskError, setTaskError] = useState<string | null>(null);

  // Code editor state
  const [code, setCode] = useState("");
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [runStatus, setRunStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Achievements state
  const [achievements, setAchievements] = useState<UserAchievementDto[]>([]);

  // Fetch task from API
  useEffect(() => {
    const fetchTask = async () => {
      console.log("🔍 TaskDetail useEffect - ID from URL:", id);

      if (!id) {
        console.error("❌ No ID provided");
        setIsLoadingTask(false);
        setTaskError("No task ID provided");
        return;
      }

      try {
        console.log("📡 Fetching task with ID:", id);
        setIsLoadingTask(true);
        setTaskError(null);
        const data = await taskApi.getById(id);
        console.log("✅ Task fetched successfully:", data);
        setTask(data);
        setCode(data.templateCode || "// Write your solution here\n");
      } catch (err: any) {
        console.error("❌ Failed to fetch task:", err);
        console.error("Error details:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });
        setTaskError(err.response?.data?.message || "Failed to load task");
      } finally {
        setIsLoadingTask(false);
      }
    };

    fetchTask();
  }, [id]);

  // Load achievements on mount
  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const data = await achievementApi.getMyAchievements();
        setAchievements(data);
      } catch (error) {
        console.error('Error loading achievements:', error);
      }
    };
    loadAchievements();
  }, []);

  const handleBack = () => {
    if (fromCourse && courseId) {
      navigate(`/courses/${courseId}`);
    } else {
      navigate('/tasks');
    }
  };

  const handleReset = () => {
    if (task) {
      setCode(task.templateCode ?? "");
      setTestResults(null);
      setRunStatus(null);
      setErrorMsg(null);
    }
  };

  const handleRunCode = async () => {
    if (!task?.id) return;

    setIsRunning(true);
    setRunStatus(null);
    setErrorMsg(null);
    setTestResults(null);

    try {
      // 1) Submit code to backend
      const submission = await submissionApi.submit(task.id, code);

      // 2) If backend returned error immediately
      if (submission.status === "Error") {
        setRunStatus("Error");
        setErrorMsg(submission.errorMessage || "Unknown error occurred");
        setIsRunning(false);
        return;
      }

      // 3) If status is Pending, poll for results
      const submissionId = submission.submissionId;
      let finalResult: SubmissionResponse | null = null;

      for (let i = 0; i < 15; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        finalResult = await submissionApi.getResult(submissionId);

        if (finalResult.status !== "Pending") {
          break;
        }
      }

      if (!finalResult) {
        setErrorMsg("Failed to retrieve submission results");
        setIsRunning(false);
        return;
      }

      // 4) Display results
      setRunStatus(finalResult.status);

      if (finalResult.errorMessage) {
        setErrorMsg(finalResult.errorMessage);
      }

      if (finalResult.testResults && finalResult.testResults.length > 0) {
        setTestResults(finalResult.testResults);
      }

      // 5) Jeśli zadanie zostało rozwiązane, sprawdź achievementy
      if (finalResult.status === "Accepted" && finalResult.isSolved) {
        console.log("🎉 Task solved! Checking for new achievements...");

        const updatedAchievements = await checkAndShowNewAchievements(
          achievements,
          achievementApi.getMyAchievements,
          showAchievement
        );
        setAchievements(updatedAchievements);
      }

    } catch (err: any) {
      // Handle network and validation errors
      if (err.response) {
        const status = err.response.status;

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
            {taskError || "Task not found"}
          </p>
          <button
            onClick={handleBack}
            className="bg-primary text-foreground px-6 py-2 rounded-lg hover:bg-primary-hover transition-colors cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* HEADER */}
      <div className="bg-background border-b border-muted px-6 py-4 flex items-center gap-4">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-card-hover rounded-lg transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1">
          <p className="font-['Plus_Jakarta_Sans:Regular',sans-serif] text-primary text-xs mb-1">
            {fromCourse ? 'From Course' : 'Task'} • {task.id}
          </p>
          <p className="font-mono font-medium text-foreground">{task.title}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${DifficultyColor[task.difficulty]}`} />
          <span className="font-sans text-foreground">{DifficultyLabel[task.difficulty]}</span>
        </div>
      </div>

      {/* LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        <TaskDescription task={task} />

        <CodeEditorPanel
          taskId={task.id}
          code={code}
          onCodeChange={setCode}
          onReset={handleReset}
          onRunCode={handleRunCode}
          isRunning={isRunning}
          testResults={testResults}
          runStatus={runStatus}
          errorMsg={errorMsg}
        />
      </div>
    </div>
  );
}