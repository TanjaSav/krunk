'use client';
import ReCAPTCHA from 'react-google-recaptcha';

interface CaptchaProps {
  onChange: (token: string | null) => void;
  onExpired?: () => void;
}

const Captcha = ({ onChange, onExpired }: CaptchaProps) => {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

  if (!siteKey) {
    console.warn('reCAPTCHA site key not found. Please add NEXT_PUBLIC_RECAPTCHA_SITE_KEY to your .env.local file');
    return null;
  }

  return (
    <div className="flex justify-center">
      <ReCAPTCHA
        sitekey={siteKey}
        onChange={onChange}
        onExpired={onExpired}
      />
    </div>
  );
};

export default Captcha;
