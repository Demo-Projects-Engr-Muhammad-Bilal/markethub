export type AuthView = 'main' | '2fa' | 'forgot' | 'reset' | 'setup-2fa' | 'verify-email';

export interface AuthPageProps {
          apiUrl: string;
          appName?: string;
          appRole?: string;
          logoSrc?: string;
          googleClientId?: string;
          googleRedirectUri?: string;
          hideSignUp?: boolean;
          leftPanelTitle?: any;
          leftPanelSubtitle?: string;
          leftPanelFeatures?: { icon: any; text: string }[]; // 🟢 React.ElementType ki jagah 'any' use karein
}

export interface BaseAuthProps {
          // 🔴 apiUrl yahan se REMOVE kar diya gaya hai kyunke ab components ise useConfig() se directly le rahe hain
          isLoading: boolean;
          setIsLoading: (v: boolean) => void;
          setView: (v: AuthView) => void;
}

export interface Base2FAProps extends BaseAuthProps {
          tempUserId: string | null;
          otpCode: string;
          setOtpCode: (v: string) => void;
          onSuccess: () => void;
}

export interface ForgotPasswordViewProps extends BaseAuthProps { }

export interface ResetPasswordViewProps extends BaseAuthProps { }

export interface LeftPanelProps {
          appName: string;
          appRole: string;
          logoSrc?: string;
          leftPanelTitle: any;
          leftPanelSubtitle: string;
          leftPanelFeatures: { icon: any; text: string }[]; // 🟢 Here as well
}


export interface MainViewProps extends BaseAuthProps {
          appName: string;   // 🟢 Added
          logoSrc?: string;
          appRole: string;
          setTempUserId: (id: string) => void;
          googleClientId?: string;
          googleRedirectUri?: string;
          onSetup2FA: (userId: string) => void;
          tabParam: string;
          changeTab: (v: string) => void;
          hideSignUp?: boolean;
}

export interface SignInFormProps extends BaseAuthProps {
          setTempUserId: (id: string) => void;
          onSetup2FA: (userId: string) => void;
}

export interface SignUpFormProps extends BaseAuthProps {
          appRole: string;
          changeTab: (tab: string) => void;
}

export interface TwoFAViewProps extends Base2FAProps { }

export interface Setup2FAViewProps extends Base2FAProps {
          otpauthUrl: string | null;
}