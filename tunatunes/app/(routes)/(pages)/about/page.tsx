import { Heading } from "@/components/ui/heading";

const AboutPage = () => {
    return (
        <>
            <Heading title="About" description="Learn more about Tunatunes" />
            <div className="px-6 py-4 text-slate-700">
                <h3 className="font-extrabold text-3xl py-4 text-slate-800">Hello User,</h3>
                <p className="text-lg px-4">Thanks for using Tunatunes! This WebApp was built with:</p>
                <ul className="list-disc list-inside text-lg px-8 py-4 space-y-2 text-left">
                    <li className="font-semibold">Next.js</li>
                    <li className="font-semibold">Spotify API</li>
                    <li className="font-semibold">TailwindCSS</li>
                    <li className="font-semibold">React</li>
                </ul>
                <p className="text-lg px-4 text-left">Tunatunes helps users discover new music and listen to quick snippets. In a future update, I plan to add a feature to add these songs to your playlists.</p>
            </div>
        </>
    );
}

export default AboutPage;
