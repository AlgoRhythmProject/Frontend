interface LoginFooterProps {
    mainText?: string;
    linkText?: string;
    onLinkClick?: () => void;
    promptText?: string;
}

export function AuthenticationFooter({
    mainText = "Demo app - use any email and password",
    promptText,
    linkText,
    onLinkClick,
}: LoginFooterProps) {
    return (
        <div className="mt-6 text-center">
            <p className="font-sans text-muted-foreground text-sm">{mainText}</p>
            {linkText && onLinkClick && promptText && (
                <p className="font-sans text-muted-foreground text-sm mt-2">
                    {promptText}{" "}
                    <button
                        onClick={onLinkClick}
                        className="text-primary font-medium hover:underline cursor-pointer"
                    >
                        {linkText}
                    </button>
                </p>
            )}
        </div>
    );
}
