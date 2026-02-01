"use client"

import { Heart, Shield, Clock, Phone, Mail, MessageCircle, User, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CounselingPage() {
  const counselingServices = [
    {
      title: "Personal Counseling",
      icon: User,
      description: "One-on-one sessions addressing personal struggles, anxiety, depression, and life transitions.",
      duration: "50 minutes",
      availability: "Mon-Fri, 9 AM - 5 PM",
      approach: "Biblical counseling with professional care"
    },
    {
      title: "Relationship Counseling",
      icon: Heart,
      description: "Guidance for dating relationships, friendships, and family conflicts from a Christian perspective.",
      duration: "60 minutes",
      availability: "Tue, Thu, Sat",
      approach: "Scripture-based relationship principles"
    },
    {
      title: "Academic Stress Support",
      icon: Shield,
      description: "Help managing academic pressure, study habits, and balancing faith with educational goals.",
      duration: "45 minutes",
      availability: "Mon-Wed-Fri",
      approach: "Practical strategies with spiritual foundation"
    },
    {
      title: "Crisis Intervention",
      icon: Phone,
      description: "Immediate support for students facing crisis situations or emergency mental health needs.",
      duration: "As needed",
      availability: "24/7 Emergency Line",
      approach: "Immediate care with follow-up support"
    }
  ]

  const counselors = [
    {
      name: "Dr. Sarah Johnson",
      title: "Licensed Professional Counselor",
      specialties: ["Anxiety & Depression", "Trauma Recovery", "Faith Integration"],
      experience: "12 years",
      education: "PhD in Clinical Psychology, MA in Biblical Counseling",
      image: "/placeholder-user.jpg"
    },
    {
      name: "Pastor Michael Rodriguez",
      title: "Pastoral Counselor",
      specialties: ["Spiritual Direction", "Life Purpose", "Relationship Issues"],
      experience: "8 years",
      education: "MDiv, Certified Biblical Counselor",
      image: "/placeholder-user.jpg"
    },
    {
      name: "Dr. Emily Chen",
      title: "Marriage & Family Therapist",
      specialties: ["Family Dynamics", "Dating Relationships", "Communication"],
      experience: "10 years",
      education: "PhD in Marriage & Family Therapy, MA in Counseling",
      image: "/placeholder-user.jpg"
    }
  ]

  const supportGroups = [
    {
      name: "Anxiety & Depression Support",
      schedule: "Wednesdays 7:00 PM",
      description: "Peer support group for students dealing with anxiety and depression.",
      facilitator: "Dr. Sarah Johnson"
    },
    {
      name: "Grief & Loss Support",
      schedule: "Thursdays 6:30 PM",
      description: "Support for students processing loss of loved ones or significant life changes.",
      facilitator: "Pastor Michael Rodriguez"
    },
    {
      name: "Addiction Recovery",
      schedule: "Fridays 7:00 PM",
      description: "Christ-centered recovery support for various addictions and dependencies.",
      facilitator: "Dr. Emily Chen"
    },
    {
      name: "Academic Stress Management",
      schedule: "Tuesdays 5:00 PM",
      description: "Strategies for managing academic pressure and maintaining mental health.",
      facilitator: "Dr. Sarah Johnson"
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
            <span className="text-sm font-medium">Mental Health & Spiritual Care</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">Counseling Services</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12">
            Professional counseling and spiritual guidance for students seeking support, healing, and personal growth in a safe, confidential environment.
          </p>
          
          {/* Emergency Contact */}
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-red-600/20 ring-1 ring-red-500/30 backdrop-blur rounded-full mb-8">
            <Phone className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium">Crisis Hotline: (555) 123-HELP</span>
          </div>
        </div>
      </section>

      {/* Counseling Services */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Comprehensive counseling services addressing the whole person - mind, body, and spirit.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {counselingServices.map((service, index) => {
              const IconComponent = service.icon
              return (
                <div key={index} className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 hover:bg-white/10 transition-colors">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 ring-1 ring-white/20 flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                      <p className="text-white/80 leading-relaxed mb-4">{service.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Session Length:</span>
                      <span className="text-white/90">{service.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Availability:</span>
                      <span className="text-white/90">{service.availability}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Approach:</span>
                      <span className="text-white/90">{service.approach}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-white text-black hover:bg-white/90 rounded-full">
                    Schedule Appointment
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Counselors */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Counselors</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Licensed professionals committed to integrating faith and mental health care.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {counselors.map((counselor, index) => (
              <div key={index} className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 text-center hover:bg-white/10 transition-colors">
                <div className="mb-6">
                  <img 
                    src={counselor.image} 
                    alt={counselor.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4 ring-2 ring-white/20"
                  />
                  <h3 className="text-xl font-semibold mb-1">{counselor.name}</h3>
                  <p className="text-white/70 text-sm">{counselor.title}</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-semibold text-white/90 mb-2 text-sm">Specialties:</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {counselor.specialties.map((specialty, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white/10 ring-1 ring-white/20 rounded-full text-xs text-white/80">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-white/60">Experience:</span>
                      <span className="text-white/90">{counselor.experience}</span>
                    </div>
                    <div className="text-white/70 text-xs leading-relaxed">
                      {counselor.education}
                    </div>
                  </div>
                </div>
                
                <Button className="w-full bg-white text-black hover:bg-white/90 rounded-full">
                  Book with {counselor.name.split(' ')[1]}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Groups */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Support Groups</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Connect with others facing similar challenges in a supportive, faith-based environment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {supportGroups.map((group, index) => (
              <div key={index} className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
                    <p className="text-white/80 text-sm leading-relaxed">{group.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Schedule:</span>
                    <span className="text-white/90">{group.schedule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Facilitator:</span>
                    <span className="text-white/90">{group.facilitator}</span>
                  </div>
                </div>
                
                <Button className="w-full bg-white text-black hover:bg-white/90 rounded-full">
                  Join Group
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Confidentiality & Approach */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-12">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 ring-1 ring-white/20 mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Approach</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Confidential & Safe</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  All counseling sessions are completely confidential and conducted in a safe, 
                  non-judgmental environment where you can share openly.
                </p>
                <ul className="text-white/70 text-sm space-y-2">
                  <li>• HIPAA compliant privacy protection</li>
                  <li>• Professional ethical standards</li>
                  <li>• Secure, private meeting spaces</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Faith-Integrated Care</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  We integrate biblical principles with evidence-based therapeutic approaches 
                  to address the whole person - mind, body, and spirit.
                </p>
                <ul className="text-white/70 text-sm space-y-2">
                  <li>• Scripture-based guidance</li>
                  <li>• Prayer and spiritual support</li>
                  <li>• Professional therapeutic methods</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Scheduling */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Get Help Today</h2>
              <p className="text-xl text-white/80 mb-8">
                Taking the first step toward healing and growth is courageous. We're here to support you.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 rounded-2xl bg-white/5 ring-1 ring-white/10">
                <Phone className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-white/70 text-sm">(555) 123-CARE</p>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white/5 ring-1 ring-white/10">
                <Mail className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-white/70 text-sm">counseling@cbusda.org</p>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-white/5 ring-1 ring-white/10">
                <MessageCircle className="w-8 h-8 text-white mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Text</h3>
                <p className="text-white/70 text-sm">(555) 123-TEXT</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-8">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Appointment
              </Button>
              <Button size="lg" variant="outline" className="bg-black/40 ring-1 ring-white/20 backdrop-blur border-0 text-white hover:bg-black/50 rounded-full px-8">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}