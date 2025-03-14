import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { useToast } from '../ui/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Mail, LockKeyhole, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { sendOtp, login, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // Auto-focus OTP input when step changes
  useEffect(() => {
    if (step === 'otp') {
      const otpInput = document.getElementById('otp-input');
      if (otpInput) {
        otpInput.focus();
      }
    }
  }, [step]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  };

  const handleSendOtp = async () => {
    const trimmedEmail = email.trim();
    if (!validateEmail(trimmedEmail)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setIsSendingOtp(true);
    try {
      await sendOtp(trimmedEmail);
      setStep('otp');
      toast({ title: 'OTP Sent', description: 'Check your email for the OTP.' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.toString() || 'Failed to send OTP',
        variant: 'destructive',
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    if (otp.length !== 6 || !trimmedEmail) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter a 6-digit OTP',
        variant: 'destructive',
      });
      return;
    }

    setIsVerifying(true);
    try {
      await login(trimmedEmail, otp);
      toast({ title: 'Success', description: 'Logged in successfully!' });
      // No need to navigate here - the useEffect will handle it
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.toString() || 'Invalid OTP or login failed',
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Admin Portal
              </h1>
              <p className="text-muted-foreground">
                {step === 'email' ? 'Enter your email to continue' : 'Enter OTP to verify'}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {step === 'email' ? (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value.trimStart())}
                      placeholder="admin@example.com"
                      className="pl-10 h-12 rounded-xl text-base"
                      onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                    />
                  </div>

                  <Button
                    onClick={handleSendOtp}
                    disabled={isSendingOtp || !email.trim()}
                    className="w-full h-12 rounded-xl gap-2"
                  >
                    {isSendingOtp ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      'Send OTP'
                    )}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="otp-input"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="6-digit OTP"
                      className="pl-10 h-12 rounded-xl text-base"
                      type="tel" // Changed from "number" to avoid spinner
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                  </div>

                  <Button
                    onClick={handleLogin}
                    disabled={isVerifying || otp.length !== 6}
                    className="w-full h-12 rounded-xl gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify & Login'
                    )}
                  </Button>

                  <button
                    onClick={() => {
                      setStep('email');
                      setOtp('');
                    }}
                    className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Email
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-muted/50 px-8 py-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Secure admin portal access • Contact support@example.com for help
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;