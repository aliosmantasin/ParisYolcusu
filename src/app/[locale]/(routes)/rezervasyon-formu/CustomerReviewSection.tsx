'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import ReCAPTCHA from 'react-google-recaptcha'
import axios from 'axios'

const reviewFormSchema = yup.object().shape({
  name: yup.string().min(3, 'İsim en az 3 karakter olmalı').required('İsim gerekli'),
  email: yup.string().email('Geçerli bir email girin').required('Email gerekli'),
  review: yup.string().min(10, 'Yorum en az 10 karakter olmalı').required('Yorum gerekli'),
  recaptchaToken: yup.string().required('Lütfen reCAPTCHA doğrulamasını yapın'),
})

type ReviewFormData = {
  name: string
  email: string
  review: string
  recaptchaToken: string
}

const reviewItems = [
  {
    id: 1,
    name: 'Murat Bey ve Ailesi',
    image: '/images/misafir/parisgezi2.webp',
    comment:
      'Ailemle Paris Turunu gerçekleştirdik. Ferhat bey bizimle çok ilgilendi. Açıkçası hem bize sağolsun şoförlük yaptı hemde rehberlik yaptı. Benim için önemli olan ailemele süreci en iyi şekilde güvenle değerlendirmekti',
  },
  {
    id: 2,
    name: 'Tarık Bey ve Eşi',
    image: '/images/misafir/misafir1.webp',
    comment:
      'Cdg havalimanından bizi karşıladı ve otelimize kapısında bıraktı ferhat bey. Daha önceki ziyaretimzde taksiyle gelmiştik ama bu sefer ferhat beyle tanıştığıma mennun oldum.',
  },
  {
    id: 3,
    name: 'Yaren Hanım',
    image: '/images/misafir/misafir2.webp',
    comment:
      'İlk ziyaretimdi benimle sürekli iletişim halindeydiler, havalimanında beni karşıladılar. Şehir hakkında da birçok faydalı bilgi verdi. Kesinlikle tekrar tercih edeceğim bir hizmet. Metro veya taksi yerine transfer hizmetini tercih etmek benim için daha olumlu, teşekkürler.',
  },
]

