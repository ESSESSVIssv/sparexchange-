import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
    size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({ 
    rating, 
    interactive = false, 
    onRatingChange = (_) => {},
    size = 'md' 
}) => {
    
    let iconSize = 16;
    if (size === 'sm') iconSize = 12;
    if (size === 'lg') iconSize = 20;

    const stars = Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;

        return (
            <Star
                key={starValue}
                size={iconSize}
                className={`${isFilled ? 'text-amber-500 fill-amber-500' : 'text-white/20'} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
                onClick={() => interactive && onRatingChange(starValue)}
            />
        );
    });

    return <div className="flex items-center gap-0.5">{stars}</div>;
};
