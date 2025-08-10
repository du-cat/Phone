import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  Mic, 
  MessageSquare, 
  Users, 
  Calendar, 
  Settings,
  BarChart3
} from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Voice Receptionist',
  description: 'Intelligent phone system powered by AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-gray-50">
          {/* Sidebar */}
          <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
            <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Phone className="w-8 h-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">AI Receptionist</span>
              </div>
              <div className="mt-8 flex-grow flex flex-col">
                <nav className="flex-1 px-2 space-y-1">
                  <Link
                    href="/"
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-50"
                  >
                    <BarChart3 className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                    Dashboard
                  </Link>
                  <Link
                    href="/numbers"
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Phone className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                    Phone Numbers
                  </Link>
                  <Link
                    href="/voice-profiles"
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Mic className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                    Voice Profiles
                  </Link>
                  <Link
                    href="/scripts"
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <MessageSquare className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                    Scripts
                  </Link>
                  <Link
                    href="/calls"
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Users className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                    Call History
                  </Link>
                  <Link
                    href="/settings"
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Settings className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                    Settings
                  </Link>
                </nav>
                <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                  <Link href="/onboarding/wizard" className="w-full">
                    <Button variant="outline" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Setup Wizard
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:pl-64 flex flex-col flex-1">
            <main className="flex-1">
              {children}
            </main>
          </div>
        </div>

        {/* Mobile menu button - you can add mobile navigation here if needed */}
        <div className="lg:hidden fixed bottom-4 right-4">
          <Link href="/onboarding/wizard">
            <Button className="rounded-full w-14 h-14 shadow-lg">
              <Settings className="w-6 h-6" />
            </Button>
          </Link>
        </div>
      </body>
    </html>
  );
}
