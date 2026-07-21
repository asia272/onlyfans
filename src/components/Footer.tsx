const Footer = () => {
    return (
        <footer className="border-t ">
            <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground md:flex-row">
                <p>
                    © {new Date().getFullYear()} OnlyHorse. All rights reserved.
                </p>

                <div className="flex items-center gap-6 py-5">

                    <a
                        href="https://github.com/asia272/onlyfans"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-foreground"
                    >
                        GitHub
                    </a>

                    <a
                        href="https://asia-ashraf.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-foreground"
                    >
                        Portfolio
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;