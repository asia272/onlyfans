"use client";
import { CldVideoPlayer } from 'next-cloudinary';



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


