"use client";
import { CldVideoPlayer } from 'next-cloudinary';
import "next-cloudinary/dist/cld-video-player.css"


const TodaysHighlight = () => {
    return (
        <div className='w-full md:w-3/4 mx-auto'>
            <CldVideoPlayer
                width="500"
                height="500"
                className='rounded-md'
                src="highlighted-vid_vjdbq1"
            />
        </div>
    )
}

export default TodaysHighlight


