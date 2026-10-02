import { useCallback, useEffect, useState } from 'react'
import QRCode from 'qrcode'
import {
  CircleHelp,
  Download,
  Link,
  LoaderCircle,
  Mail,
  Phone,
  QrCode,
  Sparkles,
} from 'lucide-react'

const defaultLink = 'https://zuselogic.com'
const defaultQrColor = '#07085f'
const colorSwatches = ['#07085f', '#0698d8', '#863bff', '#0f766e', '#dc2626', '#111827']
const hexColorPattern = /^#[0-9a-fA-F]{6}$/

function BrandMark() {
  return (
    <span className="grid size-10 place-items-center rounded-lg bg-[#07085f] text-white shadow-[0_14px_34px_rgba(7,8,95,0.18)]">
      <span className="grid grid-cols-3 gap-0.5" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, index) => (
          <span
            key={index}
            className={`size-1.5 rounded-[1px] ${
              [0, 1, 2, 3, 6, 8].includes(index) ? 'bg-white' : 'bg-[#21c4f3]'
            }`}
          />
        ))}
      </span>
    </span>
  )
}

function App() {
  const [websiteLink, setWebsiteLink] = useState(defaultLink)
  const [qrColor, setQrColor] = useState(defaultQrColor)
  const [colorInput, setColorInput] = useState(defaultQrColor)
  const [qrImage, setQrImage] = useState('')
  const [message, setMessage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const generateQrCode = useCallback(async (value, color = qrColor) => {
    const trimmedLink = value.trim()

    if (!trimmedLink) {
      setQrImage('')
      setMessage('Enter a website link first, then generate your QR code.')
      return
    }

    setIsGenerating(true)
    setMessage('')

    try {
      const dataUrl = await QRCode.toDataURL(trimmedLink, {
        errorCorrectionLevel: 'H',
        margin: 2,
        scale: 8,
        color: {
          dark: color,
          light: '#ffffff',
        },
      })

      setQrImage(dataUrl)
    } catch {
      setQrImage('')
      setMessage('Something went wrong while creating the QR code. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }, [qrColor])

  useEffect(() => {
    let isCurrent = true

    QRCode.toDataURL(defaultLink, {
      errorCorrectionLevel: 'H',
      margin: 2,
      scale: 8,
      color: {
        dark: defaultQrColor,
        light: '#ffffff',
      },
    })
      .then((dataUrl) => {
        if (isCurrent) setQrImage(dataUrl)
      })
      .catch(() => {
        if (isCurrent) {
          setMessage('Something went wrong while creating the QR code. Please try again.')
        }
      })

    return () => {
      isCurrent = false
    }
  }, [])

  const handleColorChange = (color) => {
    setQrColor(color)
    setColorInput(color)
    generateQrCode(websiteLink, color)
  }

  const handleColorInputChange = (value) => {
    const nextValue = value.startsWith('#') ? value : `#${value}`

    setColorInput(nextValue)

    if (hexColorPattern.test(nextValue)) {
      setQrColor(nextValue)
      generateQrCode(websiteLink, nextValue)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    generateQrCode(websiteLink)
  }

  const handleDownload = () => {
    if (!qrImage) return

    const downloadLink = document.createElement('a')
    downloadLink.href = qrImage
    downloadLink.download = 'zuseqr-code.png'
    downloadLink.click()
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#07085f]">
      <header className="border-b border-[#d8f5ff] bg-white">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-5 px-5 sm:px-8 lg:min-h-20">
          <a href="/" className="flex items-center gap-3 no-underline" aria-label="ZuseQR home">
            <BrandMark />
            <span className="flex flex-col">
              <span className="text-xl font-black leading-none tracking-normal text-[#07085f] sm:text-2xl">
                ZuseQR
              </span>
              <span className="mt-1 text-sm font-semibold leading-none text-[#0698d8]">
                by Zuselogic
              </span>
            </span>
          </a>

          <a
            href="mailto:info@zuselogic.com"
            className="inline-flex items-center gap-2 rounded-md border border-[#bfedf9] px-4 py-2.5 text-sm font-bold text-[#07085f] transition hover:border-[#0698d8] hover:bg-[#eefcff] focus:outline-none focus:ring-3 focus:ring-[#9ee9ff]"
          >
            <CircleHelp className="size-4" aria-hidden="true" />
            Help
          </a>
        </div>
      </header>

      <main className="bg-[linear-gradient(180deg,#eefcff_0%,#f6fdff_68%,#ffffff_100%)]">
        <section className="mx-auto flex w-full max-w-6xl flex-col justify-center px-5 py-6 sm:px-8 lg:min-h-[calc(100vh-8rem)] lg:py-5">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 inline-flex items-center gap-2 rounded-md border border-[#c9f4ff] bg-white px-3 py-1.5 text-sm font-bold text-[#0698d8] shadow-sm">
              <Sparkles className="size-4" aria-hidden="true" />
              Fast link QR generator
            </p>
            <h1 className="text-3xl font-black leading-tight tracking-normal text-[#07085f] sm:text-5xl lg:text-[3.25rem]">
              Create your QR code
            </h1>
            <p className="mt-2 text-base font-medium text-[#465275] sm:text-lg">
              Turn any link into a QR code in seconds.
            </p>
          </div>

          <section className="mx-auto mt-6 grid w-full max-w-5xl overflow-hidden rounded-lg border border-[#bfefff] bg-white shadow-[0_22px_60px_rgba(6,152,216,0.13)] lg:grid-cols-[1.05fr_0.95fr]">
            <form className="border-b border-[#d8f5ff] p-5 sm:p-6 lg:border-b-0 lg:border-r" onSubmit={handleSubmit}>
              <label htmlFor="website-link" className="text-base font-black text-[#07085f]">
                Website link
              </label>

              <div className="mt-3 flex min-h-12 items-center gap-3 rounded-md border border-[#bfefff] bg-[#f9feff] px-4 focus-within:border-[#0698d8] focus-within:ring-3 focus-within:ring-[#a8edff]">
                <Link className="size-5 shrink-0 text-[#0698d8]" aria-hidden="true" />
                <input
                  id="website-link"
                  type="text"
                  inputMode="url"
                  value={websiteLink}
                  onChange={(event) => setWebsiteLink(event.target.value)}
                  placeholder={defaultLink}
                  className="min-w-0 flex-1 bg-transparent py-3 text-base font-semibold text-[#07085f] outline-none placeholder:text-[#7b8aa5]"
                  aria-describedby="link-help link-message"
                />
              </div>

              <p id="link-help" className="mt-3 max-w-xl text-sm font-medium leading-6 text-[#5e6a88]">
                Paste a website URL and generate a clean PNG QR code for menus, posters, cards, and counters.
              </p>

              <div className="mt-4 rounded-lg border border-[#d8f5ff] bg-[#f9feff] p-4">
                <label htmlFor="qr-color" className="text-sm font-black text-[#07085f]">
                  QR code color
                </label>

                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    id="qr-color"
                    type="color"
                    value={qrColor}
                    onChange={(event) => handleColorChange(event.target.value)}
                    className="h-11 w-full cursor-pointer rounded-md border border-[#bfefff] bg-white p-1 sm:w-16"
                    aria-label="Choose QR code color"
                  />
                  <input
                    type="text"
                    value={colorInput}
                    onChange={(event) => handleColorInputChange(event.target.value)}
                    pattern="^#[0-9A-Fa-f]{6}$"
                    maxLength={7}
                    className="min-h-11 rounded-md border border-[#bfefff] bg-white px-3 text-sm font-black uppercase text-[#07085f] outline-none focus:border-[#0698d8] focus:ring-3 focus:ring-[#a8edff]"
                    aria-label="QR code color hex value"
                  />
                  <div className="flex flex-wrap gap-2" aria-label="Quick color choices">
                    {colorSwatches.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorChange(color)}
                        className={`size-8 rounded-full border-2 transition focus:outline-none focus:ring-3 focus:ring-[#a8edff] ${
                          qrColor.toLowerCase() === color
                            ? 'border-[#07085f]'
                            : 'border-white shadow-[0_0_0_1px_#bfefff]'
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Use QR color ${color}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {message ? (
                <p id="link-message" className="mt-4 rounded-md border border-[#ffd6cc] bg-[#fff7f5] px-4 py-3 text-sm font-bold text-[#9e2d11]">
                  {message}
                </p>
              ) : (
                <span id="link-message" className="sr-only">
                  Ready to generate.
                </span>
              )}

              <button
                type="submit"
                disabled={isGenerating}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#0698d8] px-5 text-base font-black text-white shadow-[0_14px_30px_rgba(6,152,216,0.28)] transition hover:bg-[#057fbd] focus:outline-none focus:ring-3 focus:ring-[#8ae6ff] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {isGenerating ? (
                  <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
                ) : (
                  <QrCode className="size-5" aria-hidden="true" />
                )}
                Generate QR code
              </button>
            </form>

            <div className="flex flex-col items-center justify-center bg-[#f7feff] p-5 text-center sm:p-6">
              <div className="w-full max-w-[230px] rounded-lg border border-[#d8f5ff] bg-white p-3 shadow-[inset_0_0_0_6px_#f5fdff] sm:max-w-[250px]">
                <div className="grid aspect-square place-items-center rounded-md border border-[#e1f7ff] bg-white">
                  {qrImage ? (
                    <img src={qrImage} alt={`QR code for ${websiteLink.trim() || defaultLink}`} className="h-full w-full object-contain p-2" />
                  ) : (
                    <QrCode className="size-20 text-[#a3dff1]" aria-hidden="true" />
                  )}
                </div>
              </div>

              <h2 className="mt-4 text-xl font-black text-[#07085f] sm:text-2xl">Your QR preview</h2>
              <p className="mt-1 max-w-sm text-sm font-medium leading-6 text-[#5e6a88]">
                Download the generated code as a PNG and use it wherever customers need a quick scan.
              </p>

              <button
                type="button"
                onClick={handleDownload}
                disabled={!qrImage}
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-[#0698d8] bg-white px-5 text-base font-black text-[#07085f] transition hover:bg-[#eefcff] focus:outline-none focus:ring-3 focus:ring-[#8ae6ff] disabled:cursor-not-allowed disabled:border-[#cfe8ef] disabled:text-[#91a6b0] sm:w-auto"
              >
                <Download className="size-5" aria-hidden="true" />
                Download PNG
              </button>
            </div>
          </section>
        </section>
      </main>

      <footer className="border-t border-[#d8f5ff] bg-white">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl flex-col gap-3 px-5 py-4 text-sm font-semibold text-[#465275] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:min-h-20">
          <p>© {new Date().getFullYear()} ZuseQR. All rights reserved.</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <a className="inline-flex items-center gap-2 text-[#07085f] no-underline hover:text-[#0698d8]" href="tel:+250781796824">
              <Phone className="size-4" aria-hidden="true" />
              +250781796824
            </a>
            <a className="inline-flex items-center gap-2 text-[#07085f] no-underline hover:text-[#0698d8]" href="mailto:info@zuselogic.com">
              <Mail className="size-4" aria-hidden="true" />
              info@zuselogic.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
