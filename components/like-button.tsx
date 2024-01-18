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
    const [optimisticLikes, setOptimisticLikes] = React.useState(likes);
    const [isLiked, setIsLiked] = React.useState(false);

    React.useEffect(() => {
        let data = localStorage.getItem('likedArticles');
        if (data) {
            const likedArticles = JSON.parse(data);
            // check if the current article exists in the local storage
            const isExists = likedArticles.some((id: string) => id === articleId);
            setIsLiked(isExists);
            setLocallyLikedArticles(likedArticles);
        }
    }, [articleId])

    const onHandleLike = async () => {
        const alreadyLiked = locallyLikedArticles.some(id => id === articleId);
        if (alreadyLiked) {
            // check if the likes less than 0 if it is then return we don't want to be our likes be in negative.
            if (likes <= 0) return;
            setIsLiked(false);
            setOptimisticLikes(pre => pre - 1);
            const res = await unLikeArticle({ articleId, likes });
            if (!res) {
                return toast({
                    description: "Something went wront"
                })
            }
            const filterArtiles = locallyLikedArticles.filter(id => id !== articleId);
            localStorage.setItem('likedArticles', JSON.stringify(filterArtiles));
            setLocallyLikedArticles(filterArtiles);
            return;
        }
        setIsLiked(true);
        setOptimisticLikes(pre => pre + 1);
        const res = await likeArticle(articleId);
        if (!res) {
            return toast({
                description: "Something went wrong!"
            })
        }
        localStorage.setItem('likedArticles', JSON.stringify([...locallyLikedArticles, articleId]));
        setLocallyLikedArticles([...locallyLikedArticles, articleId]);
    }

    return (
        <div className="flex items-center" onClick={onHandleLike}>
            <Heart className={
                cn({
                    "stroke-red-500": !isLiked,
                    "fill-red-500 stroke-none": isLiked
                })
            } width={20} /> <span className="ml-1">{optimisticLikes}</span>
        </div>
    )
}

export default LikeButton;
