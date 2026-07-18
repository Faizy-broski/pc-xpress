import { Mail, MapPin, Phone } from "lucide-react";

const PHONE = "+44 7307 093007";
const EMAIL = "info@pcxpress.co.uk";
const ADDRESS = "84 The Broadway, Wimbledon SW19";

export function Topbar() {
  return (
    <div className="bg-gradient-brand text-primary-foreground">
      <div className="mx-auto flex h-9 max-w-6xl items-center justify-between gap-4 px-4 text-xs sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 sm:gap-6">
          <a
            href={`tel:${PHONE.replace(/\s+/g, "")}`}
            className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
          >
            <Phone className="size-3.5" />
            <span>{PHONE}</span>
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="hidden items-center gap-1.5 transition-opacity hover:opacity-80 sm:flex"
          >
            <Mail className="size-3.5" />
            <span>{EMAIL}</span>
          </a>
        </div>
        <div className="hidden items-center gap-1.5 lg:flex">
          <MapPin className="size-3.5" />
          <span>{ADDRESS}</span>
        </div>
      </div>
    </div>
  );
}
