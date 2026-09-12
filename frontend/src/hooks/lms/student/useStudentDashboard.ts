"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { lmsService } from "@/services/lms/lmsService";
import { analyticsService } from "@/services/lms/analyticsService";
import { Enrollment } from "@/types";

export function useStudentDashboard() {
  const [mounted, setMounted] = useState(false);
  const [acceptedEnrollments, setAcceptedEnrollments] = useState<Enrollment[]>([]);
  const [loadingEnrolled, setLoadingEnrolled] = useState(true);
  const [error, setError] = useState("");
  
  // Filter & Search states
  const [courseSearchQuery, setCourseSearchQuery] = useState("");
  const [courseStatusFilter, setCourseStatusFilter] = useState<"ALL" | "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED">("ALL");
  const [courseSortOrder, setCourseSortOrder] = useState<"desc" | "asc">("desc");

  // Selected Course details for Analytics
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [flashcardStats, setFlashcardStats] = useState<any>(null);
  const [quizScores, setQuizScores] = useState<any[]>([]);
  const [lessonProgress, setLessonProgress] = useState<any>(null);
  const [microInteractions, setMicroInteractions] = useState<any>(null);
  const [spacedRepQuizzes, setSpacedRepQuizzes] = useState<any>(null);
  const [analyticsTab, setAnalyticsTab] = useState<"lessons" | "mastery" | "flashcards">("lessons");

  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Load general enrollments data ─────────────────────────────────────────

  const loadAllData = useCallback(async () => {
    setLoadingEnrolled(true);
    setError("");
    try {
      const accepted = await lmsService.getMyEnrollments("ACCEPTED");
      const enrollList = accepted || [];
      setAcceptedEnrollments(enrollList);

      const availableEnrollments = enrollList.filter(
        (enrollment: Enrollment) => enrollment.course_status !== "ARCHIVED",
      );

      if (availableEnrollments.length === 0) {
        setSelectedCourseId(null);
        return;
      }

      // Select first course by default for analytics
      setSelectedCourseId((prev) => {
        if (availableEnrollments.length > 0 && !prev) {
          return availableEnrollments[0].course_id;
        }
        if (prev && !availableEnrollments.some((enrollment) => enrollment.course_id === prev)) return availableEnrollments[0]?.course_id ?? null;
        return prev;
      });
    } catch (e) {
      console.error(e);
      setError("Không thể tải thông tin tiến độ học tập.");
    } finally {
      setLoadingEnrolled(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // ── Load course-specific analytics ──────────────────────────────────────────

  const loadCourseAnalytics = useCallback(async (courseId: number) => {
    setLoadingAnalytics(true);
    try {
      const result = await analyticsService.getStudentAnalyticsSummary(courseId);
      const summary = result?.data;

      if (summary) {
        setFlashcardStats(summary.flashcards);
        setQuizScores(summary.quiz_scores || []);
        setLessonProgress(summary.lesson_progress);
        setMicroInteractions(summary.micro_interactions);
        setSpacedRepQuizzes(summary.spaced_rep_quizzes);
      }
    } catch (e) {
      console.error("Error loading course analytics:", e);
    } finally {
      setLoadingAnalytics(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      loadCourseAnalytics(selectedCourseId);
    }
  }, [selectedCourseId, loadCourseAnalytics]);

  // ── Computed properties (useMemo for optimal rendering) ─────────────────────

  const availableEnrollments = useMemo(
    () => acceptedEnrollments.filter((e) => e.course_status !== "ARCHIVED"),
    [acceptedEnrollments],
  );

  const completedEnrollments = useMemo(
    () => availableEnrollments.filter((e) => (e.progress_percent || 0) === 100),
    [availableEnrollments]
  );

  const inProgressEnrollments = useMemo(
    () => availableEnrollments.filter((e) => (e.progress_percent || 0) > 0 && (e.progress_percent || 0) < 100),
    [availableEnrollments]
  );

  const notStartedEnrollments = useMemo(
    () => availableEnrollments.filter((e) => (e.progress_percent || 0) === 0),
    [availableEnrollments]
  );

  const filteredAndSortedEnrollments = useMemo(() => {
    return acceptedEnrollments
      .filter((en) => {
        const matchesSearch = (en.course_title || "").toLowerCase().includes(courseSearchQuery.toLowerCase());
        if (!matchesSearch) return false;

        const progress = en.progress_percent || 0;
        if (courseStatusFilter === "NOT_STARTED") return progress === 0;
        if (courseStatusFilter === "IN_PROGRESS") return progress > 0 && progress < 100;
        if (courseStatusFilter === "COMPLETED") return progress === 100;
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.accepted_at || a.enrolled_at || 0).getTime();
        const dateB = new Date(b.accepted_at || b.enrolled_at || 0).getTime();
        return courseSortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
  }, [acceptedEnrollments, courseSearchQuery, courseStatusFilter, courseSortOrder]);

  const completedCount = completedEnrollments.length;
  const inProgressCount = inProgressEnrollments.length;
  const notStartedCount = notStartedEnrollments.length;
  const totalCount = availableEnrollments.length;

  const completedPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const inProgressPercent = totalCount > 0 ? Math.round((inProgressCount / totalCount) * 100) : 0;
  const notStartedPercent = totalCount > 0 ? Math.max(0, 100 - completedPercent - inProgressPercent) : 0;

  const focusCourse = useMemo(() => {
    if (inProgressEnrollments.length > 0) {
      return inProgressEnrollments.reduce(
        (max, curr) => ((curr.progress_percent || 0) > (max.progress_percent || 0) ? curr : max),
        inProgressEnrollments[0]
      );
    }
    if (notStartedEnrollments.length > 0) {
      return notStartedEnrollments[0];
    }
    return null;
  }, [inProgressEnrollments, notStartedEnrollments]);

  const currentCourse = useMemo(
    () => availableEnrollments.find((e) => e.course_id === selectedCourseId),
    [availableEnrollments, selectedCourseId]
  );

  return {
    mounted,
    acceptedEnrollments,
    loadingEnrolled,
    error,
    courseSearchQuery,
    setCourseSearchQuery,
    courseStatusFilter,
    setCourseStatusFilter,
    courseSortOrder,
    setCourseSortOrder,
    selectedCourseId,
    setSelectedCourseId,
    loadingAnalytics,
    flashcardStats,
    quizScores,
    lessonProgress,
    microInteractions,
    spacedRepQuizzes,
    analyticsTab,
    setAnalyticsTab,
    loadAllData,
    filteredAndSortedEnrollments,
    completedCount,
    inProgressCount,
    notStartedCount,
    totalCount,
    completedPercent,
    inProgressPercent,
    notStartedPercent,
    focusCourse,
    currentCourse,
  };
}
