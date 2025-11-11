interface PageHeaderProps {
    title?: string;
    subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
    return (
        <>
            <div className="mb-8">
                <h1 className="font-sans font-medium text-foreground text-4xl md:text-5xl mb-4" style={{ fontVariationSettings: "'wdth' 100" }}>
                    {title}
                </h1>
                <p className="font-sans text-muted-foreground text-lg">
                    {subtitle}
                </p>
            </div>
        </>
    );
}