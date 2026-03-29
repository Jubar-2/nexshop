interface AuthHeaderProps {
    title: string;
    subtitle: string;
}

export const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => (
    <div className="text-center mb-8 md:mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#2D3344] mb-2">{title}</h2>
        <p className="text-slate-500 font-medium">{subtitle}</p>
    </div>
);