"use client"

import { ReactNode, useState, useEffect, MutableRefObject } from "react"
import Link from "next/link"
import { Mic, Moon, Sun, Menu, X, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useAuth } from "@/lib/auth-context"
import { logOut } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import Image from "next/image"
import { SmoothCursor } from "@/components/ui/smooth-cursor"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { StickyBanner } from "@/components/ui/sticky-banner"

interface LayoutProps {
  children: ReactNode;
  featuresRef?: MutableRefObject<HTMLDivElement | null>;
}

export function Layout({ children, featuresRef }: LayoutProps) {
  const { setTheme, theme } = useTheme()
  const { user, logout } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [navbarWidth, setNavbarWidth] = useState(100)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const isScrolled = scrollPosition > 10

      // Calculate navbar width based on scroll position
      // Full width (100%) at top, shrinks to 95% at 100px scroll
      const newWidth = Math.max(95, 100 - (scrollPosition / 100) * 5)
      setNavbarWidth(newWidth)

      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrolled])

  const handleSignOut = async () => {
    await logOut()
    router.push('/')
  }

  const scrollToFeatures = () => {
    if (featuresRef?.current) {
      featuresRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Custom Smooth Cursor - Site-wide */}
      <SmoothCursor />

      {/* Promotional Banner */}
      {/* Promotional Banner */}
      <StickyBanner className="bg-indigo-600 text-white py-2 z-[60]" hideOnScroll={true}>
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="bg-white/20 px-2 py-0.5 rounded text-xs uppercase tracking-wider font-bold">New</span>
          <span>Experience our advanced AI Voice Analysis engine.</span>
          <Link href="/analysis" className="underline underline-offset-4 hover:text-indigo-100 transition-colors ml-1">
            Get Started →
          </Link>
        </div>
      </StickyBanner>

      {/* Wrapper for centered navbar */}
      <div className="sticky top-0 z-50 w-full flex justify-center px-4 py-3 transition-all duration-300">
        <motion.header
          style={{
            width: `${navbarWidth}%`,
          }}
          className={`transition-all duration-300 rounded-2xl ${scrolled
            ? "bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-xl shadow-indigo-500/5"
            : "bg-white/40 dark:bg-gray-900/40 backdrop-blur-lg border border-white/30 dark:border-gray-700/20 shadow-lg shadow-indigo-500/5"
            }`}
        >
          <div className="flex h-20 items-center justify-between px-6">
            <Link href="/" className="flex items-center space-x-2 z-10">
              <div className="relative flex items-center">
                <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/20">
                  <Mic className="h-6 w-6" />
                </div>
                <span className="ml-3 text-xl font-display font-semibold tracking-tight">VocalWell.ai</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium z-10">
              <Link href="/" className="transition-colors hover:text-indigo-600 text-base py-1 border-b-2 border-transparent hover:border-indigo-600">
                Home
              </Link>
              <Link href="/features" className="transition-colors hover:text-indigo-600 text-base py-1 border-b-2 border-transparent hover:border-indigo-600">
                Features
              </Link>
              {user && (
                <>
                  <Link href="/dashboard" className="transition-colors hover:text-indigo-600 text-base py-1 border-b-2 border-transparent hover:border-indigo-600">
                    Dashboard
                  </Link>
                  <Link href="/analysis" className="transition-colors hover:text-indigo-600 text-base py-1 border-b-2 border-transparent hover:border-indigo-600">
                    Analysis
                  </Link>
                </>
              )}
              <AnimatedThemeToggler
                className="text-base rounded-full w-11 h-11 bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                duration={600}
              />
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                className="rounded-full w-11 h-11 bg-gray-100 dark:bg-gray-800"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Authentication Buttons */}
            <div className="hidden lg:flex items-center space-x-4 z-10">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-3 rounded-full pl-4 pr-3 py-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-indigo-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800">
                      <span className="text-sm font-medium">{user.email?.split('@')[0] || 'User'}</span>
                      <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-slate-700 flex items-center justify-center">
                        <User className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60 p-2 mt-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-gray-100 dark:border-gray-800 shadow-xl rounded-xl">
                    <DropdownMenuLabel className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-1 bg-gray-100 dark:bg-gray-800" />
                    <DropdownMenuItem asChild className="px-3 py-2.5 text-sm rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 mb-1">
                      <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-slate-800 flex items-center justify-center">
                          <svg className="h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="7" height="9" x="3" y="3" rx="1" />
                            <rect width="7" height="5" x="14" y="3" rx="1" />
                            <rect width="7" height="9" x="14" y="12" rx="1" />
                            <rect width="7" height="5" x="3" y="16" rx="1" />
                          </svg>
                        </div>
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/analysis" className="cursor-pointer flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-indigo-50 dark:bg-slate-800 flex items-center justify-center">
                          <svg className="h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12h10" />
                            <path d="M9 4v16" />
                            <path d="M14 9l3 3-3 3" />
                            <path d="M17 5v14" />
                            <path d="M22 12h-5" />
                          </svg>
                        </div>
                        <span>Analysis</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-indigo-50 dark:bg-slate-800 flex items-center justify-center">
                          <User className="h-4 w-4 text-indigo-600" />
                        </div>
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/reports" className="cursor-pointer flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-indigo-50 dark:bg-slate-800 flex items-center justify-center">
                          <svg className="h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <path d="M14 2v6h6" />
                            <path d="M16 13H8" />
                            <path d="M16 17H8" />
                            <path d="M10 9H8" />
                          </svg>
                        </div>
                        <span>My Reports</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-500 cursor-pointer flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                        <LogOut className="h-4 w-4 text-red-500" />
                      </div>
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" asChild className="rounded-full font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-transparent">
                    <Link href="/signin">Sign In</Link>
                  </Button>
                  <Button asChild className="rounded-full px-8 py-6 bg-indigo-900 hover:bg-indigo-800 text-white shadow-lg hover:shadow-xl hover:shadow-indigo-900/20 shadow-indigo-900/10 transition-all duration-300">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.header>
      </div>

      {/* Mobile Menu */}
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setMobileMenuOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white dark:bg-slate-900 pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Close menu</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-2 px-4 space-y-8">
                  <div className="px-1 flex items-center justify-between">
                    <div className="relative flex items-center">
                      <div className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-lg">
                        <Mic className="h-6 w-6" />
                      </div>
                      <span className="ml-2 text-xl font-display font-semibold">VocalWell.ai</span>
                    </div>
                    <AnimatedThemeToggler
                      className="rounded-full w-10 h-10 bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                      duration={600}
                    />
                  </div>

                  <div className="space-y-6 border-t border-gray-200 dark:border-gray-800 py-6">
                    <div className="flow-root">
                      <Link
                        href="/"
                        className="block py-2 text-base font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Home
                      </Link>
                    </div>

                    <div className="flow-root">
                      <Link
                        href="/features"
                        className="block py-2 text-base font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Features
                      </Link>
                    </div>

                    {user && (
                      <>
                        <div className="flow-root">
                          <Link
                            href="/dashboard"
                            className="block py-2 text-base font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Dashboard
                          </Link>
                        </div>

                        <div className="flow-root">
                          <Link
                            href="/analysis"
                            className="block py-2 text-base font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Analysis
                          </Link>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-800 py-6 flex flex-col">
                    {user ? (
                      <div className="space-y-4">
                        <div className="flex items-center px-1">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-slate-700 flex items-center justify-center">
                            <User className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                          </div>
                          <div className="ml-3">
                            <div className="text-base font-medium">{user.email?.split('@')[0] || 'User'}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>

                        <div className="space-y-1 px-1">
                          <Link
                            href="/profile"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-sm text-indigo-900 hover:bg-indigo-50 dark:text-white dark:hover:bg-slate-800 py-2 px-3 rounded-lg"
                          >
                            Your Profile
                          </Link>
                          <Link
                            href="/profile/reports"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-sm text-indigo-900 hover:bg-indigo-50 dark:text-white dark:hover:bg-slate-800 py-2 px-3 rounded-lg"
                          >
                            Your Reports
                          </Link>
                          <button
                            onClick={async () => {
                              await handleSignOut()
                              setMobileMenuOpen(false)
                            }}
                            className="block w-full text-left text-sm text-indigo-900 hover:bg-indigo-50 dark:text-white dark:hover:bg-slate-800 py-2 px-3 rounded-lg"
                          >
                            Sign out
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 px-1">
                        <div className="flow-root">
                          <Button asChild className="w-full justify-center bg-white hover:bg-gray-50 text-indigo-900 border border-indigo-200 rounded-lg">
                            <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                          </Button>
                        </div>

                        <div className="flow-root">
                          <Button asChild className="w-full justify-center bg-indigo-900 hover:bg-indigo-800 rounded-lg">
                            <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <main className="flex-1">{children}</main>

      <footer className="py-20 mt-20 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/20">
                  <Mic className="h-5 w-5" />
                </div>
                <span className="text-xl font-display font-semibold tracking-tight">VocalWell.ai</span>
              </div>
              <p className="text-muted-foreground max-w-xs text-gray-500 dark:text-gray-400 text-base">
                Harnessing AI to revolutionize voice health analysis and make it accessible to everyone.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-lg">Quick Links</h3>
              <ul className="space-y-4">
                <li><Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link></li>
                <li><Link href="/features" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</Link></li>
                <li><Link href="/resource-hub" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Resources</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-lg">Legal</h3>
              <ul className="space-y-4">
                <li><Link href="/terms" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/data-policy" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Data Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">© 2025 VocalWell.ai. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-6 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

