import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Navbar(){

    return (
      <nav className="flex w-full items-center justify-between p-4 text-xl font-semibold">
        <div>Wrapify</div>

        <div className="flex flex-row gap-4 items-center">
            <SignedOut>
                <SignInButton />
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </div>
      </nav>
    );
}  