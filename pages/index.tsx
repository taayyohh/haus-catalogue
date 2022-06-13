import type { NextPage } from 'next'
import Link from "next/link";


const Home: NextPage = () => {
    const button = "inline-flex self-start p-4 bg-rose-400 text-white font-bold shadow-xl rounded-xl hover:bg-rose-500 flex hover:cursor-pointer items-center justify-center mx-auto my-2 w-full"

    return (
        <div className="flex w-32">
            <Link href="/upload">
                <div className={button}>Upload</div>
            </Link>
        </div>
)
}

export default Home
