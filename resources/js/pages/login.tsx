import { useLanguage } from '@/contexts/LanguageContext'
import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"

interface LoginPageProps {
  onSignUp: () => void;
  onBack?: () => void;
}

export default function LoginPage({ onSignUp, onBack }: LoginPageProps) {
  const { t } = useLanguage()
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          {t('hospitalName')}
        </a>
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          {t('dontHaveAccount')}{" "}
          <button type="button" onClick={onSignUp} className="font-medium text-primary underline hover:text-primary/80">
            {t('signUp')}
          </button>
        </p>
        {onBack && (
          <button
            onClick={onBack}
            className="text-sm text-muted-foreground underline hover:text-foreground"
          >
            {t('backToHome')}
          </button>
        )}
      </div>
    </div>
  )
}
