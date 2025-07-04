"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import {
  apiFetch,
  doesTitleMatch,
  getEnv,
  getOrderByClause,
  withErrorHandling,
} from "../util";
import { db } from "@/drizzle/db";
import { likes, user, videos } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";
import aj, { fixedWindow, request } from "../arcjet";
import { and, desc, eq, ilike, ne, or, sql } from "drizzle-orm";
import { BunnyVideoResponse, VideoDetails, Visibility } from "@/index";
import cloudinary from "../Cloudinary/cloudinary_server";

const validateWithArcjet = async (fingerPrint: string) => {
  const rateLimit = aj.withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 2,
      characteristics: ["fingerprint"],
    })
  );
  const req = await request();
  const decision = await rateLimit.protect(req, { fingerprint: fingerPrint });
  if (decision.isDenied()) {
    throw new Error("Rate Limit Exceeded");
  }
};

// Helper functions with descriptive names
const revalidatePaths = (paths: string[]) => {
  paths.forEach((path) => revalidatePath(path));
};

const getSessionUserId = async (): Promise<string> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthenticated");
  return session.user.id;
};

function getPublicIdFromUrl(url: string, folder: string): string {
  const regex = new RegExp(
    `${folder}/(.+?)\\.(jpg|jpeg|png|gif|webp|mp4|mov|mkv|webm)$`
  );
  const match = url.match(regex);
  return match ? `${folder}/${match[1]}` : "";
}

const buildVideoWithUserQuery = () =>
  db
    .select({
      video: videos,
      user: { id: user.id, name: user.name, image: user.image },
    })
    .from(videos)
    .leftJoin(user, eq(videos.userId, user.id));

// Server Actions

export const saveVideoDetails = withErrorHandling(
  async (videoDetails: VideoDetails) => {
    const userId = await getSessionUserId();
    await validateWithArcjet(userId);

    const now = new Date();
    await db.insert(videos).values({
      ...videoDetails,
      userId,
      createdAt: now,
      updatedAt: now,
    });

    revalidatePaths(["/"]);
    return { videoId: videoDetails.videoId };
  }
);

export const getVideoById = withErrorHandling(async (videoId: string) => {
  const [videoRecord] = await buildVideoWithUserQuery().where(
    eq(videos.videoId, videoId)
  );
  return videoRecord;
});

export const deleteVideo = withErrorHandling(
  async (videoId: string, videoUrl: string, thumbnailUrl: string) => {
    try {
      // console.log("thumbnailUrl", thumbnailUrl, "videoUrl", videoUrl);
      const thumbnailPublicId = getPublicIdFromUrl(
        thumbnailUrl,
        "StreamNest_Thumbnail"
      );
      const videoPublicId = getPublicIdFromUrl(videoUrl, "StreamNest_Video");
      const res = await cloudinary.uploader.destroy(thumbnailPublicId, {
        resource_type: "image",
      });
      // console.log(res);
      await cloudinary.uploader.destroy(videoPublicId, {
        resource_type: "video",
      });

      await db.delete(videos).where(eq(videos.videoId, videoId));
      revalidatePaths(["/", `/video/${videoId}`]);
      return { success: true, message: "Video deleted successfully" };
    } catch (error) {
      return { success: false, message: "Failed to delete video", err: error };
    }
  }
);

export const incrementVideoViews = withErrorHandling(
  async (videoId: string) => {
    await db
      .update(videos)
      .set({ views: sql`${videos.views} + 1`, updatedAt: new Date() })
      .where(eq(videos.videoId, videoId));

    revalidatePaths([`/video/${videoId}`]);
    return {};
  }
);