const CustomerReviewSection = () => {
  const [selectedId, setSelectedId] = useState<number>(reviewItems[0].id)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [activeImage, setActiveImage] = useState<{ src: string; name: string } | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const selectedReview = reviewItems.find((item) => item.id === selectedId) ?? reviewItems[0]

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting }, reset } = useForm<ReviewFormData>({
    resolver: yupResolver(reviewFormSchema),
    defaultValues: {
      name: '',
      email: '',
      review: '',
      recaptchaToken: '',
    },
  })

  const submitReview = async (data: ReviewFormData) => {
    try {
      const res = await axios.post('/api/send-email', {
        name: data.name,
        email: data.email,
        message: `Müşteri Yorumu: ${data.review}`,
        recaptchaToken: data.recaptchaToken,
      }, {
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (res.status === 200) {
        setToastMessage('Yorumunuz başarıyla gönderildi! İncelendikten sonra yayınlanacaktır.')
        reset()
        setIsModalOpen(false)
        setTimeout(() => setToastMessage(null), 5000)
      } else {
        throw new Error()
      }
    } catch (error) {
      setToastMessage('Yorumunuz gönderilemedi. Lütfen tekrar deneyin.')
      setTimeout(() => setToastMessage(null), 5000)
    }
  }

  return (
    <section id="customer-reviews" className="bg-gradient-to-b from-slate-50 to-white py-16 dark:from-slate-950 dark:to-black">
      <div className="mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            Misafir Yorumları
          </div>
          <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            Gerçek Deneyimler
          </h2>
          <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-400">
            Misafirlerimizin Paris transferi deneyimlerini okuyun ve karşılama anlarımızı görün
          </p>
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
        {/* Sol taraf: Müşteri yorumları */}
        <div className="flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-xl ring-1 ring-slate-200 dark:from-slate-900 dark:to-slate-800 dark:ring-slate-700">
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white p-5 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-50">
                <svg className="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Misafirlerimizin Deneyimleri
              </h3>
              
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition-all hover:scale-110 hover:bg-emerald-600 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/50 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                    title="Yorum Ekle"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                      Yorum Ekle
                    </DialogTitle>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit(submitReview)} className="space-y-4 pt-4">
                    <div>
                      <Label className="text-slate-700 dark:text-slate-300">İsim Soyisim *</Label>
                      <Input {...register('name')} className="mt-1" placeholder="Adınız ve soyadınız" />
                      {errors.name && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.name.message}</p>}
                    </div>

                    <div>
                      <Label className="text-slate-700 dark:text-slate-300">E-mail *</Label>
                      <Input {...register('email')} type="email" className="mt-1" placeholder="ornek@email.com" />
                      {errors.email && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.email.message}</p>}
                    </div>

                    <div>
                      <Label className="text-slate-700 dark:text-slate-300">Müşteri Yorumu *</Label>
                      <Textarea {...register('review')} rows={5} className="mt-1" placeholder="Deneyiminizi bizimle paylaşın..." />
                      {errors.review && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.review.message}</p>}
                    </div>

                    <div className="flex justify-center">
                      <ReCAPTCHA
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                        onChange={(token) => setValue('recaptchaToken', token || '')}
                      />
                    </div>
                    {errors.recaptchaToken && <p className="text-center text-sm text-red-500 dark:text-red-400">{errors.recaptchaToken.message}</p>}

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 py-3 text-base font-bold shadow-lg transition-all hover:scale-[1.02] hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Gönderiliyor...
                        </span>
                      ) : (
                        'Yorum Gönder'
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Gerçek müşteri yorumlarını okuyun
            </p>
          </div>
          <div className="p-5">

          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {reviewItems.map((item) => {
              const isActive = item.id === selectedId

              const handleCardClick = () => {
                setSelectedId(item.id)

                if (typeof window !== 'undefined' && window.innerWidth < 640) {
                  setActiveImage({ src: item.image, name: item.name })
                  setIsImageModalOpen(true)
                }
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={handleCardClick}
                  className={`group relative flex h-36 flex-col overflow-hidden rounded-xl border-2 text-left shadow-md transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/50 md:h-44 ${
                    isActive
                      ? 'scale-105 border-emerald-500 bg-white shadow-2xl shadow-emerald-500/20 dark:bg-slate-800'
                      : 'border-slate-200 bg-white shadow-slate-200 hover:scale-[1.02] hover:border-emerald-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900'
                  }`}
                >
                  <div className="relative flex-1">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(min-width: 1024px) 180px, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent" />
                    )}
                  </div>
                  <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-white px-3 py-2.5 dark:from-slate-800 dark:to-slate-900">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.name}</span>
                    {isActive && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        SEÇİLİ
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="rounded-xl border-2 border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30 p-5 shadow-lg dark:border-emerald-900/30 dark:from-slate-800 dark:to-slate-900">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500">
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </span>
              Müşteri Yorumu
            </div>
            <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">{selectedReview.comment}</p>
          </div>
          </div>
        </div>

        {/* Sağ taraf: Karşılama görselleri */}
        <div className="flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-xl ring-1 ring-slate-700">
          <div className="border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-900 p-5">
            <h3 className="flex items-center gap-2 text-lg font-bold text-white">
              <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Havalimanı Karşılama Anlarımız
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Profesyonel karşılama hizmetimizden örnekler
            </p>
          </div>
          <div className="p-5">
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="group relative h-48 overflow-hidden rounded-xl border-2 border-slate-700 shadow-lg transition-all hover:scale-[1.02] hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/20">
                <Image
                  src="/images/karsilama/karsilama1.webp"
                  alt="Paris havalimanı karşılama görseli 1"
                  fill
                  sizes="(min-width: 1024px) 240px, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="group relative h-48 overflow-hidden rounded-xl border-2 border-slate-700 shadow-lg transition-all hover:scale-[1.02] hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/20">
                <Image
                  src="/images/karsilama/karsilama2.webp"
                  alt="Paris havalimanı karşılama görseli 2"
                  fill
                  sizes="(min-width: 1024px) 240px, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-4 ring-1 ring-slate-700">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm leading-relaxed text-slate-300">
                  Profesyonel şoförlerimiz, uçuş takibini yaparak sizi tam zamanında karşılar ve bagajlarınızla ilgilenir, böylece Paris&apos;e sorunsuz bir giriş yaparsınız.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Mobil için büyük görsel önizleme */}
      {isImageModalOpen && activeImage && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 px-4 sm:hidden">
          <div className="relative w-full max-w-sm">
            <button
              type="button"
              onClick={() => setIsImageModalOpen(false)}
              className="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="overflow-hidden rounded-2xl border border-white/20 bg-black/60 shadow-2xl">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={activeImage.src}
                  alt={activeImage.name}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
              <div className="px-4 py-3 text-center">
                <p className="text-sm font-semibold text-white">
                  {activeImage.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Mesajı */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-900 p-4 shadow-2xl ring-1 ring-slate-700 dark:bg-white dark:ring-slate-200">
            <span className="flex items-center gap-3 text-sm font-medium text-white dark:text-slate-900">
              <svg className="h-5 w-5 flex-shrink-0 text-emerald-400 dark:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {toastMessage}
            </span>
            <button 
              onClick={() => setToastMessage(null)} 
              className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white dark:text-slate-600 dark:hover:bg-slate-100 dark:hover:text-slate-900"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default CustomerReviewSection
