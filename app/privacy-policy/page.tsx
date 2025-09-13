import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            ← Back to home
          </Link>
        </div>

        <Card className="shadow-xl border-0">
          <CardContent className="p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">
              Privacy Policy for QuickMinutes
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <div className="space-y-8 text-gray-700 dark:text-gray-300">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  1. Introduction
                </h2>
                <p className="leading-relaxed">
                  Welcome to QuickMinutes (&apos;we,&apos; &apos;our,&apos; or
                  &apos;us&apos;). We are committed to protecting your personal
                  information and your right to privacy. This Privacy Policy
                  explains how we collect, use, disclose, and safeguard your
                  information when you use our service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  2. Information We Collect
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Personal Information
                    </h3>
                    <p className="leading-relaxed">
                      When you register for an account, we collect:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                      <li>Name</li>
                      <li>Email address</li>
                      <li>
                        Google account information (when using Google Sign-In)
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Meeting Data
                    </h3>
                    <p className="leading-relaxed">
                      When you upload audio files for transcription and
                      summarization, we store:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                      <li>The uploaded audio file</li>
                      <li>The generated transcript</li>
                      <li>The generated summary and action items</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Automatically Collected Information
                    </h3>
                    <p className="leading-relaxed">
                      We automatically collect certain information when you use
                      our service:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                      <li>IP address</li>
                      <li>Browser type and version</li>
                      <li>Device information</li>
                      <li>Usage data and analytics</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  3. How We Use Your Information
                </h2>
                <p className="leading-relaxed mb-3">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Provide and maintain our service</li>
                  <li>Create and manage your account</li>
                  <li>Transcribe and summarize your meetings</li>
                  <li>Send you important updates and notifications</li>
                  <li>Respond to your inquiries and support requests</li>
                  <li>Monitor and analyze usage patterns</li>
                  <li>Improve our service and develop new features</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  4. Data Sharing and Disclosure
                </h2>
                <p className="leading-relaxed mb-3">
                  We may share your information in the following situations:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    <strong>With your consent:</strong> We may share your
                    information for any purpose with your explicit consent
                  </li>
                  <li>
                    <strong>Service providers:</strong> We share data with
                    third-party vendors who assist in providing our services,
                    such as OpenAI for transcription and summarization.
                  </li>
                  <li>
                    <strong>Legal requirements:</strong> We may disclose
                    information if required by law or valid legal process
                  </li>
                  <li>
                    <strong>Business transfers:</strong> In connection with any
                    merger, sale, or acquisition
                  </li>
                  <li>
                    <strong>Protection of rights:</strong> To protect our
                    rights, privacy, safety, or property
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  5. Third-Party Services
                </h2>
                <p className="leading-relaxed">
                  We use the following third-party services that may collect
                  information:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>
                    <strong>Google Sign-In:</strong> For authentication services
                  </li>
                  <li>
                    <strong>Polar.sh:</strong> For handling
                    subscription payments
                  </li>
                  <li>
                    <strong>OpenAI:</strong> For transcription and summarization
                  </li>
                  <li>
                    <strong>Cloudflare R2:</strong> For storing audio files
                  </li>
                  <li>
                    <strong>Neon PostgreSQL:</strong> For database hosting
                  </li>
                </ul>
                <p className="mt-3 leading-relaxed">
                  These services have their own privacy policies governing the
                  use of your information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  6. Data Security
                </h2>
                <p className="leading-relaxed">
                  We implement appropriate technical and organizational security
                  measures to protect your personal information. Your audio
                  files are stored in a private Cloudflare R2 bucket and are
                  only accessible to you through our service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  7. Data Retention
                </h2>
                <p className="leading-relaxed">
                  We retain your personal information and meeting data for as
                  long as your account is active or as needed to provide you
                  with our services. You can delete your meetings at any time,
                  which will permanently delete the audio file, transcript, and
                  summary.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  8. Your Rights
                </h2>
                <p className="leading-relaxed mb-3">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    <strong>Access:</strong> Request access to your personal
                    information and meeting data.
                  </li>
                  <li>
                    <strong>Correction:</strong> Request correction of
                    inaccurate information.
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your account
                    and all associated data.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  9. Contact Us
                </h2>
                <p className="leading-relaxed">
                  If you have any questions about this Privacy Policy or our
                  data practices, please contact us at:
                </p>
                <div className="mt-3 space-y-1">
                  <p>Email: privacy@quickminutes.com</p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}