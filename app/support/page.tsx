"use client"

import { Heart, Users, DollarSign, Clock, Gift, HandHeart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
    <div className="min-h-screen bg-[#0B0F12] text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <Link href="/" className="flex items-center gap-4 px-6 py-3 bg-black/60 ring-1 ring-white/30 backdrop-blur rounded-full">
          <img src="/logo (2).png" alt="Logo" className="w-12 h-12 object-contain" />
        </Link>
        <Button asChild className="bg-white text-black hover:bg-white/90 rounded-full px-6">
          <Link href="/">Back to Home</Link>
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6 px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full inline-block">
            <span className="text-sm font-medium">Get Involved</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">Support Our Ministry</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12">
            Join us in spreading God's love on campus through volunteering, financial support, and active participation in our mission.
          </p>
        </div>
      </section>

      {/* How to Get Involved */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How to Get Involved</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Whether you're a student, alumni, or community member, there's a place for you in our ministry.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {getInvolvedSteps.map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 ring-1 ring-white/20 mb-6 text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-white/80 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Volunteer Opportunities</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Use your gifts and talents to serve God and make a lasting impact on campus.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {volunteerOpportunities.map((opportunity, index) => {
              const IconComponent = opportunity.icon
              return (
                <div key={index} className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 hover:bg-white/10 transition-colors">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 ring-1 ring-white/20 flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold mb-2">{opportunity.title}</h3>
                      <p className="text-white/80 leading-relaxed">{opportunity.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Time Commitment:</span>
                      <span className="text-white/90">{opportunity.commitment}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Skills Needed:</span>
                      <span className="text-white/90">{opportunity.skills}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Contact:</span>
                      <span className="text-white/90">{opportunity.contact}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-white text-black hover:bg-white/90 rounded-full">
                    Apply to Volunteer
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Financial Support */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Financial Support</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Your financial partnership helps us reach more students and expand our ministry impact.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contributionOptions.map((option, index) => (
              <div key={index} className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-6 hover:bg-white/10 transition-colors">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 ring-1 ring-white/20 mb-4">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                  <div className="text-2xl font-bold text-white/90 mb-3">{option.amount}</div>
                  <p className="text-white/80 text-sm leading-relaxed">{option.description}</p>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-white/90 mb-3 text-sm">Benefits:</h4>
                  <ul className="text-white/70 text-sm space-y-1">
                    {option.benefits.map((benefit, idx) => (
                      <li key={idx}>• {benefit}</li>
                    ))}
                  </ul>
                </div>
                
                <Button className="w-full bg-white text-black hover:bg-white/90 rounded-full">
                  Contribute
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prayer Support */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 ring-1 ring-white/20 mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Prayer Support</h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Prayer is the foundation of our ministry. Join our prayer team and intercede for students, 
              ministry activities, and the spread of the gospel on campus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-8">
                Join Prayer Team
              </Button>
              <Button size="lg" variant="outline" className="bg-black/40 ring-1 ring-white/20 backdrop-blur border-0 text-white hover:bg-black/50 rounded-full px-8">
                Submit Prayer Request
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Involved?</h2>
            <p className="text-xl text-white/80 mb-8">
              Contact our ministry team to learn more about volunteer opportunities and how you can support our mission.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-8">
                Contact Ministry Team
              </Button>
              <Button size="lg" variant="outline" className="bg-black/40 ring-1 ring-white/20 backdrop-blur border-0 text-white hover:bg-black/50 rounded-full px-8">
                Schedule Meeting
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}