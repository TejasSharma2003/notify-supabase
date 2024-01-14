'use client'

import likeArticle from '@/actions/articles/like-article';
import unLikeArticle from '@/actions/articles/unlike-article';
import { Heart } from 'lucide-react';
import React from 'react'
import { toast } from './ui/use-toast';
import { cn, delay } from '@/lib/utils';
import clsx from 'clsx';

type LikeButtonProps = {
    likes: number,
    articleId: string
}

const LikeButton = ({ articleId, likes }: LikeButtonProps) => {
    const [locallyLikedArticles, setLocallyLikedArticles] = React.useState<string[]>([]);

    // optimistic updates
    const [optimisticLikes, addOptimisticLikes] = React.useOptimistic(
        likes,
        (state, l: number) => state + l
    )

    React.useEffect(() => {
        let data = localStorage.getItem('likedArticles');
        if (data) {
            setLocallyLikedArticles(JSON.parse(data));
        }
    }, [])

    const onHandleLike = async () => {
        addOptimisticLikes(1);
        await likeArticle(articleId);
        // if (alreadyLiked) {
        // const res = await unLikeArticle(articleId);
        //     if (!res) {
        //         return toast({
        //             description: "Something went wront"
        //         })
        //     }
        //     const filterArtiles = locallyLikedArticles.filter(id => id !== articleId);
        //     localStorage.setItem('likedArticles', JSON.stringify(filterArtiles));
        //     setLocallyLikedArticles(filterArtiles);
        //     return;
        // }
        // addOptimisticLikes(1);
        // const res = await likeArticle(articleId);
        // if (!res) {
        //     return toast({
        //         description: "Something went wrong!"
        //     })
        // }
        // localStorage.setItem('likedArticles', JSON.stringify([...locallyLikedArticles, articleId]));
        // setLocallyLikedArticles([...locallyLikedArticles, articleId]);
    }

    const isLiked = false;

    return (
        <span className="flex items-center cursor-pointer" onClick={onHandleLike}>
            <Heart className={
                clsx({
                    "stroke-red-500": !isLiked,
                    "fill-red-500 stroke-none": isLiked
                })
            } width={20} /> <span className="ml-1">{optimisticLikes}</span>
        </span>
    )
}

export default LikeButton;
