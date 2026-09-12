import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp'
import React from 'react'

export function AuthModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'selection' | 'email' | 'phone'>('selection')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Google ile Giriş
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
  }

  // LinkedIn ile Giriş
  const handleLinkedinLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: { redirectTo: window.location.origin }
    })
  }

  // E-posta ile Giriş / Kayıt
  const handleEmailAuth = async (isSignUp: boolean) => {
    setLoading(true)
    setMessage('')
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(error.message)
      else setMessage('Kayıt başarılı! E-postanızı onaylayın.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
      else {
        setMessage('Giriş başarılı!')
        setIsOpen(false)
      }
    }
    setLoading(false)
  }

  // Telefon OTP Gönder
  const handleSendOtp = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ phone })
    if (error) setMessage(error.message)
    else {
      setIsOtpSent(true)
      setMessage('Doğrulama kodu gönderildi.')
    }
    setLoading(false)
  }

  // Telefon OTP Doğrula
  const handleVerifyOtp = async () => {
    setLoading(true)
    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' })
    if (error) setMessage(error.message)
    else {
      setMessage('Giriş başarılı!')
      setIsOpen(false)
    }
    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Giriş Yap / Kayıt Ol</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">StajyerBul'a Hoş Geldiniz</DialogTitle>
        </DialogHeader>

        {authMode === 'selection' && (
          <div className="flex flex-col gap-3 py-4">
            <Button onClick={handleGoogleLogin} variant="outline" className="w-full">
              Google ile Devam Et
            </Button>
            <Button onClick={handleLinkedinLogin} variant="outline" className="w-full">
              LinkedIn ile Devam Et
            </Button>
            <Button onClick={() => setAuthMode('email')} variant="secondary" className="w-full">
              E-posta ile Devam Et
            </Button>
            <Button onClick={() => setAuthMode('phone')} variant="secondary" className="w-full">
              Telefon (OTP) ile Devam Et
            </Button>
          </div>
        )}

        {authMode === 'email' && (
          <div className="flex flex-col gap-3 py-4">
            <Input 
              type="email" 
              placeholder="E-posta adresiniz" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <Input 
              type="password" 
              placeholder="Şifreniz" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => handleEmailAuth(false)} disabled={loading}>
                Giriş Yap
              </Button>
              <Button className="flex-1" variant="outline" onClick={() => handleEmailAuth(true)} disabled={loading}>
                Kayıt Ol
              </Button>
            </div>
            <Button variant="ghost" onClick={() => setAuthMode('selection')}>Geri Dön</Button>
          </div>
        )}

        {authMode === 'phone' && (
          <div className="flex flex-col gap-3 py-4 items-center">
            {!isOtpSent ? (
              <>
                <Input 
                  type="tel" 
                  placeholder="+90 555 555 5555" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                />
                <Button className="w-full" onClick={handleSendOtp} disabled={loading}>
                  Kod Gönder
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">Lütfen telefonunuza gelen 6 haneli kodu girin</p>
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <Button className="w-full mt-2" onClick={handleVerifyOtp} disabled={loading}>
                  Kodu Onayla ve Giriş Yap
                </Button>
              </>
            )}
            <Button variant="ghost" className="mt-2" onClick={() => setAuthMode('selection')}>Geri Dön</Button>
          </div>
        )}

        {message && <p className="text-sm text-center text-red-500 mt-2">{message}</p>}
      </DialogContent>
    </Dialog>
  )
}