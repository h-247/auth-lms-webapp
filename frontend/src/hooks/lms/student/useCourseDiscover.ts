import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { lmsService } from "@/services/lms/lmsService";
import { Course, Enrollment } from "@/types";

const PAGE_SIZE = 9;

export function useCourseDiscover() {
  const [publishedCourses, setPublishedCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isLoadingRef = useRef(false);
  const requestSeqRef = useRef(0);

  const hasNextPage = useCallback((response: any, currentCount: number) => {
    const itemsCount = response?.items?.length ?? 0;
    const totalPages = response?.pagination?.total_pages;
    const currentPage = response?.pagination?.page;
    if (typeof totalPages === "number" && typeof currentPage === "number") return currentPage < totalPages;
    const total = response?.pagination?.total ?? response?.total ?? response?.total_items;
    if (typeof total === "number") return currentCount < total;
    return itemsCount >= PAGE_SIZE;
  }, []);

  const loadInitialData = useCallback(async () => {
    const sequence = ++requestSeqRef.current;
    setLoading(true);
    setError("");
    try {
      const [catalogue, accepted] = await Promise.all([
        lmsService.listPublishedCourses({ page: 1, page_size: PAGE_SIZE }),
        lmsService.getMyEnrollments("ACCEPTED"),
      ]);
      if (sequence !== requestSeqRef.current) return;
      const items = (catalogue?.items || []) as Course[];
      setPublishedCourses(items);
      setEnrollments(accepted || []);
      setPage(1);
      setHasMore(hasNextPage(catalogue, items.length));

      const categories = await lmsService.listPublishedCourses({ page_size: 100 });
      if (sequence !== requestSeqRef.current) return;
      const tags = Array.from(new Set(
        ((categories?.items || []) as Course[])
          .flatMap((course) => course.category?.split(",").map((tag) => tag.trim()) ?? [])
          .filter(Boolean),
      ));
      setAllTags(tags);
    } catch (err: any) {
      if (sequence === requestSeqRef.current) setError(err?.message || "Không thể tải danh sách khóa học");
    } finally {
      if (sequence === requestSeqRef.current) setLoading(false);
    }
  }, [hasNextPage]);

  useEffect(() => {
    void loadInitialData();
  }, [loadInitialData]);

  const handleSearchFilter = useCallback(async (searchTerm: string, tag: string, level: string) => {
    const sequence = ++requestSeqRef.current;
    setLoading(true);
    setError("");
    try {
      const params: Record<string, unknown> = { page: 1, page_size: PAGE_SIZE };
      if (searchTerm) params.search = searchTerm;
      if (tag !== "all") params.category = tag;
      if (level !== "all") params.level = level;
      const response = await lmsService.listPublishedCourses(params);
      if (sequence !== requestSeqRef.current) return;
      const items = (response?.items || []) as Course[];
      setPublishedCourses(items);
      setPage(1);
      setHasMore(hasNextPage(response, items.length));
    } catch (err: any) {
      if (sequence === requestSeqRef.current) setError(err?.message || "Lỗi tìm kiếm khóa học");
    } finally {
      if (sequence === requestSeqRef.current) setLoading(false);
    }
  }, [hasNextPage]);

  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || !hasMore) return;
    isLoadingRef.current = true;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const params: Record<string, unknown> = { page: nextPage, page_size: PAGE_SIZE };
      if (search) params.search = search;
      if (selectedTag !== "all") params.category = selectedTag;
      if (selectedLevel !== "all") params.level = selectedLevel;
      const response = await lmsService.listPublishedCourses(params);
      const items = (response?.items || []) as Course[];
      setPublishedCourses((current) => {
        const ids = new Set(current.map((course) => course.id));
        return [...current, ...items.filter((course) => !ids.has(course.id))];
      });
      setPage(nextPage);
      setHasMore(hasNextPage(response, nextPage * PAGE_SIZE));
    } finally {
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  }, [hasMore, hasNextPage, page, search, selectedLevel, selectedTag]);

  const enrolledCourseIds = useMemo(
    () => new Set(enrollments.map((enrollment) => enrollment.course_id)),
    [enrollments],
  );

  return {
    publishedCourses,
    enrolledCourseIds,
    allTags,
    loading,
    loadingMore,
    error,
    search,
    setSearch,
    selectedTag,
    setSelectedTag,
    selectedLevel,
    setSelectedLevel,
    hasMore,
    handleSearchFilter,
    loadMore,
  };
}
