import React from 'react';

export const footerContent = {
  terms: (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-[#0F172A] dark:text-white">1. Acceptance of Terms</h4>
      <p>By accessing and using the Civic Shield portal, you agree to comply with and be bound by these Terms of Service. This portal is a government-facilitated initiative designed to bridge communication between citizens and municipal authorities.</p>
      
      <h4 className="text-lg font-bold text-[#0F172A] dark:text-white">2. User Responsibilities</h4>
      <p>Users must provide accurate information when reporting civic hazards. Misuse of the platform, including submitting false reports or inappropriate images, may result in restricted access or suspension of your account.</p>
      
      <h4 className="text-lg font-bold text-[#0F172A] dark:text-white">3. Liability and Disclaimers</h4>
      <p>While municipal corporations strive to address all reports in a timely manner, the Civic Shield portal does not guarantee immediate resolution. The platform is provided "as is," without warranties of any kind.</p>
    </div>
  ),
  privacy: (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-[#0F172A] dark:text-white">1. Data Protection</h4>
      <p>Your privacy is our utmost priority. We employ industry-standard encryption protocols to protect personal data submitted through the Civic Shield portal against unauthorized access, alteration, or destruction.</p>
      
      <h4 className="text-lg font-bold text-[#0F172A] dark:text-white">2. User Consent</h4>
      <p>By using our services, you consent to the collection and processing of your data, including location information attached to hazard reports, solely for the purpose of civic redressal and infrastructural improvement.</p>
      
      <h4 className="text-lg font-bold text-[#0F172A] dark:text-white">3. How Reports are Processed</h4>
      <p>Report data is securely routed to the relevant municipal authority. Personally identifiable information is kept confidential and only shared with authorized personnel required to resolve the ticket.</p>
    </div>
  ),
  dataRetention: (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-[#0F172A] dark:text-white">1. Retention Period</h4>
      <p>Civic hazard reports and associated media are retained on our servers for a period of 5 years to support historical analytics, urban planning, and administrative audits.</p>
      
      <h4 className="text-lg font-bold text-[#0F172A] dark:text-white">2. Account Data Deletion</h4>
      <p>If you choose to delete your Civic Shield account, your personal identifying data will be removed within 30 days. However, anonymized hazard reports will remain in the system for statistical analysis.</p>
    </div>
  ),
  documentation: (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-[#0F172A] dark:text-white">Getting Started</h4>
      <p>The Civic Shield portal allows citizens to report public infrastructure issues directly to their local municipal corporation. To create a report, navigate to the "Report" tab, take a photo of the hazard, and submit it with a brief description.</p>
      
      <h4 className="text-lg font-bold text-[#0F172A] dark:text-white">Tracking Your Report</h4>
      <p>Once submitted, your report will be assigned a unique tracking ID. You can monitor its status from the "Dashboard" as it moves from "Pending Action" to "Resolved."</p>
      
      <h4 className="text-lg font-bold text-[#0F172A] dark:text-white">AI Validation</h4>
      <p>Our platform uses an AI validation system to confirm that uploaded images contain genuine civic hazards (like potholes or broken streetlights) before they are dispatched to field workers.</p>
    </div>
  ),
  systemStatus: (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold mb-4">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <span>All Systems Operational</span>
      </div>
      <p><strong>API Gateway:</strong> Online (99.9% Uptime)</p>
      <p><strong>AI Diagnostic Engine:</strong> Online</p>
      <p><strong>Ticket Dispatcher:</strong> Online</p>
      <p><strong>Database Replication:</strong> Synchronized</p>
    </div>
  ),
  supportDesk: (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-[#0F172A] dark:text-white">Citizen Support Desk</h4>
      <p>Need help with your account or a specific ticket? Our support desk operates 24/7 to assist you with technical issues and general inquiries.</p>
      
      <p><strong>Email:</strong> support@civicshield.gov</p>
      <p><strong>Toll-Free Hotline:</strong> 1800-CIVIC-HELP</p>
      
      <p className="mt-4">For immediate assistance with life-threatening emergencies, please contact your local emergency services directly.</p>
    </div>
  ),
  dashboard: (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-[#0F172A] dark:text-white">Municipal Dashboard</h4>
      <p>Welcome to the consolidated municipal dashboard. This view provides a high-level overview of active dispatches, resolution efficiency, and inter-ward ticket distributions.</p>
      <p className="italic text-slate-500 mt-4">Advanced analytics are currently restricted to authorized municipal officers.</p>
    </div>
  ),
  coverageMaps: (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-[#0F172A] dark:text-white">Coverage Maps</h4>
      <p>Our live coverage maps display the geographical distribution of reported civic hazards across the city. This data helps administrators identify problem hotspots and allocate resources efficiently.</p>
    </div>
  ),
  liveFeeds: (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-[#0F172A] dark:text-white">Live Camera Feeds</h4>
      <p>Integration with municipal traffic and security cameras allows our AI systems to proactively detect infrastructure damage without requiring citizen reports.</p>
    </div>
  ),
  regionalImpact: (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-[#0F172A] dark:text-white">Regional Impact Analytics</h4>
      <p>Explore the long-term impact of the Civic Shield initiative. View metrics on improved dispatch times, total hazards resolved, and citizen satisfaction scores.</p>
    </div>
  )
};
