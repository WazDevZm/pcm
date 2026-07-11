"use client"

import { Heart, Users, DollarSign, Gift, HandHeart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MinistryPageShell } from "@/components/layout/MinistryPageShell"
import { MinistryContent } from "@/components/layout/MinistryContent"
import { ScrollToBottom } from "@/components/ui/scroll-to-bottom"

export default function SupportPage() {
  const volunteerOpportunities = [
    {
      title: "Worship Team",
      icon: Heart,
      description: "Join our music ministry as a vocalist, instrumentalist, or sound technician.",
      commitment: "2-3 hours/week",
      skills: "Musical ability, heart for worship",
      contact: "worship@cbusda.org"
    },
    {
      title: "Bible Study Leader",
      icon: Users,
      description: "Lead small group Bible studies and mentor new believers.",
      commitment: "3-4 hours/week",
      skills: "Biblical knowledge, teaching ability",
      contact: "biblestudy@cbusda.org"
    },
    {
      title: "Campus Outreach",
      icon: HandHeart,
      description: "Share the gospel through campus events and personal evangelism.",
      commitment: "4-5 hours/week",
      skills: "People skills, evangelistic heart",
      contact: "outreach@cbusda.org"
    },
    {
      title: "Media Ministry",
      icon: Gift,
      description: "Help with live streaming, social media, and digital content creation.",
      commitment: "2-3 hours/week",
      skills: "Technical skills, creativity",
      contact: "media@cbusda.org"
    }
  ]

  const contributionOptions = [
    {
      title: "Monthly Partnership",
      amount: "$25-100/month",
      description: "Become a regular supporter of our campus ministry programs and activities.",
      benefits: ["Monthly ministry updates", "Prayer request notifications", "Special events access"]
    },
    {
      title: "Event Sponsorship",
      amount: "$100-500",
      description: "Sponsor specific events like evangelistic series, retreats, or community service projects.",
      benefits: ["Event recognition", "Impact reports", "Photo updates"]
    },
    {
      title: "Student Support",
      amount: "$50-200",
      description: "Help cover costs for students attending conferences, retreats, or mission trips.",
      benefits: ["Student testimonials", "Thank you notes", "Progress updates"]
    },
    {
      title: "Ministry Resources",
      amount: "$20-100",
      description: "Fund Bible study materials, devotional books, and evangelistic literature.",
      benefits: ["Resource lists", "Distribution reports", "Student feedback"]
    }
  ]

  const getInvolvedSteps = [
    {
      step: "1",
      title: "Attend a Service",
      description: "Join us for worship and experience our community firsthand."
    },
    {
      step: "2",
      title: "Meet the Team",
      description: "Connect with our ministry leaders and learn about opportunities."
    },
    {
      step: "3",
      title: "Find Your Fit",
      description: "Discover where your gifts and passions align with our mission."
    },
    {
      step: "4",
      title: "Start Serving",
      description: "Begin making a difference in the lives of students and community."
    }
  ]

  return (
    <MinistryPageShell
      heroImage="/Features/KCM_0741.jpg"
      title="Support Our Ministry"
      subtitle="Join us in spreading God's love on campus through volunteering, financial support, and active participation in our mission."
    >
      <ScrollToBottom targetId="support-content" label="Scroll" />
      <MinistryContent>
      {/* How to Get Involved */}
      <section id="support-content" className="py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0B0F12]">How to Get Involved</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you're a student, alumni, or community member, there's a place for you in our ministry.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {getInvolvedSteps.map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0f2d6e]/10 text-[#0f2d6e] mb-6 text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[#0B0F12]">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section className="py-12 border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0B0F12]">Volunteer Opportunities</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Use your gifts and talents to serve God and make a lasting impact on campus.
            </p>
          </div>
          
          <div className="space-y-6">
            {volunteerOpportunities.map((opportunity, index) => {
              const IconComponent = opportunity.icon
              return (
                <div key={index} className="rounded-2xl bg-white ring-1 ring-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0f2d6e]/10 flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-[#0f2d6e]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold mb-2 text-[#0B0F12]">{opportunity.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{opportunity.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Time Commitment:</span>
                      <span className="text-gray-800">{opportunity.commitment}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Skills Needed:</span>
                      <span className="text-gray-800">{opportunity.skills}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Contact:</span>
                      <span className="text-gray-800">{opportunity.contact}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-[#0f2d6e] text-white hover:bg-[#0f2d6e]/90 rounded-full">
                    Apply to Volunteer
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Financial Support */}
      <section className="py-12 border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0B0F12]">Financial Support</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your financial partnership helps us reach more students and expand our ministry impact.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contributionOptions.map((option, index) => (
              <div key={index} className="rounded-2xl bg-white ring-1 ring-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0f2d6e]/10 mb-4">
                    <DollarSign className="w-6 h-6 text-[#0f2d6e]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-[#0B0F12]">{option.title}</h3>
                  <div className="text-2xl font-bold text-[#0f2d6e] mb-3">{option.amount}</div>
                  <p className="text-gray-600 text-sm leading-relaxed">{option.description}</p>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3 text-sm">Benefits:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    {option.benefits.map((benefit, idx) => (
                      <li key={idx}>• {benefit}</li>
                    ))}
                  </ul>
                </div>
                
                <Button className="w-full bg-[#0f2d6e] text-white hover:bg-[#0f2d6e]/90 rounded-full">
                  Contribute
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prayer Support */}
      <section className="py-12 border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-[#0f2d6e] to-[#1a3a7a] p-12 text-center text-white shadow-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/15 mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Prayer Support</h2>
            <p className="text-lg text-white/85 mb-8 leading-relaxed">
              Prayer is the foundation of our ministry. Join our prayer team and intercede for students, 
              ministry activities, and the spread of the gospel on campus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-[#0f2d6e] hover:bg-white/90 rounded-full px-8 font-semibold shadow-lg">
                Join Prayer Team
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white/40 text-white hover:bg-white/15 hover:border-white/60 rounded-full px-8 font-semibold" asChild>
                <Link href="/prayer-request">Submit Prayer Request</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="rounded-3xl bg-white ring-1 ring-gray-200 p-12 shadow-sm">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#0B0F12]">Ready to Get Involved?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Contact our ministry team to learn more about volunteer opportunities and how you can support our mission.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#0f2d6e] text-white hover:bg-[#0f2d6e]/90 rounded-full px-8 font-semibold">
                Contact Ministry Team
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 border-gray-300">
                Schedule Meeting
              </Button>
            </div>
          </div>
        </div>
      </section>
      </MinistryContent>
    </MinistryPageShell>
  )
}