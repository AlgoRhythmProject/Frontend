import { BookOpen, Code, TrendingUp, Award, Brain, Zap, Target, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const COURSE_ICON_MAP: Record<string, LucideIcon> = {
    "course-1": BookOpen,
    "course-2": Code,
    "course-3": TrendingUp,
    "course-4": Award,
    "course-5": Brain,
    "course-6": Zap,
    "course-7": Target,
    "course-8": Rocket,
};

// Używamy zmiennych CSS zamiast hardcoded wartości
export const COURSE_COLOR_MAP: Record<string, string> = {
    "course-1": "from-[var(--course-1-from)] to-[var(--course-1-to)]",
    "course-2": "from-[var(--course-2-from)] to-[var(--course-2-to)]",
    "course-3": "from-[var(--course-3-from)] to-[var(--course-3-to)]",
    "course-4": "from-[var(--course-4-from)] to-[var(--course-4-to)]",
    "course-5": "from-[var(--course-5-from)] to-[var(--course-5-to)]",
    "course-6": "from-[var(--course-6-from)] to-[var(--course-6-to)]",
    "course-7": "from-[var(--course-7-from)] to-[var(--course-7-to)]",
    "course-8": "from-[var(--course-8-from)] to-[var(--course-8-to)]",
};

const FALLBACK_GRADIENTS = [
    "from-[var(--fallback-1-from)] to-[var(--fallback-1-to)]",
    "from-[var(--fallback-2-from)] to-[var(--fallback-2-to)]",
    "from-[var(--fallback-3-from)] to-[var(--fallback-3-to)]",
    "from-[var(--fallback-4-from)] to-[var(--fallback-4-to)]",
    "from-[var(--fallback-5-from)] to-[var(--fallback-5-to)]",
    "from-[var(--fallback-6-from)] to-[var(--fallback-6-to)]",
    "from-[var(--fallback-7-from)] to-[var(--fallback-7-to)]",
    "from-[var(--fallback-8-from)] to-[var(--fallback-8-to)]",
];

function getDeterministicGradient(id: string): string {
    let sum = 0;
    for (let i = 0; i < id.length; i++) {
        sum += id.charCodeAt(i);
    }
    return FALLBACK_GRADIENTS[sum % FALLBACK_GRADIENTS.length];
}

export function getCourseIcon(courseId: string): LucideIcon {
    if (COURSE_ICON_MAP[courseId]) {
        return COURSE_ICON_MAP[courseId];
    }
    const prefix = courseId.split("-")[0];
    if (COURSE_ICON_MAP[prefix]) {
        return COURSE_ICON_MAP[prefix];
    }
    return BookOpen;
}

export function getCourseGradient(courseId: string): string {
    if (COURSE_COLOR_MAP[courseId]) {
        return COURSE_COLOR_MAP[courseId];
    }
    return getDeterministicGradient(courseId);
}

export interface CourseVisualConfig {
    icon: LucideIcon;
    gradient: string;
}

export function getCourseVisualConfig(courseId: string): CourseVisualConfig {
    return {
        icon: getCourseIcon(courseId),
        gradient: getCourseGradient(courseId),
    };
}