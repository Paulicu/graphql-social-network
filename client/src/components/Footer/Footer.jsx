function Footer() {
    return (
        <footer className="bg-black p-2 mt-8 rounded-t-lg">
            <div className="container mx-auto text-center text-sm text-white">
                &copy; { new Date().getFullYear() } Uifălean Paul-Adrian
            </div>
        </footer>
    );
}

export default Footer;