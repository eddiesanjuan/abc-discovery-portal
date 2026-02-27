import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full py-6">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-4">
          <Image
            src="/efsj-logo.png"
            alt="E.F. San Juan - Celebrating 50 Years"
            width={44}
            height={44}
            className="rounded-full"
            priority
          />
          <p className="font-playfair text-lg tracking-wide text-charcoal">
            E.F. San Juan
          </p>
        </div>
        <div className="mt-2 h-px bg-gradient-to-r from-gold via-gold/40 to-transparent" />
      </div>
    </header>
  );
}
