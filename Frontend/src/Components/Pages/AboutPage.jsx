import React from 'react';
import { 
  Building2, 
  Trophy, 
  Users, 
  Clock, 
  CheckCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Wrench, 
  Shield, 
  HeartHandshake, 
  Sparkles, 
  Zap, 
  Home 
} from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Redefining Luxury Real Estate</h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">Creating exceptional living spaces for discerning clients since 1995</p>
          <button className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 px-8 rounded-full transition duration-300">
            Discover More
          </button>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Story</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Office" 
                className="rounded-lg shadow-2xl"
              />
            </div>
            <div>
              <p className="text-lg text-gray-300 mb-6">
                Founded in 1995, Elite Estates began with a vision to transform the luxury real estate landscape. What started as a boutique agency has grown into one of the most prestigious real estate firms in the country.
              </p>
              <p className="text-lg text-gray-300">
                Our commitment to excellence and personalized service has earned us the trust of the most discerning clients worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-amber-500">2500+</p>
              <p className="text-gray-400">Properties Sold</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-amber-500">95%</p>
              <p className="text-gray-400">Client Satisfaction</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-amber-500">28</p>
              <p className="text-gray-400">Years Experience</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-amber-500">150+</p>
              <p className="text-gray-400">Expert Agents</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "CEO & Founder",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              },
              {
                name: "Michael Chen",
                role: "Head of Sales",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              },
              {
                name: "Emma Williams",
                role: "Lead Designer",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              }
            ].map((member, index) => (
              <div key={index} className="bg-gray-900 rounded-lg overflow-hidden shadow-xl">
                <img src={member.image} alt={member.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-amber-500">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Trophy className="w-12 h-12 text-amber-500" />,
                title: "Award Winning",
                description: "Recognized excellence in luxury real estate with multiple industry awards"
              },
              {
                icon: <Users className="w-12 h-12 text-amber-500" />,
                title: "Expert Team",
                description: "Dedicated professionals with decades of combined experience"
              },
              {
                icon: <Shield className="w-12 h-12 text-amber-500" />,
                title: "Trusted Partner",
                description: "Your trusted advisor throughout the entire buying process"
              },
              {
                icon: <HeartHandshake className="w-12 h-12 text-amber-500" />,
                title: "Personalized Service",
                description: "Tailored solutions for your unique real estate needs"
              },
              {
                icon: <Sparkles className="w-12 h-12 text-amber-500" />,
                title: "Premium Properties",
                description: "Access to exclusive luxury properties and off-market listings"
              },
              {
                icon: <Clock className="w-12 h-12 text-amber-500" />,
                title: "24/7 Support",
                description: "Round-the-clock assistance for all your queries"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 bg-gray-800 rounded-lg">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Buyer Support Section */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-center">Exclusive New Buyer Support</h2>
          <p className="text-xl text-center text-gray-300 mb-12">Enjoy 3 months of complimentary maintenance services with every property purchase</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Wrench className="w-16 h-16 text-amber-500" />,
                title: "Plumbing Services",
                description: "Free plumbing maintenance and emergency repairs for 3 months",
                features: ["24/7 emergency support", "Leak repairs", "Fixture maintenance"]
              },
              {
                icon: <Zap className="w-16 h-16 text-amber-500" />,
                title: "Electrical Services",
                description: "Comprehensive electrical maintenance and safety checks",
                features: ["Electrical repairs", "Safety inspections", "Lighting fixes"]
              },
              {
                icon: <Home className="w-16 h-16 text-amber-500" />,
                title: "General Maintenance",
                description: "Regular maintenance checks and minor repairs",
                features: ["Monthly inspections", "Quick fixes", "Professional service"]
              }
            ].map((service, index) => (
              <div key={index} className="bg-gray-900 p-8 rounded-lg">
                <div className="flex justify-center mb-6">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-center">{service.title}</h3>
                <p className="text-gray-300 mb-6 text-center">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center text-gray-400">
                      <CheckCircle className="w-5 h-5 text-amber-500 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Client Testimonials</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                text: "Working with Elite Estates was an absolute pleasure. Their attention to detail and commitment to excellence exceeded our expectations.",
                author: "David Thompson",
                role: "Homeowner"
              },
              {
                text: "The team's expertise and professionalism made our property search seamless. We couldn't be happier with our new home.",
                author: "Lisa Anderson",
                role: "Property Investor"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-900 p-8 rounded-lg">
                <p className="text-lg mb-4">"{testimonial.text}"</p>
                <p className="font-bold">{testimonial.author}</p>
                <p className="text-amber-500">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Elite Estates</h3>
              <p className="text-gray-400">Luxury living redefined.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <div className="space-y-2">
                <p className="flex items-center text-gray-400"><Phone className="w-4 h-4 mr-2" /> +1 (555) 123-4567</p>
                <p className="flex items-center text-gray-400"><Mail className="w-4 h-4 mr-2" /> info@eliteestates.com</p>
                <p className="flex items-center text-gray-400"><MapPin className="w-4 h-4 mr-2" /> 123 Luxury Lane, NY</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-amber-500">About Us</a></li>
                <li><a href="#" className="hover:text-amber-500">Properties</a></li>
                <li><a href="#" className="hover:text-amber-500">Services</a></li>
                <li><a href="#" className="hover:text-amber-500">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-amber-500"><Facebook className="w-6 h-6" /></a>
                <a href="#" className="text-gray-400 hover:text-amber-500"><Twitter className="w-6 h-6" /></a>
                <a href="#" className="text-gray-400 hover:text-amber-500"><Instagram className="w-6 h-6" /></a>
                <a href="#" className="text-gray-400 hover:text-amber-500"><Linkedin className="w-6 h-6" /></a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Elite Estates. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;