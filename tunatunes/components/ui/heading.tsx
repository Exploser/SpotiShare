import { Separator } from "./separator";

interface HeadingProps {
    title: string;
    description: string;
}

export const Heading: React.FC<HeadingProps> = ({
    title,
    description,
}) => {
    return (
        <div className="flex flex-col items-start justify-between p-4 pb-0">
            <h2 className="text-4xl font-bold tracking-tight">
                {title}
            </h2>
            <p className="text-sm text-muted-foreground mt-2 mx-4">
                {description}
            </p>
            <Separator className="mt-4" />
        </div>
    );
};