import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export function LanguageSelector({ variant = "default" }: { variant?: "default" | "navbar" }) {
  const { language, setLanguage, languages } = useLanguage();

  const currentLang = languages.find((l) => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant === "navbar" ? "ghost" : "outline"} size="sm" className={variant === "navbar" ? "h-9 w-9 px-0" : ""}>
          <Globe className="h-4 w-4" />
          {variant !== "navbar" && (
            <span className="ml-2">{currentLang?.nativeName}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={language === lang.code ? "bg-accent" : ""}
          >
            <span className="font-medium">{lang.nativeName}</span>
            <span className="text-muted-foreground ml-2 text-sm">{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