export const getAllVideos = withErrorHandling(
  async (
    searchQuery: string = "",
    sortFilter?: string,
    pageNumber: number = 1,
    pageSize: number = 4 // Make it 4 now, not 8
  ) => {
    const session = await auth.api.getSession({ headers: await headers() });
    const currentUserId = session?.user.id;

    const publicCondition = and(
      eq(videos.visibility, "public"),
      ne(videos.userId, currentUserId!)
    );

    const userCondition = eq(videos.userId, currentUserId!);

    const applySearch = (condition: any) =>
      searchQuery.trim()
        ? and(condition, doesTitleMatch(videos, searchQuery))
        : condition;

    // Total counts for pagination (if needed separately)
    const [{ totalCount: totalOthers }] = await db
      .select({ totalCount: sql<number>`count(*)` })
      .from(videos)
      .where(applySearch(publicCondition));

    const [{ totalCount: totalUser }] = await db
      .select({ totalCount: sql<number>`count(*)` })
      .from(videos)
      .where(applySearch(userCondition));

    // Query videos from others
    const otherVideos = await buildVideoWithUserQuery()
      .where(applySearch(publicCondition))
      .orderBy(getOrderByClause(sortFilter) ?? sql`${videos.createdAt} DESC`)
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize);

    // Query videos from the logged-in user
    const userVideos = await buildVideoWithUserQuery()
      .where(applySearch(userCondition))
      .orderBy(getOrderByClause(sortFilter) ?? sql`${videos.createdAt} DESC`)
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize);

    return {
      otherVideos,
      userVideos,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.max(
          Math.ceil(totalOthers / pageSize),
          Math.ceil(totalUser / pageSize)
        ),
      },
    };
  }
);

export const getAllVideosByUser = withErrorHandling(
  async (
    userIdParameter: string,
    searchQuery: string = "",
    sortFilter?: string
  ) => {
    const currentUserId = (
      await auth.api.getSession({ headers: await headers() })
    )?.user.id;
    const isOwner = userIdParameter === currentUserId;

    const [userInfo] = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
        email: user.email,
      })
      .from(user)
      .where(eq(user.id, userIdParameter));
    if (!userInfo) throw new Error("User not found");

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const conditions = [
      eq(videos.userId, userIdParameter),
      !isOwner && eq(videos.visibility, "public"),
      searchQuery.trim() && ilike(videos.title, `%${searchQuery}%`),
    ].filter(Boolean) as any[];

    const userVideos = await buildVideoWithUserQuery()
      .where(and(...conditions))
      .orderBy(getOrderByClause(sortFilter) ?? sql`${videos.createdAt} DESC`);

    return { user: userInfo, videos: userVideos, count: userVideos.length };
  }
);

export const updateVideoVisibility = withErrorHandling(
  async (videoId: string, visibility: Visibility, userIdParameter: string) => {
    try {
      await validateWithArcjet(videoId);
      const session = await auth.api.getSession({ headers: await headers() });
      const currentUserId = session?.user.id;
      if (!currentUserId || currentUserId !== userIdParameter) {
        return {
          success: false,
          message: "You are not allowed to update this video.",
        };
      }
      await db
        .update(videos)
        .set({ visibility, updatedAt: new Date() })
        .where(eq(videos.videoId, videoId));
      return { success: true, message: "Visibility updated successfully" };
    } catch (error) {
      // console.error(error);
      return { success: false, message: "Failed to Update", error };
    }
  }
);

export const likeVideo = withErrorHandling(async (videoId: string) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    const existingLike = await db
      .select()
      .from(likes)
      .where(and(eq(likes.userId, userId), eq(likes.videoId, videoId)))
      .limit(1);

    if (existingLike.length > 0)
      return { success: false, message: "Already Liked!!!" };

    await db.insert(likes).values({ userId, videoId });

    return { success: true, message: "Liked Video" };
  } catch (error) {
    // console.error(error);
    return { success: false, error, message: "Something Went Wrong!!!" };
  }
});

export const isVideoLiked = withErrorHandling(async (videoId: string) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  if (!userId) return { success: false, liked: false };

  const result = await db
    .select()
    .from(likes)
    .where(and(eq(likes.userId, userId), eq(likes.videoId, videoId)))
    .limit(1);

  return { success: true, liked: result.length > 0 };
});

export const likeCount = withErrorHandling(async (videoId: string) => {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(likes)
      .where(eq(likes.videoId, videoId));
    return { success: true, count: result[0]?.count ?? 0 };
  } catch (error) {
    return { success: false, message: "Failed to fetch count" };
  }
});
