import { BookOpen, Code, List, Award, Brain, Zap, Target, Rocket, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const COURSE_ICON_MAP: Record<string, LucideIcon> = {
    "C# Programming Fundamentals": Code,
    "Data Structures Essentials": List,
    "Advanced Algorithms": Workflow,
};

export const COURSE_COLOR_MAP: Record<string, string> = {
    "C# Programming Fundamentals": "from-[var(--course-1-from)] to-[var(--course-1-to)]",
    "Data Structures Essentials": "from-[var(--course-2-from)] to-[var(--course-2-to)]",
    "Advanced Algorithms": "from-[var(--course-3-from)] to-[var(--course-3-to)]",
};

const FALLBACK_GRADIENTS = [
    "from-[var(--course-1-from)] to-[var(--course-1-to)]",
    "from-[var(--course-2-from)] to-[var(--course-2-to)]",
    "from-[var(--course-3-from)] to-[var(--course-3-to)]",
    "from-[var(--course-4-from)] to-[var(--course-4-to)]",
    "from-[var(--course-5-from)] to-[var(--course-5-to)]",
    "from-[var(--course-6-from)] to-[var(--course-6-to)]",
    "from-[var(--course-7-from)] to-[var(--course-7-to)]",
    "from-[var(--course-8-from)] to-[var(--course-8-to)]",
];

const KEYWORD_ICON_MAP: Record<string, LucideIcon> = {
    "programming": Code,
    "development": Code,
    "code": Code,
    "javascript": Code,
    "python": Code,
    "c#": Code,
    "java": Code,
    "data": Brain,
    "growth": Rocket,
    "strategy": Target,
    "fundamentals": BookOpen,
    "basics": BookOpen,
    "essentials": BookOpen,
    "advanced": Award,
    "masterclass": Award,
    "expert": Zap,
};

function getDeterministicGradient(name: string): string {
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
        sum += name.charCodeAt(i);
    }
    return FALLBACK_GRADIENTS[sum % FALLBACK_GRADIENTS.length];
}

function getIconByKeyword(courseName: string): LucideIcon | null {
    const lowerName = courseName.toLowerCase();

    for (const [keyword, icon] of Object.entries(KEYWORD_ICON_MAP)) {
        if (lowerName.includes(keyword)) {
            return icon;
        }
    }

    return null;
}

export function getCourseIcon(courseName: string): LucideIcon {
    if (COURSE_ICON_MAP[courseName]) {
        return COURSE_ICON_MAP[courseName];
    }

    const keywordIcon = getIconByKeyword(courseName);
    if (keywordIcon) {
        return keywordIcon;
    }

    return BookOpen;
}

export function getCourseGradient(courseName: string): string {
    if (COURSE_COLOR_MAP[courseName]) {
        return COURSE_COLOR_MAP[courseName];
    }

    return getDeterministicGradient(courseName);
}

export interface CourseVisualConfig {
    icon: LucideIcon;
    gradient: string;
}

export function getCourseVisualConfig(courseName: string): CourseVisualConfig {
    return {
        icon: getCourseIcon(courseName),
        gradient: getCourseGradient(courseName),
    };
}