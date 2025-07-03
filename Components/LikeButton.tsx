import { isVideoLiked, likeCount, likeVideo } from '@/lib/actions/video';
import { cn } from '@/lib/util';
import { Eye, Heart, ThumbsUp } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
type Props = {
    videoId: string;
    views: number;
};
const LikeButton = ({ videoId, views }: Props) => {
    const router=useRouter();
    const [isLiking, setIsLiking] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [count, setCount] = useState(0);
    const handleLike = async () => {
        if (isLiking) return;
        setIsLiking(true);
        const res = await likeVideo(videoId);
        if (res.success) {
            // setLikes((prev) => prev + 1);
            toast.success(res.message);
            router.refresh();
        }
        else {
            toast.success(res.message);
        }
        setIsLiking(false);
    }
    useEffect(() => {
        const checkLikeStatus = async () => {
            const res = await isVideoLiked(videoId);
            if (res.success) setIsLiked(res.liked);
            // setLoading(false);
        }
        checkLikeStatus();
    }, [videoId]);
    useEffect(() => {
        const fetchCount = async () => {
            const res = await likeCount(videoId);
            if (res.success) setCount(res?.count || 0);
            else toast.error(res?.message || "Unable to fetch like");
        };

        fetchCount();
    }, [videoId])


    return (
        <>
            <button
                onClick={handleLike}
                disabled={isLiking}
                className={cn("flex gap-1.5  items-center")}
            >
                {isLiked ? <Heart className='h-4 w-4 text-red-500 fill-red-500' /> : <Heart className='h-4 w-4 text-red-500 ' />}
                <span className='font-bold'> {isLiked ? "Liked " : "Like"}</span>

            </button>
            <span className='flex justify-center items-center gap-1.5'>
                <ThumbsUp className='h-4 w-4 text-yellow-400 fill-yellow-400' />
                <span className='font-bold'> {count} Like</span>
            </span>
            <span className='flex justify-center items-center gap-1.5'>
                <Eye className='h-5 w-5  fill-gray-400 text-white' />
                <span className='font-bold'> {views} View</span>
            </span>
        </>
    )
}

export default LikeButton