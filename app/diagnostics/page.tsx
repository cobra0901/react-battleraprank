import ConnectionTester from "@/components/diagnostics/ConnectionTester"
import ConnectionStatus from "@/components/diagnostics/ConnectionStatus"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function DiagnosticsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">System Diagnostics</h1>
      <p className="text-gray-500">
        Use this page to diagnose connection issues with the Battle Rap Rating application.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ConnectionStatus />
        <ConnectionTester />
      </div>

      <Card className="w-full max-w-3xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Troubleshooting Guide</CardTitle>
          <CardDescription>Common solutions for connection issues</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="supabase">
              <AccordionTrigger>Supabase Connection Issues</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Verify your Supabase URL and anon key in your environment variables</li>
                  <li>Check if your Supabase project is active and not in maintenance mode</li>
                  <li>Ensure your IP address is not blocked by Supabase</li>
                  <li>Check your browser console for CORS errors</li>
                  <li>Verify your database is not paused due to inactivity</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="auth">
              <AccordionTrigger>Authentication Issues</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Clear your browser cookies and local storage</li>
                  <li>Ensure your Supabase auth configuration is correct</li>
                  <li>Check if you have the correct redirect URLs configured</li>
                  <li>Verify your OAuth providers are properly set up (if using social login)</li>
                  <li>Check if your JWT token is expired</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="email">
              <AccordionTrigger>Email Service Issues</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Verify your email service provider is operational</li>
                  <li>Check if you've reached your email sending limits</li>
                  <li>Ensure your email templates are correctly configured</li>
                  <li>Check spam folders for verification emails</li>
                  <li>Verify your domain has proper SPF and DKIM records</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="youtube">
              <AccordionTrigger>YouTube API Issues</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Verify your YouTube API key is valid and not expired</li>
                  <li>Check if you've exceeded your YouTube API quota</li>
                  <li>Ensure you have the correct API permissions enabled</li>
                  <li>Verify the YouTube videos you're trying to access exist and are public</li>
                  <li>Check for any regional restrictions that might affect API access</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="network">
              <AccordionTrigger>General Network Issues</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Check your internet connection</li>
                  <li>Try disabling any VPN or proxy services</li>
                  <li>Clear your browser cache</li>
                  <li>Try a different browser</li>
                  <li>Check if your firewall is blocking connections</li>
                  <li>Verify DNS settings are correct</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
