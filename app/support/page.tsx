"use client"

import { Heart, Users, DollarSign, Gift, HandHeart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { BRAND } from "@/lib/brand"
import type { DonationType } from "@/lib/data/forms"
import { PledgeForm, VolunteerApplyForm } from "./SupportForms"
import { MinistryPageShell } from "@/components/layout/MinistryPageShell"
import { MinistryContent } from "@/components/layout/MinistryContent"

export default function SupportPage() {
  const [volunteerRole, setVolunteerRole] = useState<string | null>(null)
  const [pledgeFor, setPledgeFor] = useState<string | null>(null)

  const joinPrayerTeam = () => {
    setVolunteerRole("Prayer Team")
    setTimeout(
      () => document.getElementById("prayer-team-apply")?.scrollIntoView({ behavior: "smooth", block: "center" }),
      50
    )
  }

  const volunteerOpportunities = [
    {
      title: "Worship Team",
      hours: 2,
      icon: Heart,
      description: "Join our music ministry as a vocalist, instrumentalist, or sound technician.",
      commitment: "2-3 hours/week",
      skills: "Musical ability, heart for worship",
      contact: "worship@cbusda.org"
    },
    {
      title: "Bible Study Leader",
      hours: 3,
      icon: Users,
      description: "Lead small group Bible studies and mentor new believers.",
      commitment: "3-4 hours/week",
      skills: "Biblical knowledge, teaching ability",
      contact: "biblestudy@cbusda.org"
    },
    {
      title: "Campus Outreach",
      hours: 4,
      icon: HandHeart,
      description: "Share the gospel through campus events and personal evangelism.",
      commitment: "4-5 hours/week",
      skills: "People skills, evangelistic heart",
      contact: "outreach@cbusda.org"
    },
    {
      title: "Media Ministry",
      hours: 2,
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
      type: "monthly" as DonationType,
      amount: "$25-100/month",
      description: "Become a regular supporter of our campus ministry programs and activities.",
      benefits: ["Monthly ministry updates", "Prayer request notifications", "Special events access"]
    },
    {
      title: "Event Sponsorship",
      type: "event_sponsorship" as DonationType,
      amount: "$100-500",
      description: "Sponsor specific events like evangelistic series, retreats, or community service projects.",
      benefits: ["Event recognition", "Impact reports", "Photo updates"]
    },
    {
      title: "Student Support",
      type: "student_support" as DonationType,
      amount: "$50-200",
      description: "Help cover costs for students attending conferences, retreats, or mission trips.",
      benefits: ["Student testimonials", "Thank you notes", "Progress updates"]
    },
    {
      title: "Ministry Resources",
      type: "one_time" as DonationType,
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
      eyebrow="Get involved"
      title="Serve, give & belong"
      subtitle="Join us in spreading God's love on campus through volunteering, financial support, and active participation in our mission."
    >
      <MinistryContent>
      {/* How to Get Involved */}
      <section id="support-content" className="py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-ink">How to Get Involved</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're a student, alumni, or community member, there's a place for you in our ministry.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {getInvolvedSteps.map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-navy/10 text-navy mb-6 text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-ink">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section className="py-12 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-ink">Volunteer Opportunities</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Use your gifts and talents to serve God and make a lasting impact on campus.
            </p>
          </div>
          
          <div className="space-y-6">
            {volunteerOpportunities.map((opportunity, index) => {
              const IconComponent = opportunity.icon
              return (
                <div key={index} className="rounded-2xl bg-white border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-navy/10 flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-navy" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold mb-2 text-ink">{opportunity.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{opportunity.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Time Commitment:</span>
                      <span className="text-ink">{opportunity.commitment}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Skills Needed:</span>
                      <span className="text-ink">{opportunity.skills}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Contact:</span>
                      <span className="text-ink">{opportunity.contact}</span>
                    </div>
                  </div>
                  
                  {volunteerRole === opportunity.title ? (
                    <VolunteerApplyForm
                      role={opportunity.title}
                      defaultHours={opportunity.hours}
                      onCancel={() => setVolunteerRole(null)}
                    />
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setVolunteerRole(opportunity.title)}
                      className="w-full bg-navy text-white hover:bg-navy/90 rounded-full"
                    >
                      Apply to Volunteer
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Financial Support */}
      <section className="py-12 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-ink">Financial Support</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your financial partnership helps us reach more students and expand our ministry impact.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contributionOptions.map((option, index) => (
              <div key={index} className="rounded-2xl bg-white border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-navy/10 mb-4">
                    <DollarSign className="w-6 h-6 text-navy" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-ink">{option.title}</h3>
                  <div className="text-2xl font-bold text-navy mb-3">{option.amount}</div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{option.description}</p>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-ink mb-3 text-sm">Benefits:</h4>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    {option.benefits.map((benefit, idx) => (
                      <li key={idx}>• {benefit}</li>
                    ))}
                  </ul>
                </div>
                
                {pledgeFor === option.title ? (
                  <PledgeForm
                    type={option.type}
                    purpose={option.title}
                    onCancel={() => setPledgeFor(null)}
                  />
                ) : (
                  <Button
                    type="button"
                    onClick={() => setPledgeFor(option.title)}
                    className="w-full bg-navy text-white hover:bg-navy/90 rounded-full"
                  >
                    Pledge Support
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prayer Support */}
      <section className="py-12 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-navy to-navy p-12 text-center text-white shadow-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/15 mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Prayer Support</h2>
            <p className="text-lg text-white/85 mb-8 leading-relaxed">
              Prayer is the foundation of our ministry. Join our prayer team and intercede for students, 
              ministry activities, and the spread of the gospel on campus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                type="button"
                onClick={joinPrayerTeam}
                className="bg-white text-navy hover:bg-white/90 rounded-full px-8 font-semibold shadow-lg"
              >
                Join Prayer Team
              </Button>
              <Button size="lg" variant="light" asChild>
                <Link href="/prayer-request">Submit Prayer Request</Link>
              </Button>
            </div>
            {volunteerRole === "Prayer Team" && (
              <div id="prayer-team-apply" className="mt-8 text-left text-ink max-w-xl mx-auto">
                <VolunteerApplyForm role="Prayer Team" defaultHours={1} onCancel={() => setVolunteerRole(null)} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <div className="rounded-3xl bg-white border border-border p-12 shadow-sm">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-ink">Ready to Get Involved?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Contact our ministry team to learn more about volunteer opportunities and how you can support our mission.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-navy text-white hover:bg-navy/90 rounded-full px-8 font-semibold" asChild>
                <a href={`mailto:${BRAND.email}?subject=${encodeURIComponent("Getting involved")}`}>Contact Ministry Team</a>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 border-border" asChild>
                <a href={`mailto:${BRAND.email}?subject=${encodeURIComponent("Meeting request")}`}>Schedule Meeting</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
      </MinistryContent>
    </MinistryPageShell>
  )
}