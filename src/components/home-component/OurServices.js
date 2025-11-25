"use client"
import React, { useState } from 'react'

// SVG Icons
function ServiceIcon({ name }) {
  const size = 24
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', 'aria-hidden': true }

  switch ((name || '').toLowerCase()) {
    case 'general engineering services':
      return (
        <svg {...common} stroke="currentColor" className="text-white">
          <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" />
          <path strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a7.5 7.5 0 00.6-2.5 7.5 7.5 0 00-.6-2.5l2.1-1.6-1.8-3.1-2.5 1a8 8 0 00-2.2-1.3L14.6 1h-4l-.9 4.1a7.9 7.9 0 00-2.2 1.3l-2.5-1L2.9 8.4 5 10a7.5 7.5 0 000 5l-2.1 1.6 1.8 3.1 2.5-1c.6.5 1.3.9 2.2 1.3L10.6 23h4l.9-4.1c.8-.3 1.6-.8 2.2-1.3l2.5 1 1.8-3.1L19.4 15z" />
        </svg>
      )
    case 'telecoms services':
      return (
        <svg {...common} stroke="currentColor" className="text-white">
          <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 20v-4m0-8V4m4 16a8 8 0 10-8 0" />
        </svg>
      )
    case 'building & construction services':
      return (
        <svg {...common} stroke="currentColor" className="text-white">
          <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V10l7-4 7 4v11" />
        </svg>
      )
    case 'sales and distribution of telecoms equipment and materials':
      return (
        <svg {...common} stroke="currentColor" className="text-white">
          <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M7 7v14m10-14v14M3 7l4-4h10l4 4" />
        </svg>
      )
    case 'supply & distribution of building materials':
      return (
        <svg {...common} stroke="currentColor" className="text-white">
          <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l1.2-6H6.2L7 13zM7 13l-1 7h12l-1-7" />
        </svg>
      )
    case 'procurement services':
      return (
        <svg {...common} stroke="currentColor" className="text-white">
          <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    case 'project management services':
      return (
        <svg {...common} stroke="currentColor" className="text-white">
          <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M12 3v3M5 6h14" />
        </svg>
      )
    case 'risk management services':
      return (
        <svg {...common} stroke="currentColor" className="text-white">
          <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 2l8 4v6c0 5-3.6 9.7-8 11-4.4-1.3-8-6-8-11V6l8-4z" />
          <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 8v4" />
        </svg>
      )
    case 'training and manpower development':
      return (
        <svg {...common} stroke="currentColor" className="text-white">
          <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M17 20v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" strokeWidth="1.5" />
        </svg>
      )
    case 'corporate social responsibility':
      return (
        <svg {...common} stroke="currentColor" className="text-white">
          <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292m0 0H8.646a4 4 0 010-5.292m3.354 0l-3.535 3.535M9 20h6m-6 0a9 9 0 110-18 9 9 0 010 18z" />
        </svg>
      )
    default:
      return (
        <svg {...common} stroke="currentColor" className="text-white">
          <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
        </svg>
      )
  }
}

// Modal Component
function ServiceModal({ service, isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-linear-to-r from-indigo-600 to-blue-600 text-white p-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-400 bg-opacity-20 rounded-lg flex items-center justify-center">
              <ServiceIcon name={service.title}/>
            </div>
            <h2 className="text-2xl font-bold">{service.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4 text-gray-700">
          {service.details.map((detail, idx) => (
            <div key={idx}>
              {detail.section && (
                <h3 className="text-lg font-semibold text-indigo-600 mb-3">{detail.section}</h3>
              )}
              {detail.text && (
                <p className="leading-relaxed">{detail.text}</p>
              )}
              {detail.items && (
                <ul className="space-y-2 ml-4">
                  {detail.items.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-6 border-t text-center">
          <button
            onClick={onClose}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

const services = [
  {
    title: 'Engineering Services',
    shortDesc: 'Design, planning and technical delivery across civil and infrastructure projects.',
    icon: 'general engineering services',
    color: 'from-indigo-600 to-indigo-700',
    details: [
      { text: 'At Rayob Engineering & Mgt. Co. Ltd, we provide comprehensive engineering services that combine technical excellence, practical experience, and innovative solutions. Our Team of experts in the engineering and management sectors is ably led by our MD/CEO, a distinguished registered Engineer with many years of experience in Engineering and management across construction and telecom sectors. Rayob Engineering & Mgt. Co. Ltd delivers solutions that meet the highest standards of safety, efficiency, and performance.' },
      { section: 'Our Scope of Engineering Services', items: ['Civil and Structural Engineering - Design, analysis, and construction supervision for buildings, bridges, and infrastructure', 'Mechanical and Electrical Engineering - Design and installation of mechanical and electrical systems', 'Telecommunications and Network Engineering - Design and implementation of fibre optic networks', 'Project and Construction Management - End-to-end project planning and execution', 'Consultancy and Advisory Services - Feasibility studies, technical audits, and improvement recommendations'] },
      { section: 'Our Approach', items: ['Technical Expertise - Leveraging years of multidisciplinary experience', 'Integrated Solutions - Combining civil, electrical, mechanical, and telecom expertise', 'Quality, Safety, and Compliance - Adherence to ISO, IEC, and ITU standards', 'Client-Centered Execution - Customized solutions with ongoing support'] }
    ]
  },
  {
    title: 'Telecoms Services',
    shortDesc: 'End-to-end telecommunications services including network rollout and optimization.',
    icon: 'telecoms services',
    color: 'from-blue-600 to-blue-700',
    details: [
      { text: 'At Rayob Engineering & Mgt. Co. Ltd, we provide comprehensive telecommunications services that enable operators, enterprises, and government agencies to deploy, upgrade, and maintain high-performance networks. Leveraging years of industry experience and a team of skilled engineers, we deliver solutions that meet the evolving demands of the digital age.' },
      { section: 'Our Scope of Telecommunications Services', items: ['Fibre Optic Network Design and Deployment - Planning, design, and execution of aerial and underground networks', 'Network Infrastructure Installation and Maintenance - Installation of passive and active components', 'Project Management for Telecom Networks - End-to-end management of telecom rollout projects', 'Transmission and Core Network Solutions - Deployment of transmission equipment and modern networking technologies', 'Consultancy and Technical Advisory Services - Feasibility studies and network audits'] },
      { section: 'Our Value Proposition', items: ['Comprehensive Services - From consultancy to deployment and maintenance', 'Experienced Leadership - Extensive project management and engineering expertise', 'Reliable Partnerships - Strong relationships with global suppliers', 'Future-Ready Solutions - 5G-ready and scalable network infrastructure'] }
    ]
  },
  {
    title: 'Optical fibre implementation & maintenance.',
    shortDesc: 'Optical fibre network implementation and maintenance services for telecoms infrastructure.',
    icon: 'optical fibre implementation & maintenance',
    color: 'from-orange-600 to-orange-700',
    details: [
      { text: 'At Rayob Engineering & Mgt. Co. Ltd, we provide expert optical fibre network implementation and maintenance services. Our team ensures high-quality installation, testing, and ongoing support to maintain optimal network performance and reliability.' },
      { section: 'Our Scope of Optical Fibre Services', items: ['Optical Fibre Network Design and Planning', 'Fibre Optic Cable Installation (Aerial and Underground)', 'Splicing and Termination Services', 'Network Testing and Troubleshooting', 'Preventive and Corrective Maintenance', 'FTTH (Fiber to the Home) Deployment'] },
      { section: 'Why Choose At Rayob Engineering & Mgt. Co. Ltd', items: ['At Rayob Engineering & Mgt. Co. Ltd, we deliver end-to-end fibre optic solutions designed to support mission-critical communication networks with unmatched reliability and performance. Our experience, technical expertise, and commitment to quality make us the trusted partner for telecom operators, ISPs, enterprises, and infrastructure providers across the region.'] }
    ]
  },
  {
    title: 'Building & Construction Services',
    shortDesc: 'Civil and building works delivered to specification, on time and on budget.',
    icon: 'building & construction services',
    color: 'from-green-600 to-green-700',
    details: [
      { text: 'At Rayob Engineering & Mgt Co. Ltd., we bring almost twenty years of hands-on experience in the building/construction and Telecoms industries to provide cutting-edge engineering and management services. Our combination of technical excellence and practical expertise enable us to deliver construction solutions that are structurally sound, cost-effective, and sustainable.' },
      { section: 'Our Scope of Services', items: ['Civil Engineering Works - Design and execution of structural and infrastructural projects', 'Building Construction - Turnkey construction services from planning to delivery', 'Renovation & Refurbishment - Modernization of existing structures', 'Project Management - End-to-end oversight ensuring adherence to timelines and budgets', 'Specialized Civil Works - Earthworks, road construction, foundation engineering'] },
      { section: 'Why Choose Rayob', items: ['Decades of Expertise - Our engineering leadership and practical experience', 'Integrated Services - From design to completion, seamless experience', 'Cost-Effective Solutions - Smart engineering with efficient project management', 'Sustainable Practices - Environmentally responsible building techniques'] }
    ]
  },
  {
    title: 'Procurement Services',
    shortDesc: 'End-to-end procurement solutions ensuring quality, efficiency, and transparency.',
    icon: 'procurement services',
    color: 'from-pink-600 to-pink-700',
    details: [
      { text: 'At Rayob Engineering & Mgt. Co. Ltd, we provide end-to-end procurement solutions that ensure seamless project delivery, cost efficiency, and uncompromised quality. With a strong network of reputable manufacturers and distributors, Rayob Engineering & Mgt. Co. Ltd delivers procurement excellence.' },
      { section: 'Our Procurement Expertise Includes', items: ['Vendor Sourcing & Prequalification - Identifying reliable suppliers', 'Material & Equipment Procurement - High-grade engineering materials', 'Contract & Purchase Order Management - Ensuring accuracy and compliance', 'Logistics Coordination & Delivery Management - Efficient handling and delivery', 'Quality Assurance & Inspection - Thorough verification of materials', 'Cost Control & Market Price Analysis - Competitive pricing optimization', 'Procurement Risk Management - Structured risk assessment'] },
      { section: 'Our Commitment', text: 'At Rayob, procurement is more than sourcing — it is a strategic service designed to guarantee project success.' }
    ]
  },
  {
    title: 'Sales and Distribution of Telecoms Equipment and Materials',
    shortDesc: 'Telecoms equipment and building materials distribution across regions.',
    icon: 'sales and distribution of telecoms equipment and materials',
    color: 'from-yellow-600 to-yellow-700',
    details: [
      { text: 'At Rayob Engineering & Mgt. Co. Ltd, we understand that the efficiency, reliability, and expansion of modern telecommunications networks depend on the availability of high-quality materials and equipment. Our Sales and Distribution division is strategically positioned to supply operators, contractors, and infrastructure providers with world-class telecoms products.' },
      { section: 'Our Scope of Telecoms Materials and Equipment', items: ['Fibre Optic Cables (Aerial & Underground)', 'HDPE Ducts, Sub-ducts, and Conduits', 'Optical Distribution Frames, Joint Closures, and Splicing Accessories', 'Transmission and IP Core Network Hardware', 'Power Systems including rectifiers, inverters, and UPS units', 'FTTH Installation Tools & Last-Mile Accessories'] },
      { section: 'Our Value to the Telecoms Industry', items: ['Guaranteed product quality and global-standard certifications', 'Consistent product availability for projects', 'Competitive pricing and flexible procurement options', 'Quick response times and dependable support'] }
    ]
  },
  {
    title: 'Project Management Services',
    shortDesc: 'End-to-end project management delivering projects on time, within budget, and to world-class standards.',
    icon: 'project management services',
    color: 'from-teal-600 to-teal-700',
    details: [
      { text: 'At Rayob Engineering & Mgt. Co. Ltd., we provide end-to-end project management solutions that transform ideas into outstanding results. With disciplined execution and strategic foresight, we ensure every project is delivered to world-class standards.' },
      { section: 'Rayob&apos;s project management services cover', items: ['Project initiating, Planning & Feasibility Analysis', 'Design Coordination & Engineering Management', 'Schedule, Cost & Quality Management', 'Procurement & Contract Administration', 'Risk Assessment & Mitigation', 'Site Supervision & Construction Oversight', 'Handover, Documentation & Post-Project Support'] },
      { section: 'Our Strength', text: 'At Rayob, our strength lies in our ability to lead projects with integrity, insight, and innovation. We don&apos;t just manage projects — we elevate them.' }
    ]
  },
  {
    title: 'Risk Management Services',
    shortDesc: 'Proactive risk identification, evaluation, and mitigation for project success.',
    icon: 'risk management services',
    color: 'from-red-600 to-red-700',
    details: [
      { text: 'At Rayob Engineering & Mgt. Co. Ltd, risk management is a strategic foundation that shapes how we plan, execute, and deliver every project. Backed by the expertise of our MD/CEO, a distinguished MBA graduate in Risk Management, Rayob offers a refined, analytical, and proactive approach.' },
      { section: 'Our Risk Management Solutions Include', items: ['Enterprise & Project Risk Assessment - Comprehensive evaluation of threats', 'Risk Identification & Diagnostics - Uncovering hidden vulnerabilities', 'Quantitative & Qualitative Risk Analysis - Measuring impact and probability', 'Risk Mitigation Planning - Developing actionable strategies', 'Regulatory & Compliance Management - Alignment with standards and laws', 'Crisis Management & Contingency Planning - Response frameworks', 'Monitoring, Reporting & Continuous Control - Proactive tracking'] },
      { section: 'Our Commitment', text: 'At Rayob, we view risk management as a competitive advantage that strengthens project delivery and ensures consistent excellence.' }
    ]
  },
  {
    title: 'Training and Manpower Development',
    shortDesc: 'Skills development and continuous professional growth for teams.',
    icon: 'training and manpower development',
    color: 'from-purple-600 to-purple-700',
    details: [
      { text: 'At Rayob Engineering & Mgt. Co. Ltd, we believe that the true strength of any great institution is measured by the people it develops. Training and manpower development is more than a corporate function, it is a visionary investment into the future, raising champions and building a lasting legacy.' },
      { section: 'Our training philosophy revolves around three pillars', items: ['Continuous Professional Development - Pathways for growth through certifications and advanced workshops', 'Mentorship & Talent Grooming - Experienced professionals intentionally mentoring younger talents', 'Innovation-Driven Learning - Integrating emerging technologies and modern leadership techniques'] },
      { section: 'Our Commitment', text: 'At Rayob Engineering & Mgt. Co. Ltd, we are not merely building a company, we are building people. We train to transform. We mentor to multiply. We develop to dominate. This is the Rayob way. This is how we raise champions!' }
    ]
  },
  {
    title: 'General Contracts',
    shortDesc: 'Uplifting communities, protecting the environment, and creating opportunities for the next generation.',
    icon: 'general contracts',
    color: 'from-cyan-600 to-cyan-700',
    details: [
      { text: 'At Rayob Engineering & Mgt. Co. Ltd, our General Contracts service is built on a foundation of professionalism, technical expertise, and efficient project management. We take pride in delivering high-quality construction, engineering, and infrastructure projects that meet global standards and exceed client expectations.' },
      { section: "Rayob's General Contracts Commitment", items: ['Rayob Engineering & Mgt. Co. Ltd is dedicated to delivering every project with integrity, precision, and excellence. Our commitment extends beyond execution, we ensure that every contract is handled with complete transparency, accountability, and a results-driven mindset. We continuously invest in innovation, training, and modern technologies to guarantee that our clients receive the highest level of service and project performance.'] },
      { section: 'Our Legacy', text: 'At Rayob Engineering & Mgt. Co. Ltd, We handle the full cycle of project delivery—from concept and design to procurement, construction, installation, and commissioning. Our multidisciplinary team ensures seamless coordination, efficient workflows, and successful outcomes for projects of varying scale and complexity.' }
    ]
  }
]

export default function OurServices() {
  const [selectedService, setSelectedService] = useState(null)

  return (
    <>
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Our Services</h2>
            <p className="mt-4 text-lg text-gray-600">Comprehensive engineering, telecoms, and management solutions tailored to your enterprise needs.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <article
                key={service.title}
                onClick={() => setSelectedService(service)}
                className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1 p-6 flex flex-col h-full`}
              >
                <div className="flex flex-col items-start gap-4 h-full">
                  <div className={`bg-linear-to-br ${service.color} p-4 rounded-lg text-white w-12 h-12 flex items-center justify-center shrink-0`}>
                    <ServiceIcon name={service.title} />
                  </div>
                  <div className="grow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{service.shortDesc}</p>
                  </div>
                  <button className="text-indigo-600 font-semibold text-sm hover:text-indigo-700 mt-4 flex items-center gap-1">
                    Learn More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ServiceModal
        service={selectedService}
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
      />
    </>
  )
}
